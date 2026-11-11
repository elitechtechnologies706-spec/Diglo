import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";

const COOKIE_NAME = "diglo_admin_session";
const COOKIE_PATH = "/api/diglo/admin";
const SESSION_TTL_SECONDS = 8 * 60 * 60;

function configuredSecret(value: string | undefined): value is string {
  return Boolean(value && value.length > 0 && !value.startsWith("PASTE_"));
}

export function adminAuthConfigured(): boolean {
  return configuredSecret(process.env.ADMIN_PASSWORD) && configuredSecret(process.env.SESSION_SECRET);
}

export function verifyAdminPassword(candidate: string): boolean | null {
  const expected = process.env.ADMIN_PASSWORD;
  if (!configuredSecret(expected) || !configuredSecret(process.env.SESSION_SECRET)) return null;

  const candidateBytes = Buffer.from(candidate);
  const expectedBytes = Buffer.from(expected);
  const length = Math.max(candidateBytes.length, expectedBytes.length);
  const candidatePadded = Buffer.alloc(length);
  const expectedPadded = Buffer.alloc(length);
  candidateBytes.copy(candidatePadded);
  expectedBytes.copy(expectedPadded);
  return candidateBytes.length === expectedBytes.length && timingSafeEqual(candidatePadded, expectedPadded);
}

function signature(payload: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!configuredSecret(secret)) throw new Error("Admin sessions are not configured.");
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function setAdminSession(res: Response): void {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${expiresAt}.${randomBytes(24).toString("base64url")}`;
  const value = `${payload}.${signature(payload)}`;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=${COOKIE_PATH}; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; SameSite=Strict${secure}`,
  );
}

export function clearAdminSession(res: Response): void {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=${COOKIE_PATH}; Max-Age=0; HttpOnly; SameSite=Strict${secure}`,
  );
}

function readCookie(req: Request, name: string): string | null {
  const header = req.headers.cookie;
  if (!header) return null;
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0 || part.slice(0, separator).trim() !== name) continue;
    try {
      return decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      return null;
    }
  }
  return null;
}

export function hasValidAdminSession(req: Request): boolean {
  if (!configuredSecret(process.env.SESSION_SECRET)) return false;
  const value = readCookie(req, COOKIE_NAME);
  if (!value) return false;
  const [expiresAtText, nonce, suppliedSignature, ...extra] = value.split(".");
  if (!expiresAtText || !nonce || !suppliedSignature || extra.length > 0) return false;
  const expiresAt = Number(expiresAtText);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now || expiresAt > now + SESSION_TTL_SECONDS + 60) return false;

  const payload = `${expiresAtText}.${nonce}`;
  const expectedSignature = Buffer.from(signature(payload));
  const actualSignature = Buffer.from(suppliedSignature);
  return actualSignature.length === expectedSignature.length && timingSafeEqual(actualSignature, expectedSignature);
}

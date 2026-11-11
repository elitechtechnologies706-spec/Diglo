import { Router, type IRouter } from "express";
import {
  DigloAdminLoginBody,
  DigloAdminLoginResponse,
  DigloAdminLogoutResponse,
  ListDigloQuotesResponse,
  MarkDigloQuoteDoneBody,
  MarkDigloQuoteDoneParams,
  MarkDigloQuoteDoneResponse,
} from "@workspace/api-zod";
import {
  adminAuthConfigured,
  clearAdminSession,
  hasValidAdminSession,
  setAdminSession,
  verifyAdminPassword,
} from "../lib/diglo-admin-auth";

const router: IRouter = Router();
const failedLogins = new Map<string, { count: number; resetAt: number }>();
const MAX_FAILED_LOGINS = 10;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const quoteColumns = "id,code,name,phone,country,currency,service,quantity,total_text,status,created_at";

function loginKey(req: Parameters<Parameters<typeof router.post>[1]>[0]): string {
  return req.ip || req.socket.remoteAddress || "unknown";
}

function hitLoginLimit(key: string): boolean {
  const now = Date.now();
  const previous = failedLogins.get(key);
  if (!previous || previous.resetAt <= now) {
    failedLogins.set(key, { count: 0, resetAt: now + LOGIN_WINDOW_MS });
    return false;
  }
  return previous.count >= MAX_FAILED_LOGINS;
}

function recordFailedLogin(key: string): void {
  if (failedLogins.size > 1000) {
    const now = Date.now();
    for (const [entry, state] of failedLogins) {
      if (state.resetAt <= now) failedLogins.delete(entry);
    }
  }
  const state = failedLogins.get(key);
  if (state) state.count += 1;
}

function supabaseConfig(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key || url.startsWith("PASTE_") || key.startsWith("PASTE_")) return null;
  return { url: url.replace(/\/+$/, ""), key };
}

function serviceHeaders(key: string, extra?: Record<string, string>): Record<string, string> {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    Accept: "application/json",
    ...extra,
  };
}

router.post("/diglo/admin/login", (req, res): void => {
  const parsed = DigloAdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Enter the admin password." });
    return;
  }
  if (!adminAuthConfigured()) {
    res.status(503).json({ error: "Admin access is not configured in Replit Secrets." });
    return;
  }

  const key = loginKey(req);
  if (hitLoginLimit(key)) {
    res.status(429).json({ error: "Too many attempts. Please wait 15 minutes and try again." });
    return;
  }

  if (!verifyAdminPassword(parsed.data.password)) {
    recordFailedLogin(key);
    req.log.warn("Rejected Diglo admin login");
    res.status(401).json({ error: "Incorrect admin password." });
    return;
  }

  failedLogins.delete(key);
  setAdminSession(res);
  res.json(DigloAdminLoginResponse.parse({ authenticated: true }));
});

router.post("/diglo/admin/logout", (_req, res): void => {
  clearAdminSession(res);
  res.json(DigloAdminLogoutResponse.parse({ signedOut: true }));
});

router.get("/diglo/admin/quotes", async (req, res): Promise<void> => {
  if (!hasValidAdminSession(req)) {
    res.status(401).json({ error: "Admin sign-in required." });
    return;
  }
  const config = supabaseConfig();
  if (!config) {
    res.status(503).json({ error: "Supabase service connection is not configured." });
    return;
  }

  try {
    const url = new URL(`${config.url}/rest/v1/quotes`);
    url.searchParams.set("select", quoteColumns);
    url.searchParams.set("order", "created_at.desc");
    url.searchParams.set("limit", "1000");
    const response = await fetch(url, { headers: serviceHeaders(config.key) });
    if (!response.ok) {
      req.log.error({ status: response.status }, "Supabase rejected the quote list request");
      res.status(503).json({ error: "Could not load quotes from Supabase." });
      return;
    }
    const payload: unknown = await response.json();
    const parsed = ListDigloQuotesResponse.safeParse(payload);
    if (!parsed.success) {
      req.log.error({ issueCount: parsed.error.issues.length }, "Supabase quote data did not match the API schema");
      res.status(502).json({ error: "Supabase returned quote data in an unexpected format." });
      return;
    }
    res.json(parsed.data);
  } catch {
    req.log.error("Supabase quote list request failed");
    res.status(503).json({ error: "Could not connect to Supabase." });
  }
});

router.patch("/diglo/admin/quotes/:id", async (req, res): Promise<void> => {
  if (!hasValidAdminSession(req)) {
    res.status(401).json({ error: "Admin sign-in required." });
    return;
  }
  const params = MarkDigloQuoteDoneParams.safeParse(req.params);
  const body = MarkDigloQuoteDoneBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid quote update." });
    return;
  }
  const config = supabaseConfig();
  if (!config) {
    res.status(503).json({ error: "Supabase service connection is not configured." });
    return;
  }

  try {
    const url = new URL(`${config.url}/rest/v1/quotes`);
    url.searchParams.set("id", `eq.${params.data.id}`);
    url.searchParams.set("select", quoteColumns);
    const response = await fetch(url, {
      method: "PATCH",
      headers: serviceHeaders(config.key, {
        "Content-Type": "application/json",
        Prefer: "return=representation",
      }),
      body: JSON.stringify(body.data),
    });
    if (!response.ok) {
      req.log.error({ status: response.status }, "Supabase rejected the quote status update");
      res.status(503).json({ error: "Could not update this quote." });
      return;
    }
    const payload: unknown = await response.json();
    if (!Array.isArray(payload) || payload.length === 0) {
      res.status(404).json({ error: "Quote not found." });
      return;
    }
    const parsed = MarkDigloQuoteDoneResponse.safeParse(payload[0]);
    if (!parsed.success) {
      req.log.error({ issueCount: parsed.error.issues.length }, "Updated quote did not match the API schema");
      res.status(502).json({ error: "Supabase returned quote data in an unexpected format." });
      return;
    }
    res.json(parsed.data);
  } catch {
    req.log.error("Supabase quote update request failed");
    res.status(503).json({ error: "Could not connect to Supabase." });
  }
});

export default router;

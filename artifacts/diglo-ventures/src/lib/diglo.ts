import { createClient, type User } from "@supabase/supabase-js";
import { CONTACT } from "@/lib/site";

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
export const supabase = url && key ? createClient(url, key) : null;
export const STATUSES = ["New", "Contacted", "Quoted", "Paid", "Delivered"] as const;
export const STAGES = ["Received", "Designing", "Awaiting Approval", "Printing", "Ready", "Delivered"] as const;
export type LeadStatus = typeof STATUSES[number];
export type OrderStage = typeof STAGES[number];
export type Lead = {
  id: string; ref: string; name: string; phone: string; service: string;
  quantity: number; message: string; status: LeadStatus; created_at: string;
};
export type Order = {
  id: string; ref: string; phone: string; service: string;
  status: LeadStatus; stage: OrderStage; updated_at: string;
};
export type TrackedOrder = Pick<Order, "ref" | "service" | "stage" | "updated_at">;

export function requireSupabase() {
  if (!supabase) throw new Error("Supabase is not connected in this preview. Please contact Diglo Ventures by WhatsApp or email.");
  return supabase;
}

export function isAdmin(user: User | null | undefined): boolean {
  return user?.app_metadata?.role === "admin";
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  let normalized = digits.startsWith("00") ? digits.slice(2) : digits;
  if (normalized.startsWith("0")) normalized = "256" + normalized.slice(1);
  else if (normalized.length === 9) normalized = "256" + normalized;
  if (!/^[1-9]\d{7,14}$/.test(normalized)) throw new Error("Enter a valid phone number with country code.");
  return "+" + normalized;
}

export function whatsappUrl(message: string): string | null {
  const digits = CONTACT.whatsapp.replace(/\D/g, "");
  if (!/^[1-9]\d{7,14}$/.test(digits)) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function makeQuoteRef() {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return "DG-" + [...bytes].map((b) => alphabet[b % alphabet.length]).join("");
}

export async function lookupOrders(query: string): Promise<TrackedOrder[]> {
  const cleaned = query.trim().toUpperCase();
  const lookup = /^DG-[A-Z0-9]{4}$/.test(cleaned) ? cleaned : normalizePhone(query);
  const { data, error } = await requireSupabase().rpc("diglo_track_orders", { p_query: lookup });
  if (error) throw new Error(error.message);
  return (data || []) as TrackedOrder[];
}

async function adminClient() {
  const client = requireSupabase();
  const { data, error } = await client.auth.getUser();
  if (error) throw new Error(error.message);
  if (!isAdmin(data.user)) throw new Error("This account is not an authorised Diglo Ventures administrator.");
  return client;
}

export async function listLeads(): Promise<Lead[]> {
  const { data, error } = await (await adminClient()).from("diglo_leads").select("*").order("created_at", { ascending: false }).limit(1000);
  if (error) throw new Error(error.message);
  return data as Lead[];
}
export async function listOrders(): Promise<Order[]> {
  const { data, error } = await (await adminClient()).from("diglo_orders").select("*").order("updated_at", { ascending: false }).limit(1000);
  if (error) throw new Error(error.message);
  return data as Order[];
}
export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  if (!STATUSES.includes(status)) throw new Error("Invalid lead status.");
  const { data, error } = await (await adminClient()).from("diglo_leads").update({ status }).eq("id", id).select("id").single();
  if (error || !data) throw new Error(error?.message || "The lead could not be updated.");
}
export async function updateOrder(id: string, input: { status?: LeadStatus; stage?: OrderStage }): Promise<void> {
  if (input.status && !STATUSES.includes(input.status)) throw new Error("Invalid order status.");
  if (input.stage && !STAGES.includes(input.stage)) throw new Error("Invalid order stage.");
  const { data, error } = await (await adminClient()).from("diglo_orders")
    .update({ ...input, updated_at: new Date().toISOString() }).eq("id", id).select("id").single();
  if (error || !data) throw new Error(error?.message || "The order could not be updated.");
}
export async function createOrderFromLead(lead: Lead): Promise<void> {
  const { error } = await (await adminClient()).from("diglo_orders").insert({
    ref: lead.ref, phone: lead.phone, service: lead.service, status: lead.status, stage: "Received",
  });
  if (error) throw new Error(error.message);
}

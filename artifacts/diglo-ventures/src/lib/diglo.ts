import { createClient, type User } from "@supabase/supabase-js";

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
export type LeadInput = Pick<Lead, "name" | "phone" | "service" | "quantity" | "message">;
type PendingLead = LeadInput & { id: string; ref: string; queuedAt: number };
const QUEUE_KEY = "diglo_pending_leads_v1";
const MAX_QUEUE = 20;
const QUEUE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function requireSupabase() {
  if (!supabase) throw new Error("Supabase is not connected in this preview. Please contact Diglo Ventures by WhatsApp or email.");
  return supabase;
}

export function isAdmin(user: User | null | undefined): boolean {
  return user?.app_metadata?.role === "admin";
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? "256" + digits.slice(1) : digits.length === 9 ? "256" + digits : digits;
  if (!/^256[1-9]\d{8}$/.test(normalized)) throw new Error("Enter a valid Ugandan phone number, for example +256 followed by 9 digits.");
  return "+" + normalized;
}

export function whatsappUrl(message: string): string | null {
  const digits = (import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  if (!/^[1-9]\d{7,14}$/.test(digits)) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function pendingLeads(): PendingLead[] {
  const raw = localStorage.getItem(QUEUE_KEY);
  if (!raw) return [];
  try {
    const items: unknown = JSON.parse(raw);
    if (!Array.isArray(items)) throw new Error("Invalid queue");
    return items.filter((item): item is PendingLead =>
      typeof item?.id === "string" && typeof item?.ref === "string" &&
      typeof item?.name === "string" && typeof item?.phone === "string" &&
      typeof item?.service === "string" && typeof item?.message === "string" &&
      Number.isInteger(item?.quantity) && typeof item?.queuedAt === "number" &&
      Date.now() - item.queuedAt < QUEUE_TTL_MS);
  } catch {
    throw new Error("Your saved quote queue could not be read. Please contact Diglo before clearing browser data.");
  }
}

function saveQueue(items: PendingLead[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
}

function makeRef() {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return "DG-" + [...bytes].map((b) => alphabet[b % alphabet.length]).join("");
}

async function persistLead(lead: PendingLead): Promise<string> {
  const client = requireSupabase();
  const { data, error } = await client.rpc("diglo_submit_lead", {
    p_id: lead.id, p_ref: lead.ref, p_name: lead.name, p_phone: lead.phone,
    p_service: lead.service, p_quantity: lead.quantity, p_message: lead.message,
  });
  if (error) throw new Error(error.message);
  if (typeof data !== "string" || !/^DG-[A-Z0-9]{4}$/.test(data)) {
    throw new Error("The server did not confirm a quote reference.");
  }
  return data;
}

let retrying: Promise<number> | null = null;
export function retryPendingLeads(): Promise<number> {
  if (retrying) return retrying;
  retrying = (async () => {
    if (!supabase || !navigator.onLine) return 0;
    const initial = pendingLeads();
    let sent = 0;
    for (const lead of initial) {
      try {
        const ref = await persistLead(lead);
        // Read again after awaiting so a new quote submitted in the meantime is retained.
        saveQueue(pendingLeads().filter((p) => p.id !== lead.id));
        window.dispatchEvent(new CustomEvent("diglo:lead-sent", { detail: { ref, queuedRef: lead.ref } }));
        sent++;
      } catch {
        // Retain the item; retry on the next online event or explicit retry.
      }
    }
    return sent;
  })().finally(() => { retrying = null; });
  return retrying;
}

export async function submitLead(input: LeadInput): Promise<{ ref: string; sent: boolean }> {
  const phone = normalizePhone(input.phone);
  const name = input.name.trim();
  const service = input.service.trim();
  const message = input.message.trim();
  if (name.length < 2 || name.length > 120) throw new Error("Enter a name between 2 and 120 characters.");
  if (!service || service.length > 120) throw new Error("Choose a service.");
  if (!Number.isInteger(input.quantity) || input.quantity < 1 || input.quantity > 1000000) throw new Error("Enter a valid quantity.");
  if (message.length > 5000) throw new Error("Please keep your message under 5,000 characters.");
  const queue = pendingLeads();
  if (queue.length >= MAX_QUEUE) throw new Error("Your offline queue is full. Retry the saved requests before submitting another.");
  const lead: PendingLead = { ...input, name, service, message, phone, id: crypto.randomUUID(), ref: makeRef(), queuedAt: Date.now() };
  // Write before attempting the network: a tab close cannot silently lose the lead.
  try { saveQueue([...queue, lead]); }
  catch { throw new Error("This browser cannot save your quote for retry. Please allow local storage or contact Diglo directly."); }
  try {
    const ref = await persistLead(lead);
    saveQueue(pendingLeads().filter((p) => p.id !== lead.id));
    return { ref, sent: true };
  } catch {
    return { ref: lead.ref, sent: false };
  }
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
  if (!isAdmin(data.user)) throw new Error("This account is not an authorised Diglo administrator.");
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

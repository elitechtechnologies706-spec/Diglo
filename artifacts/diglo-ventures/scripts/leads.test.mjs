import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { webcrypto } from "node:crypto";
import { test } from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/diglo.ts", import.meta.url), "utf8");
function load(env = {}, rpc = null) {
  const store = new Map();
  const code = ts.transpileModule(source.replaceAll("import.meta.env", JSON.stringify(env)), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const context = {
    exports: {}, crypto: webcrypto, navigator: { onLine: true }, CustomEvent,
    window: new EventTarget(),
    localStorage: { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) },
    require: (specifier) => specifier === "@/lib/site"
      ? { CONTACT: { whatsapp: "254721928484" } }
      : { createClient: () => ({ rpc }) },
  };
  vm.runInNewContext(code, context);
  return { api: context.exports, store };
}
const input = { name: "QA Test", phone: "0700000000", service: "Business Printing", quantity: 100, message: "Test only" };
test("normalises Uganda phone input and rejects malformed numbers", () => {
  const { api } = load();
  assert.equal(api.normalizePhone("0700000000"), "+256700000000");
  assert.equal(api.normalizePhone("700000000"), "+256700000000");
  assert.equal(api.normalizePhone("+256 700 000 000"), "+256700000000");
  assert.equal(api.normalizePhone("+254 721 928 484"), "+254721928484");
  assert.throws(() => api.normalizePhone("123"));
});
test("uses the single testing WhatsApp destination", () => {
  const { api } = load();
  const url = new URL(api.whatsappUrl("Hello Diglo Ventures"));
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/254721928484");
  assert.equal(url.searchParams.get("text"), "Hello Diglo Ventures");
});
test("tracks by reference and normalized phone", async () => {
  const calls = [];
  const { api } = load(
    { VITE_SUPABASE_URL: "https://test.supabase.co", VITE_SUPABASE_ANON_KEY: "public-test" },
    async (name, args) => {
      calls.push({ name, args });
      return { data: [{ ref: "DG-AB12", service: "Printing Services", stage: "Received", updated_at: "2026-01-01T00:00:00Z" }], error: null };
    },
  );
  const byRef = await api.lookupOrders("dg-ab12");
  assert.equal(calls[0].name, "diglo_track_orders");
  assert.equal(calls[0].args.p_query, "DG-AB12");
  assert.equal(byRef[0].stage, "Received");
  await api.lookupOrders("0700 000 000");
  assert.equal(calls[1].args.p_query, "+256700000000");
});
test("rejects invalid tracking query", async () => {
  const { api } = load();
  await assert.rejects(api.lookupOrders("not-a-code-or-phone"), /valid phone number/);
});
test("unconfigured Supabase queues without saying sent", async () => {
  const { api, store } = load();
  const result = await api.submitLead(input);
  assert.equal(result.sent, false);
  assert.match(result.ref, /^DG-[A-Z0-9]{4}$/);
  assert.equal(JSON.parse(store.get("diglo_pending_leads_v1")).length, 1);
  assert.equal(await api.retryPendingLeads(), 0);
});
test("server acknowledgement removes queued record and preserves returned reference", async () => {
  const { api, store } = load({ VITE_SUPABASE_URL: "https://test.supabase.co", VITE_SUPABASE_ANON_KEY: "public-test" },
    async () => ({ data: "DG-TEST", error: null }));
  const result = await api.submitLead(input);
  assert.equal(result.sent, true);
  assert.equal(result.ref, "DG-TEST");
  assert.equal(JSON.parse(store.get("diglo_pending_leads_v1")).length, 0);
});
test("network failure remains queued and a retry removes it only after acknowledgement", async () => {
  let fail = true;
  const { api, store } = load({ VITE_SUPABASE_URL: "https://test.supabase.co", VITE_SUPABASE_ANON_KEY: "public-test" },
    async () => fail ? { error: { message: "Offline" }, data: null } : { data: "DG-TEST", error: null });
  assert.equal((await api.submitLead(input)).sent, false);
  assert.equal(JSON.parse(store.get("diglo_pending_leads_v1")).length, 1);
  fail = false;
  assert.equal(await api.retryPendingLeads(), 1);
  assert.equal(JSON.parse(store.get("diglo_pending_leads_v1")).length, 0);
});
test("admin flag must be server-owned app metadata, not user metadata", () => {
  const { api } = load();
  assert.equal(api.isAdmin({ user_metadata: { role: "admin" } }), false);
  assert.equal(api.isAdmin({ app_metadata: { role: "admin" } }), true);
});

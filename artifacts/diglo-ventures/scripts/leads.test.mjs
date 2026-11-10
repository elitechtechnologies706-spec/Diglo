import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { webcrypto } from "node:crypto";
import { test } from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/diglo.ts", import.meta.url), "utf8");
function load(env = {}, rpc = null) {
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
  return { api: context.exports };
}
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
test("generates a local quote code and includes it with details in the WhatsApp link", () => {
  const { api } = load();
  const ref = api.makeQuoteRef();
  assert.match(ref, /^DG-[A-Z0-9]{4}$/);
  const message = api.buildQuoteMessage({ ref, service: "Printing Services", quantity: 100, details: "Matte finish", name: "QA Test" });
  const url = new URL(api.whatsappUrl(message));
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/254721928484");
  assert.equal(url.searchParams.get("text"), message);
  assert.equal(typeof api.submitLead, "undefined");
  assert.equal(typeof api.retryPendingLeads, "undefined");
});
test("admin flag must be server-owned app metadata, not user metadata", () => {
  const { api } = load();
  assert.equal(api.isAdmin({ user_metadata: { role: "admin" } }), false);
  assert.equal(api.isAdmin({ app_metadata: { role: "admin" } }), true);
});

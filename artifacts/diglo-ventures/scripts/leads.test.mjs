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
    require: () => ({ createClient: () => ({ rpc }) }),
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
  assert.throws(() => api.normalizePhone("123"));
});
test("no invented WhatsApp destination", () => {
  const { api } = load();
  assert.equal(api.whatsappUrl("Hello"), null);
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

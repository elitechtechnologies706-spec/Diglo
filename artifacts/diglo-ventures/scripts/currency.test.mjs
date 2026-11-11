import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { test } from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/site.ts", import.meta.url), "utf8");
const code = ts.transpileModule(source.replaceAll("import.meta.env", JSON.stringify({ BASE_URL: "/" })), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const context = { exports: {} };
vm.runInNewContext(code, context);
const { api } = { api: context.exports };

test("formats UGX, KSH and USD with the locked exchange rates", () => {
  assert.equal(api.formatPrice(3800, "USD"), "$1");
  assert.equal(api.formatPrice(3800, "KSH"), "130 KSH");
  assert.equal(api.formatPrice(45000, "UGX"), "45,000 UGX");
  assert.equal(api.formatPrice(38000, "USD"), "$10");
});

test("suggests a currency from country without removing the currency override", () => {
  assert.equal(api.suggestedCurrency("Uganda"), "UGX");
  assert.equal(api.suggestedCurrency("Kenya"), "KSH");
  for (const country of ["Tanzania", "Rwanda", "Burundi", "South Sudan", "Other"]) {
    assert.equal(api.suggestedCurrency(country), "USD");
  }
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { test } from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/calculator.ts", import.meta.url), "utf8");
function calculator(env = {}) {
  const code = ts.transpileModule(source.replaceAll("import.meta.env", JSON.stringify(env)), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const context = { exports: {} };
  vm.runInNewContext(code, context);
  return context.exports.calculateEstimate;
}
const baseInput = { productId: "business-cards", quantity: 100, paper: "standard", delivery: "pickup" };
test("100 standard business cards, pickup = 80,000 UGX", () => {
  const result = calculator()(baseInput);
  assert.equal(result.total, 80000);
  assert.equal(result.base + result.paper + result.delivery, result.total);
});
test("Kampala delivery adds 15,000 UGX", () => {
  assert.equal(calculator()({ ...baseInput, delivery: "kampala" }).total, 95000);
});
test("500+ gets 10% off the base, not delivery", () => {
  const result = calculator()({ ...baseInput, quantity: 500, delivery: "kampala" });
  assert.equal(result.discount, 40000);
  assert.equal(result.total, 375000);
});
test("499 units does not receive a discount", () => {
  assert.equal(calculator()({ ...baseInput, quantity: 499 }).discount, 0);
});
test("premium and upcountry rates must not default silently to free", () => {
  assert.equal(calculator()({ ...baseInput, paper: "premium" }).total, null);
  assert.equal(calculator()({ ...baseInput, delivery: "upcountry" }).total, null);
});
test("configured surcharges calculate correctly", () => {
  const result = calculator({ VITE_PREMIUM_PAPER_PER_ITEM: "100", VITE_UPCOUNTRY_DELIVERY_UGX: "30000" })({
    ...baseInput, paper: "premium", delivery: "upcountry",
  });
  assert.equal(result.paper, 10000);
  assert.equal(result.delivery, 30000);
  assert.equal(result.total, 120000);
});
test("invalid services and quantities are rejected", () => {
  const calculate = calculator();
  for (const quantity of [0, 9, 5001, NaN, 10.5]) {
    assert.throws(() => calculate({ ...baseInput, quantity }));
  }
  assert.throws(() => calculate({ ...baseInput, productId: "unknown" }));
});
test("range endpoints are valid", () => {
  assert.equal(calculator()({ ...baseInput, quantity: 10 }).total, 8000);
  assert.equal(calculator()({ ...baseInput, quantity: 5000 }).total, 3600000);
});

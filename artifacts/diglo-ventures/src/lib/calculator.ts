export const PRODUCTS = [
  { id: "business-cards", name: "Business Cards", base: 80000, baseQty: 100 },
  { id: "flyers", name: "Flyers", base: 120000, baseQty: 100 },
  { id: "logo", name: "Logo Complete", base: 250000, baseQty: 1 },
  { id: "banner", name: "Banner 3x2", base: 150000, baseQty: 1 },
  { id: "tshirt", name: "T-Shirt", base: 35000, baseQty: 1 },
  { id: "stickers", name: "Stickers", base: 60000, baseQty: 100 },
] as const;

export type EstimateInput = {
  productId: string;
  quantity: number;
  paper: "standard" | "premium";
  delivery: "pickup" | "kampala" | "upcountry";
};

function optionalRate(value: unknown): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const rate = Number(value);
  return Number.isFinite(rate) && rate >= 0 ? rate : null;
}

export function calculateEstimate(input: EstimateInput) {
  const product = PRODUCTS.find((p) => p.id === input.productId);
  if (!product) throw new Error("Select a valid service.");
  if (!Number.isInteger(input.quantity) || input.quantity < 10 || input.quantity > 5000) {
    throw new Error("Quantity must be a whole number between 10 and 5,000.");
  }
  const undiscountedBase = product.base * (input.quantity / product.baseQty);
  const discount = input.quantity >= 500 ? Math.round(undiscountedBase * 0.1) : 0;
  const base = Math.round(undiscountedBase) - discount;
  const premiumRate = optionalRate(import.meta.env.VITE_PREMIUM_PAPER_PER_ITEM);
  const paper = input.paper === "standard" ? 0 : premiumRate === null ? null : Math.round(premiumRate * input.quantity);
  const delivery = input.delivery === "pickup" ? 0 : input.delivery === "kampala" ? 15000
    : optionalRate(import.meta.env.VITE_UPCOUNTRY_DELIVERY_UGX);
  const total = paper === null || delivery === null ? null : base + paper + delivery;
  return { base, paper, delivery, discount, total, needsConfirmation: total === null };
}

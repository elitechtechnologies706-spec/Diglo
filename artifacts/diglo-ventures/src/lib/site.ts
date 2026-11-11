// TESTING ONLY: replace this one number before the live launch.
const WHATSAPP_DIGITS = "254721928484";
export const CONTACT = {
  email: "hello@digloventures.com",
  phone: `+${WHATSAPP_DIGITS.slice(0, 3)} ${WHATSAPP_DIGITS.slice(3, 6)} ${WHATSAPP_DIGITS.slice(6, 9)} ${WHATSAPP_DIGITS.slice(9)}`,
  whatsapp: WHATSAPP_DIGITS,
  hours: "Mon–Sat, 8AM–7PM EAT",
};

export const SERVICE_NAMES = [
  "Gift Packs",
  "Corporate Uniforms",
  "PPE",
  "Printing Services",
  "Not sure yet",
];

export const COUNTRIES = ["Uganda", "Kenya", "Tanzania", "Rwanda", "Burundi", "South Sudan", "Other"] as const;
export type Country = typeof COUNTRIES[number];
export type Currency = "UGX" | "KSH" | "USD";

export const CURRENCY_OPTIONS: { code: Currency; label: string; country: string; flag: string }[] = [
  { code: "UGX", label: "Uganda Shilling", country: "Uganda", flag: "🇺🇬" },
  { code: "KSH", label: "Kenya Shilling", country: "Kenya", flag: "🇰🇪" },
  { code: "USD", label: "US Dollar", country: "International", flag: "💵" },
];

export function suggestedCurrency(country: Country): Currency {
  if (country === "Uganda") return "UGX";
  if (country === "Kenya") return "KSH";
  return "USD";
}

export function convertUGX(ugx: number, currency: Currency): number {
  if (currency === "UGX") return Math.round(ugx);
  if (currency === "KSH") return Math.round(ugx / 29.23);
  return Math.round(ugx / 3800);
}

export function formatPrice(ugx: number, currency: Currency): string {
  const amount = convertUGX(ugx, currency).toLocaleString("en-US");
  if (currency === "USD") return `$${amount}`;
  return `${amount} ${currency}`;
}

export function formatUGX(n: number) {
  return formatPrice(n, "UGX");
}

export function quoteMailto(o: { service: string; name: string; quantity: string; details: string }) {
  const subject = `Quote request: ${o.service || "General"}${o.name ? " — " + o.name : ""}`;
  const body = [
    "Hello Diglo Ventures,",
    "",
    "I would like a quote.",
    "",
    `Service: ${o.service || "-"}`,
    `Name: ${o.name || "-"}`,
    `Quantity: ${o.quantity || "-"}`,
    "",
    "Details:",
    o.details || "-",
  ].join("\n");
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function trackMailto(o: { name: string; reference: string; note: string }) {
  const subject = `Order update request${o.reference ? ": " + o.reference : ""}`;
  const body = [
    "Hello Diglo Ventures,",
    "",
    "Please send me an update on my order.",
    "",
    `Name: ${o.name || "-"}`,
    `Order reference: ${o.reference || "-"}`,
    "",
    "Notes:",
    o.note || "-",
  ].join("\n");
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

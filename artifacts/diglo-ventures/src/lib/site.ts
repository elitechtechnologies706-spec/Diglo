// Central contact configuration. Phone and WhatsApp are intentionally empty:
// no verified numbers have been supplied. Do not invent numbers.
export const CONTACT = {
  email: "hello@digloventures.com",
  phone: "",
  whatsapp: "",
  hours: "Mon–Sat, 8AM–7PM EAT",
};

export const SERVICE_NAMES = [
  "Gift Packs",
  "Corporate Uniforms",
  "PPE",
  "Printing Services",
  "Not sure yet",
];

export function formatUGX(n: number) {
  return n.toLocaleString("en-US") + " UGX";
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

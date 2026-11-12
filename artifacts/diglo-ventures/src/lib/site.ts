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
];

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

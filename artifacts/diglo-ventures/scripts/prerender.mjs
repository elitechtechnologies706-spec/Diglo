// Post-build static HTML generation for public routes.
// Writes per-route index.html with title, meta, OG, canonical, JSON-LD and
// crawlable static content. Generates robots.txt + sitemap.xml only when
// VITE_SITE_URL is an approved absolute origin; otherwise keeps preview-safe files.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist", "public");
const data = JSON.parse(fs.readFileSync(path.join(root, "src/lib/seo-data.json"), "utf8"));
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

let site = (process.env.VITE_SITE_URL || "").trim().replace(/\/$/, "");
if (site && !/^https:\/\/[a-z0-9.-]+(:\d+)?$/i.test(site)) {
  console.warn(`[prerender] Ignoring VITE_SITE_URL "${site}": must be an absolute https origin.`);
  site = "";
}
const indexable = !!site;
const base = (process.env.BASE_PATH || "/").replace(/\/?$/, "/");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (p) => (site ? site + p : null);

const heroImage = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80";
const business = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Diglo Ventures",
  description: data.homeDescription,
  email: "hello@digloventures.com",
  slogan: "Designed Today. Printed Tomorrow. Delivered To You.",
  address: { "@type": "PostalAddress", addressLocality: "Kampala", addressCountry: "UG" },
  areaServed: ["Uganda", "Kenya", "Tanzania", "Rwanda", "Burundi", "South Sudan"],
  paymentAccepted: "Mobile Money, Bank Transfer",
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "08:00", closes: "19:00" }],
  ...(site ? { url: site + "/", image: heroImage } : {}),
};
const faqLd = (faqs) => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
const productLd = (name, url) => ({
  "@context": "https://schema.org", "@type": "Product", name, brand: { "@type": "Brand", name: "Diglo Ventures" },
  description: "Made to order. Request a customized quote from Diglo Ventures.",
  ...(url ? { url } : {}),
});

const routes = [
  {
    path: "/", title: data.homeTitle, description: data.homeDescription,
    ld: [business, faqLd(data.homeFaqs), ...data.pages.map((p) => productLd(p.productName, abs(`/${p.slug}`)))],
    body: `<h1>Branding and Printing Services in Kampala, Uganda</h1><p>Based in Kampala, serving East Africa.</p><h2>${esc(data.homeQuestion)}</h2><p>${esc(data.homeAnswer)}</p><h2>Get a customized quote</h2><p>Tell us what you need. Diglo Ventures will confirm the details on WhatsApp.</p><h2>FAQ</h2>${data.homeFaqs.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}<nav>${data.pages.map((p) => `<a href="${base}${p.slug}">${esc(p.h1)}</a>`).join(" ")}</nav>`,
  },
  ...data.pages.map((p) => ({
    path: `/${p.slug}`, title: p.title, description: p.description,
    ld: [business, faqLd(p.faqs), productLd(p.productName, abs(`/${p.slug}`))],
    body: `<h1>${esc(p.h1)}</h1><h2>${esc(p.question)}</h2><p>${esc(p.answer)}</p><p>Customized Quote - Price Depends on Quantity &amp; Branding</p><h2>FAQ</h2>${p.faqs.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}<p><a href="${base}quote?product=${encodeURIComponent(p.productName)}">Get a customized quote from Diglo Ventures</a></p>`,
  })),
  { path: "/track", title: "Track Your Order | Diglo Ventures", description: "Check the stage of your Diglo Ventures order using your DG order code or phone number.", ld: [], body: `<h1>Where is my order?</h1>` },
  { path: "/quote", title: "Request a Customized Quote | Diglo Ventures", description: "Request a customized product quote from Diglo Ventures.", ld: [], body: `<h1>Get a customized quote</h1>`, noindex: true },
  { path: "/about", title: "About Diglo Ventures | Kampala Branding and Printing", description: "Meet Diglo Ventures, based in Kampala and serving East Africa.", ld: [business], body: `<h1>Branding Your Identity. Securing Your Progress.</h1><p>Based in Kampala, Diglo Ventures is Uganda's premier one-stop corporate supply partner, dedicated to 'Branding Your Identity. Securing Your Progress.' We bridge the gap between corporate market presence and industrial operational safety by providing a seamless, dual-focused service model.</p><p>We cater to corporate organizations, security firms, construction companies, and thriving local businesses across Uganda. By combining cutting-edge technology with high-grade materials, we ensure our clients stand out in the marketplace while keeping their workforces protected on the ground.</p><p>Now serving all of East Africa.</p><h2>Mission</h2><p>Coming Soon - Our Mission Statement will be updated tomorrow</p><h2>Vision</h2><p>Coming Soon - Our Vision Statement will be updated tomorrow</p>` },
  { path: "/admin", title: "Admin | Diglo Ventures", description: "Staff only.", ld: [], body: "", noindex: true },
];

function setMeta(html, attr, key, content) {
  const re = new RegExp(`<meta\\s+${attr}="${key}"[^>]*>`, "i");
  const tag = `<meta ${attr}="${key}" content="${esc(content)}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

for (const r of routes) {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(r.title)}</title>`);
  html = setMeta(html, "name", "description", r.description);
  html = setMeta(html, "property", "og:title", r.title);
  html = setMeta(html, "property", "og:description", r.description);
  html = setMeta(html, "name", "twitter:title", r.title);
  html = setMeta(html, "name", "twitter:description", r.description);
  html = setMeta(html, "name", "robots", indexable && !r.noindex ? "index, follow" : "noindex, nofollow");
  if (site) {
    html = setMeta(html, "property", "og:url", site + r.path);
    html = setMeta(html, "property", "og:image", heroImage);
    if (!r.noindex) html = html.replace("</head>", `    <link rel="canonical" href="${site + r.path}" />\n  </head>`);
  }
  if (r.ld.length) {
    const scripts = r.ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`).join("\n    ");
    html = html.replace("</head>", `    ${scripts}\n  </head>`);
  }
  if (r.body) html = html.replace('<div id="root"></div>', `<div id="root"><div data-prerender style="max-width:1200px;margin:0 auto;padding:24px">${r.body}</div></div>`);
  const out = r.path === "/" ? path.join(dist, "index.html") : path.join(dist, r.path.slice(1), "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}

if (indexable) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes.filter((r) => !r.noindex).map((r) => `  <url><loc>${site + r.path}</loc><lastmod>${today}</lastmod></url>`).join("\n");
  fs.writeFileSync(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${site}/sitemap.xml\n`);
  console.log(`[prerender] ${routes.length} routes, sitemap + robots generated for ${site}`);
} else {
  console.log(`[prerender] ${routes.length} routes rendered as noindex. VITE_SITE_URL not set: preview robots (Disallow) and explanatory sitemap kept.`);
}

import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, Check, FileCheck2, MessageCircle, Plus, ShieldCheck, Truck, Zap, Printer, Shirt, Package } from "lucide-react";
import { CONTACT, formatPrice } from "@/lib/site";
import seo from "@/lib/seo-data.json";
import { useSeo } from "@/lib/seo";
import { btnDark, btnOrange, wrap } from "@/components/tokens";
import { useSite } from "@/components/site-providers";
import { Footer, MobileBar, MobileCtaBar, Nav } from "@/components/site-shell";
import { PriceCalculator } from "@/components/price-calculator";
import { QuoteForm } from "@/components/quote-form";
import { UniformIndustry } from "@/components/uniform-industry";
import { ProductPhoto } from "@/components/product-photo";
import { DIGLO_IMAGES } from "@/lib/images";
import { CardCurrencyPicker } from "@/components/currency-controls";
import { CompanyProfileSections } from "@/components/company-profile-sections";

/* ---------- data ---------- */
const SERVICES = [
  { name: "Gift Packs", icon: Package, line: "Ready to give. Branded for you.", price: 45000 },
  { name: "Corporate Uniforms", icon: Shirt, line: "Your team, looking sharp.", price: 45000 },
  { name: "PPE", icon: ShieldCheck, line: "Safe. Compliant. On site.", price: 65000 },
  { name: "Printing Services", icon: Printer, line: "Print that sells.", price: 80000 },
];

const PRICES = [
  { name: "Business Cards", qty: "100 cards", price: 80000, service: "Printing Services" },
  { name: "Flyers", qty: "100 flyers", price: 120000, service: "Printing Services" },
  { name: "Logo Complete", qty: "Full logo package", price: 250000, service: "Printing Services" },
  { name: "Banner", qty: "3 x 2 metres", price: 150000, service: "Printing Services" },
  { name: "T-Shirt", qty: "Per printed shirt", price: 35000, service: "Corporate Uniforms" },
  { name: "Stickers", qty: "100 stickers", price: 60000, service: "Printing Services" },
];

type Cat = "Branding" | "Print" | "Merch" | "Signage";
const WORK: { title: string; cat: Cat; client: string; ordered: string; from: number; time: string; service: string; photo: keyof typeof DIGLO_IMAGES }[] = [
  { title: "Bakery gift pack", cat: "Branding", client: "Home bakery", ordered: "Gift boxes, branded bags and labels", from: 250000, time: "3–5 days", service: "Gift Packs", photo: "giftPacks" },
  { title: "Launch print set", cat: "Print", client: "New retail shop", ordered: "100 business cards, 100 flyers", from: 200000, time: "24 hours", service: "Printing Services", photo: "printing" },
  { title: "Gym team kit", cat: "Merch", client: "Fitness studio", ordered: "Printed T-shirts and caps", from: 35000, time: "2–3 days", service: "Corporate Uniforms", photo: "uniforms" },
  { title: "Storefront roll-up", cat: "Signage", client: "Fitness studio", ordered: "Roll-up banner and wall sign", from: 150000, time: "48 hours", service: "Printing Services", photo: "printing" },
  { title: "Boutique gift set", cat: "Branding", client: "Fashion boutique", ordered: "Branded bags, tags and thank-you cards", from: 180000, time: "4–6 days", service: "Gift Packs", photo: "giftPacks" },
  { title: "Product label run", cat: "Print", client: "Juice producer", ordered: "100 bottle labels", from: 60000, time: "24 hours", service: "Printing Services", photo: "printing" },
  { title: "Staff uniforms", cat: "Merch", client: "Restaurant", ordered: "Embroidered polo uniforms", from: 35000, time: "3–4 days", service: "Corporate Uniforms", photo: "uniforms" },
  { title: "Event banner", cat: "Signage", client: "Conference organiser", ordered: "3 x 2 m stage banner", from: 150000, time: "24 hours", service: "Printing Services", photo: "printing" },
  { title: "Shopping bag set", cat: "Branding", client: "Cosmetics seller", ordered: "Branded paper bags and stickers", from: 60000, time: "3 days", service: "Gift Packs", photo: "giftPacks" },
];

const FAQS = seo.homeFaqs.map((f) => ({ q: f.q, a: f.a }));

/* ---------- helpers ---------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}


function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#A1A1A6]">{children}</p>;
}
/* ---------- page ---------- */
export default function Home() {
  useReveal();
  useSeo({ title: seo.homeTitle, description: seo.homeDescription, path: "/" });
  const { openQuote, openWhatsApp } = useSite();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const ids = ["home", "services", "work", "pricing", "why"];
    const onScroll = () => {
      let cur = "home";
      for (const id of ids) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < 140) cur = id; }
      setActive(cur);
    };
    onScroll();
    if (window.location.hash) document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#1D1D1F] pb-[144px] text-[#F5F5F7] md:pb-0">
      <Nav active={active} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        <Hero onQuote={() => openQuote()} onWhatsApp={() => openWhatsApp()} />
        <div className="sticky top-[94px] z-30 border-y border-[#3A3A3C] bg-[#2D2D2F] py-2 text-center text-[13px] font-semibold text-white" data-testid="badge-one-vendor">
          One Vendor. One Quote. One Delivery.
        </div>
        <TrustBar />
        <WhyWins />
        <WhatIs />
        <Services onOrder={openQuote} />
        <CompanyProfileSections />
        <UniformIndustry />
        <HowItWorks />
        <Why />
        <Pricing onOrder={openQuote} onWhatsApp={() => openWhatsApp()} />
        <Work onOrder={openQuote} />
        <Testimonials />
        <QuoteSection />
        <Faq />
        <FinalCta onQuote={() => openQuote()} />
      </main>
      <Footer />
      <MobileBar active={active} />
      <MobileCtaBar />
    </div>
  );
}

function WhatIs() {
  return (
    <section className="bg-[#1D1D1F] py-10 md:py-16">
      <div className={`${wrap} reveal grid gap-6 md:grid-cols-[.8fr_1.2fr] md:items-start`}>
        <h2 className="text-[24px] font-bold leading-[1.3] md:text-[28px]">{seo.homeQuestion}</h2>
        <p className="max-w-[60ch] text-[15px] leading-relaxed text-[#D4D4D4]" data-testid="text-what-is">{seo.homeAnswer}</p>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <div className="border-b border-[#3A3A3C] bg-[#242426] py-3" data-testid="trust-bar">
      <div className={`${wrap} grid grid-cols-2 gap-2 text-center text-[12px] font-semibold text-[#F5F5F7] sm:grid-cols-4 sm:text-[13px]`}>
        {["500+ Orders", "100% Quality Checked", "48hr Dispatch", "East Africa Delivery"].map((item) => <span key={item}>{item}</span>)}
      </div>
    </div>
  );
}

function WhyWins() {
  const points = [
    "Same-Day Quote on WhatsApp",
    "Branding + Safety in One Order",
    "Bulk Discounts",
    "East Africa Delivery",
    "Quality Checked Before Dispatch",
  ];
  return (
    <section className="bg-[#1D1D1F] py-8" aria-label="Why Diglo Wins">
      <div className={wrap}>
        <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#A1A1A6]">Why Diglo Wins</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {points.map((point, index) => (
            <div key={point} className="rounded-lg border border-[#3A3A3C] bg-[#2D2D2F] px-3 py-3 text-[13px] font-medium text-white">
              <span className="mr-2 text-[#A1A1A6]">{index + 1}.</span>{point}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- sections ---------- */
function Hero({ onQuote, onWhatsApp }: { onQuote: () => void; onWhatsApp: () => void }) {
  return (
    <section id="home" className="relative bg-[#1D1D1F]">
      <div className={`${wrap} grid items-center gap-8 py-10 md:py-16 lg:grid-cols-[1.1fr_.9fr]`}>
        <div>
          <h1 className="font-display max-w-[14ch] text-[28px] font-bold leading-[1.3] text-white md:text-[40px]" style={{ fontFamily: "Sora" }}>
            Gift Packs. Uniforms. PPE. Printing.
          </h1>
          <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-[#D4D4D4]">
            Based in Kampala, Uganda | Serving Uganda, Kenya, Tanzania, Rwanda, Burundi &amp; South Sudan
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button onClick={onQuote} className={`${btnOrange} w-full sm:w-auto sm:max-w-[220px]`} data-testid="button-hero-quote">Get a Quote</button>
            <button onClick={onWhatsApp} className={`${btnDark} w-full sm:w-auto sm:max-w-[220px]`} data-testid="button-hero-whatsapp">WhatsApp Us <MessageCircle className="h-4 w-4" /></button>
          </div>
          <p className="mt-5 text-[13px] text-[#A1A1A6]">For teams that want to look professional. Designed today. Delivered across East Africa.</p>
        </div>
        <div className="grid h-[280px] grid-cols-2 grid-rows-2 gap-3 md:h-[360px] lg:h-[420px]">
          <ProductPhoto src={DIGLO_IMAGES.giftPacks} alt="Diglo Ventures - Gift Packs in Kampala" label="Gift Packs" loading="eager" className="col-span-2 row-span-2 min-h-0 rounded-xl border border-[#3A3A3C] md:hidden" />
          <ProductPhoto src={DIGLO_IMAGES.giftPacks} alt="Diglo Ventures - Gift Packs in Kampala" label="Gift Packs" loading="eager" className="row-span-2 hidden min-h-0 rounded-xl border border-[#3A3A3C] md:block" />
          <ProductPhoto src={DIGLO_IMAGES.uniforms} alt="Diglo Ventures - Uniforms in Kampala" label="Corporate Uniforms" className="hidden min-h-0 rounded-xl border border-[#3A3A3C] md:block" />
          <ProductPhoto src={DIGLO_IMAGES.ppe} alt="Diglo Ventures - PPE in Kampala" label="PPE" className="hidden min-h-0 rounded-xl border border-[#3A3A3C] md:block" />
        </div>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, sub, center = false, id }: { eyebrow: string; title: string; sub?: string; center?: boolean; id?: string }) {
  return (
    <div className={`reveal mb-7 max-w-[680px] md:mb-10 ${center ? "mx-auto text-center" : ""}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="text-[24px] font-bold leading-[1.3] md:text-[28px]">{title}</h2>
      {sub && <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-[#D4D4D4]">{sub}</p>}
    </div>
  );
}

function Services({ onOrder }: { onOrder: (s: string) => void }) {
  const params = new URLSearchParams(window.location.search);
  const productSelection = params.get("product");
  const serviceSelection = params.get("service");
  const initialFilter = serviceSelection === "Uniforms" || serviceSelection === "Printing" || serviceSelection === "PPE" || serviceSelection === "Gift Packs" ? serviceSelection : "All";
  const [filter, setFilter] = useState(initialFilter);
  const [selectedProduct, setSelectedProduct] = useState(productSelection);
  const filters = ["All", "Gift Packs", "Uniforms", "PPE", "Printing"];
  const visibleServices = SERVICES.filter((s) => {
    if (filter === "All") return true;
    if (filter === "Uniforms") return s.name === "Corporate Uniforms";
    if (filter === "Printing") return s.name === "Printing Services";
    return s.name === filter;
  });
  return (
    <section id="services" className="bg-[#1D1D1F] py-10 md:py-16">
      <div className={wrap}>
        <SectionHead eyebrow="Services" title="Four services. One dependable team." sub="Based in Kampala, serving East Africa." />
        <div className="sticky top-16 z-30 -mx-4 mb-5 flex flex-wrap gap-2 border-y border-[#3A3A3C] bg-[#1D1D1F]/95 px-4 py-2 backdrop-blur md:hidden">
          {filters.map((f) => (
            <button key={f} onClick={() => { setFilter(f); setSelectedProduct(null); }} aria-pressed={filter === f} className={`min-h-10 rounded-full border px-3 text-[12px] font-semibold ${filter === f ? "border-[#A1A1A6] bg-[#2D2D2F] text-white" : "border-[#3A3A3C] text-[#A1A1A6]"}`} data-testid={`button-service-filter-${f.toLowerCase().replaceAll(" ", "-")}`}>{f}</button>
          ))}
        </div>
        {selectedProduct && <p className="mb-4 text-[13px] text-[#A1A1A6]" data-testid="text-selected-product">Showing service for <span className="font-semibold text-white">{selectedProduct}</span></p>}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {visibleServices.map((s, i) => <ServiceCard key={s.name} service={s} index={i} onOrder={onOrder} />)}
        </div>
        <div className="mt-8 flex flex-col gap-4 border-t border-[#3A3A3C] pt-5 md:flex-row md:items-center md:justify-between">
          <p className="text-[14px] font-medium text-[#D4D4D4]">Trusted by Hotels, Schools, Banks &amp; Churches across East Africa</p>
          <p className="text-[14px] text-[#A1A1A6]">See what we made for 500+ teams <a href="#work" className="ml-1 font-semibold text-white underline underline-offset-4">View Our Work <ArrowRight className="inline h-4 w-4" /></a></p>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index, onOrder }: { service: typeof SERVICES[number]; index: number; onOrder: (s: string) => void }) {
  const { currency } = useSite();
  return (
    <article id={`service-${service.name.toLowerCase().replaceAll(" ", "-")}`} className="reveal group flex flex-col rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5 transition-colors duration-200 hover:border-[#A1A1A6]" data-testid={`card-service-${index}`}>
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#1D1D1F] text-[#F5F5F7]"><service.icon className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[18px] font-semibold leading-tight">{service.name}</h3>
          <p className="mt-1 text-[13px] font-semibold text-[#FF6B00]">From {formatPrice(service.price, currency)}</p>
        </div>
      </div>
      <p className="mt-3 min-h-6 text-[15px] leading-relaxed text-[#D4D4D4]">{service.line}</p>
      <CardCurrencyPicker />
      <p className="mt-1 text-[11px] text-[#A1A1A6]">Prices in your currency. Final quote confirmed on WhatsApp.</p>
      <div className="mt-5 border-t border-[#3A3A3C] pt-4">
        <button onClick={() => onOrder(service.name)} className={`${btnOrange} min-h-11 !h-11 w-full !px-4 text-[14px] lg:max-w-[220px]`} data-testid={`button-order-service-${index}`}>Order This</button>
      </div>
    </article>
  );
}

function HowItWorks() {
  const steps: [typeof MessageCircle | typeof FileCheck2 | typeof Truck, string, string][] = [
    [MessageCircle, "Tell us what you need.", "Choose a product, quantity and deadline."],
    [FileCheck2, "Approve the proof.", "Review the artwork before production."],
    [Truck, "Get your order.", "We arrange delivery across East Africa."],
  ];
  return (
    <section className="bg-[#1D1D1F] py-10 md:py-16">
      <div className={wrap}>
        <SectionHead eyebrow="How it works" title="Three steps from idea to your door." />
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map(([Icon, t, d], i) => (
            <li key={t as string} className="reveal rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5" data-testid={`step-${i}`}>
              <Icon className="h-5 w-5 text-[#A1A1A6]" aria-hidden="true" />
              <h3 className="mt-3 text-[18px] font-semibold">{t}</h3>
              <p className="mt-1 text-[15px] leading-relaxed text-[#D4D4D4]">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Why() {
  const reasons = [
    [Zap, "24 Hour Express"],
    [Shirt, "Free Size Sample"],
    [Check, "Pay on Mobile Money"],
  ] as const;
  return (
    <section id="why" className="bg-[#242426] py-10 md:py-16">
      <div className={wrap}>
        <SectionHead eyebrow="Why Diglo Ventures" title="Good work. Ready when you need it." />
        <div className="grid gap-4 md:grid-cols-3">
          {reasons.map(([Icon, title], i) => (
            <div key={title} className="reveal flex items-center gap-4 rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5" data-testid={`card-why-${i}`}>
              <Icon className="h-5 w-5 shrink-0 text-white" />
              <h3 className="text-[18px] font-semibold">{title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ onOrder, onWhatsApp }: { onOrder: (s: string) => void; onWhatsApp: () => void }) {
  const { currency } = useSite();
  return (
    <section id="pricing" className="bg-[#1D1D1F] py-10 md:py-16">
      <div className={wrap}>
        <SectionHead eyebrow="Pricing" title="Clear prices. No surprises." sub="Popular orders with starting prices shown in your selected currency." />
        <div className="grid gap-4 md:grid-cols-2 lg:hidden">
          {PRICES.map((p, i) => (
            <div key={p.name} className="reveal flex flex-col rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5" data-testid={`card-price-${i}`}>
              <div>
                <h3 className="text-[18px] font-semibold">{p.name}</h3>
                <p className="mt-1 text-[14px] text-[#A1A1A6]">{p.qty}</p>
                <p className="font-display mt-3 text-[24px] font-bold text-[#FF6B00] transition-opacity duration-150" style={{ fontFamily: "Sora" }} data-testid={`text-price-${i}`}>{formatPrice(p.price, currency)}</p>
                <CardCurrencyPicker />
                <p className="mt-1 text-[11px] text-[#A1A1A6]">Prices in your currency. Final quote confirmed on WhatsApp.</p>
              </div>
              <button onClick={() => onOrder(p.service)} className={`${btnOrange} mt-5 w-full`} data-testid={`button-order-price-${i}`}>Order This</button>
            </div>
          ))}
        </div>
        <div className="hidden overflow-hidden rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] lg:block">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#2D2D2F] text-[13px] uppercase tracking-wide text-[#A1A1A6]">
              <tr><th className="px-5 py-4 font-semibold">Item</th><th className="px-5 py-4 font-semibold">Details</th><th className="px-5 py-4 font-semibold">Price</th><th className="px-5 py-4 text-right font-semibold">Order This</th></tr>
            </thead>
            <tbody className="divide-y divide-[#3A3A3C]">
              {PRICES.map((p, i) => (
                <tr key={p.name} data-testid={`row-price-${i}`}>
                  <th scope="row" className="px-5 py-4 text-[15px] font-semibold text-white">{p.name}</th>
                  <td className="px-5 py-4 text-[14px] text-[#F5F5F7]">{p.qty}</td>
                  <td className="px-5 py-4 text-[16px] font-bold text-[#FF6B00]">
                    {formatPrice(p.price, currency)}
                    <CardCurrencyPicker />
                  </td>
                  <td className="px-5 py-4 text-right"><button onClick={() => onOrder(p.service)} className={`${btnOrange} !h-10 !px-5 text-[13px]`} data-testid={`button-order-table-${i}`}>Order This</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PriceCalculator />
        <div className="reveal mt-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5 md:flex-row md:items-center">
          <p className="max-w-[60ch] text-[15px] leading-relaxed text-[#D4D4D4]">Proof approval before production. Payment by Mobile Money or Bank Transfer.</p>
          <button onClick={onWhatsApp} className={`${btnOrange} shrink-0`} data-testid="button-pricing-whatsapp"><MessageCircle className="h-4 w-4" /> Quote on WhatsApp</button>
        </div>
      </div>
    </section>
  );
}

function Work({ onOrder }: { onOrder: (s: string) => void }) {
  const { currency } = useSite();
  const [filter, setFilter] = useState<"All" | Cat>("All");
  const cats = ["All", "Branding", "Print", "Merch", "Signage"] as const;
  const list = WORK.filter((w) => filter === "All" || w.cat === filter);
  return (
    <section id="work" className="bg-[#1D1D1F] py-10 md:py-16">
      <div className={wrap}>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHead eyebrow="Our work" title="Made for teams across East Africa." sub="Gift packs, uniforms and print pieces for local teams." />
        </div>
        <div className="mb-6" role="tablist">
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button key={c} role="tab" aria-selected={filter === c} onClick={() => setFilter(c)} className={`h-10 rounded-full border px-5 text-[14px] font-semibold transition-all ${filter === c ? "border-[#3A3A3C] bg-[#2D2D2F] text-white" : "border-[#3A3A3C] bg-[#1D1D1F] text-[#F5F5F7] hover:border-[#A1A1A6]"}`} data-testid={`button-filter-${c.toLowerCase()}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((w, i) => (
            <article key={w.title} className="group flex flex-col overflow-hidden rounded-xl border border-[#3A3A3C] bg-[#2D2D2F]" data-testid={`card-work-${i}`}>
              <ProductPhoto src={DIGLO_IMAGES[w.photo]} alt={`Diglo Ventures - ${w.service} for ${w.title} in Kampala`} label={w.service} className="aspect-[4/3] border-b border-[#3A3A3C]" />
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-[18px] font-semibold">{w.title}</h3>
                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[14px]">
                  <dt className="text-[#A1A1A6]">For</dt><dd className="text-right font-medium text-[#D4D4D4]">{w.client}</dd>
                  <dt className="text-[#A1A1A6]">Includes</dt><dd className="text-right font-medium text-[#D4D4D4]">{w.ordered}</dd>
                  <dt>Price From</dt>
                  <dd className="text-right font-semibold text-[#FF6B00]">
                    {formatPrice(w.from, currency)}
                    <CardCurrencyPicker />
                    <span className="mt-1 block text-[10px] font-normal text-[#A1A1A6]">Prices in your currency.</span>
                  </dd>
                  <dt className="text-[#A1A1A6]">Delivery</dt><dd className="text-right font-medium text-[#D4D4D4]">{w.time}</dd>
                </dl>
                <button onClick={() => onOrder(w.service)} className={`${btnOrange} mt-5 w-full lg:max-w-[220px]`} data-testid={`button-order-work-${i}`}>Order Like This</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const stories = [
    ["Corporate Client, Kampala", "Client story to be confirmed."],
    ["Security Firm, Nairobi", "Client story to be confirmed."],
    ["Construction Co., Dar es Salaam", "Client story to be confirmed."],
  ];
  return (
    <section className="bg-[#242426] py-10 md:py-16" aria-labelledby="client-stories-heading">
      <div className={wrap}>
        <SectionHead eyebrow="Client stories - to be confirmed" title="What our partners say." id="client-stories-heading" />
        <div className="grid gap-4 md:grid-cols-3">
          {stories.map(([source, text]) => (
            <blockquote key={source} className="rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5">
              <p className="text-[15px] leading-relaxed text-[#D4D4D4]">“{text}”</p>
              <footer className="mt-4 text-[13px] font-semibold text-white">{source}</footer>
              <p className="mt-1 text-[11px] text-[#A1A1A6]">Client stories - to be confirmed</p>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteSection() {
  return (
    <section id="quote" className="scroll-mt-20 bg-[#1D1D1F] py-10 md:py-16">
      <div className={`${wrap} grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:gap-8`}>
        <div>
          <SectionHead eyebrow="Get a quote" title="Tell us what you need." sub="Send a few details. We’ll confirm the price on WhatsApp." />
          <div className="rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-4 md:p-5">
            <QuoteForm />
          </div>
        </div>
        <aside className="rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5 lg:mt-14">
          <Eyebrow>Why Diglo Ventures</Eyebrow>
          <h3 className="font-display text-[18px] font-semibold text-white" style={{ fontFamily: "Sora" }}>One team. One clear process.</h3>
          <ul className="mt-4 space-y-2 text-[15px] text-[#D4D4D4]">
            <li className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-[#A1A1A6]" />A design proof before production</li>
            <li className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-[#A1A1A6]" />Updates through WhatsApp</li>
            <li className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-[#A1A1A6]" />Pickup or delivery arrangements</li>
          </ul>
          <div className="mt-7 border-t border-[#3A3A3C] pt-5">
            <h4 className="text-[15px] font-semibold text-white">Contact and hours</h4>
            <p className="mt-3 text-[14px] text-[#A1A1A6]">Based in Kampala, Uganda · Serving East Africa · Mon–Sat, 8AM–7PM EAT</p>
            <a href={`mailto:${CONTACT.email}`} className="mt-3 block break-all text-[14px] text-[#F5F5F7] underline underline-offset-4">{CONTACT.email}</a>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-[#1D1D1F] py-10 md:py-16">
      <div className={`${wrap} grid gap-10 lg:grid-cols-[.8fr_1.2fr]`}>
        <div className="reveal">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="text-[24px] font-bold leading-[1.3] md:text-[28px]">Questions, answered.</h2>
        </div>
        <div className="divide-y divide-[#3A3A3C] border-y border-[#3A3A3C]">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left" data-testid={`button-faq-${i}`}>
                  <span className="font-display text-[17px] font-semibold text-white" style={{ fontFamily: "Sora" }}>{f.q}</span>
                  <Plus className={`h-5 w-5 shrink-0 text-[#F5F5F7] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden"><p className="pb-5 pr-8 text-[15px] leading-relaxed" data-testid={`text-faq-${i}`}>{f.a}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCta({ onQuote }: { onQuote: () => void }) {
  return (
    <section className="dark-zone bg-[#1D1D1F] py-10 md:py-16">
      <div className={`${wrap} reveal text-center`}>
        <h2 className="mx-auto max-w-[600px] text-[24px] font-bold leading-[1.3] md:text-[28px]">Ready to outfit your team?</h2>
        <button onClick={onQuote} className={`${btnOrange} mt-6 w-full sm:w-auto sm:max-w-[220px]`} data-testid="button-cta-whatsapp">Get a Quote</button>
      </div>
    </section>
  );
}

/* ---------- dialogs ---------- */

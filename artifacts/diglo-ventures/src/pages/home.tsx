import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight, Check, Clock, FileCheck2, MapPin, MessageCircle, Plus, Quote, ShieldCheck,
  Truck, Zap, Printer, Shirt, Package,
} from "lucide-react";
import { formatUGX } from "@/lib/site";
import { CONTACT } from "@/lib/site";
import seo from "@/lib/seo-data.json";
import { useSeo } from "@/lib/seo";
import { btnDark, btnOrange, img, wrap } from "@/components/tokens";
import { useSite } from "@/components/site-providers";
import { Footer, MobileBar, MobileCtaBar, Nav } from "@/components/site-shell";
import { PriceCalculator } from "@/components/price-calculator";
import { QuoteForm } from "@/components/quote-form";

/* ---------- data ---------- */
const SERVICES = [
  { name: "Gift Packs", icon: Package, items: ["Client Gifts", "Staff Gifts", "Event Packs", "Branded Packaging"], line: "Branded gift packs for clients, teams and special events." },
  { name: "Corporate Uniforms", icon: Shirt, items: ["Workwear", "Polo Shirts", "Custom Branding", "Team Apparel"], line: "Consistent, professionally branded uniforms for your team." },
  { name: "PPE", icon: ShieldCheck, items: ["Safety Wear", "Protective Gear", "Custom Branding", "Worksite Essentials"], line: "Personal protective equipment for safer, more recognisable teams." },
  { name: "Printing Services", icon: Printer, items: ["Business Cards", "Flyers", "Banners", "Packaging"], line: "Quality print materials for everyday business and promotion." },
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
const WORK: { title: string; cat: Cat; client: string; ordered: string; from: number; time: string; image: string; service: string }[] = [
  { title: "Bakery gift pack", cat: "Branding", client: "Home bakery", ordered: "Gift boxes, branded bags and labels", from: 250000, time: "3–5 days", image: "packaging.jpg", service: "Gift Packs" },
  { title: "Launch print set", cat: "Print", client: "New retail shop", ordered: "100 business cards, 100 flyers", from: 200000, time: "24 hours", image: "hero.jpg", service: "Printing Services" },
  { title: "Gym team kit", cat: "Merch", client: "Fitness studio", ordered: "Printed T-shirts and caps", from: 35000, time: "2–3 days", image: "apparel.jpg", service: "Corporate Uniforms" },
  { title: "Storefront roll-up", cat: "Signage", client: "Fitness studio", ordered: "Roll-up banner and wall sign", from: 150000, time: "48 hours", image: "signage.jpg", service: "Printing Services" },
  { title: "Boutique gift set", cat: "Branding", client: "Fashion boutique", ordered: "Branded bags, tags and thank-you cards", from: 180000, time: "4–6 days", image: "hero.jpg", service: "Gift Packs" },
  { title: "Product label run", cat: "Print", client: "Juice producer", ordered: "100 bottle labels", from: 60000, time: "24 hours", image: "packaging.jpg", service: "Printing Services" },
  { title: "Staff uniforms", cat: "Merch", client: "Restaurant", ordered: "Embroidered polo uniforms", from: 35000, time: "3–4 days", image: "apparel.jpg", service: "Corporate Uniforms" },
  { title: "Event banner", cat: "Signage", client: "Conference organiser", ordered: "3 x 2 m stage banner", from: 150000, time: "24 hours", image: "signage.jpg", service: "Printing Services" },
  { title: "Shopping bag set", cat: "Branding", client: "Cosmetics seller", ordered: "Branded paper bags and stickers", from: 60000, time: "3 days", image: "packaging.jpg", service: "Gift Packs" },
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
  return <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#86868B]">{children}</p>;
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
        <Hero onQuote={() => openQuote()} />
        <WhatIs />
        <Services onOrder={openQuote} />
        <HowItWorks />
        <Why />
        <Pricing onOrder={openQuote} onWhatsApp={() => openWhatsApp()} />
        <Work onOrder={openQuote} />
        <QuoteSection />
        <Testimonials />
        <Faq />
        <FinalCta onWhatsApp={() => openWhatsApp()} onQuote={() => openQuote()} />
      </main>
      <Footer />
      <MobileBar active={active} />
      <MobileCtaBar />
    </div>
  );
}

function WhatIs() {
  return (
    <section className="bg-[#1D1D1F] pt-16 md:pt-20">
      <div className={`${wrap} reveal grid gap-6 md:grid-cols-[.8fr_1.2fr] md:items-start`}>
        <h2 className="text-[28px] font-bold leading-[1.15] sm:text-[34px]">{seo.homeQuestion}</h2>
        <p className="text-[18px] leading-relaxed text-[#F5F5F7]" data-testid="text-what-is">{seo.homeAnswer}</p>
      </div>
    </section>
  );
}

/* ---------- sections ---------- */
function Hero({ onQuote }: { onQuote: () => void }) {
  const trust = [[Check, "500+ Businesses Served"], [Zap, "24 Hour Express"], [Truck, "Delivery Across Kampala"], [ShieldCheck, "Quality Guarantee"]] as const;
  return (
    <section id="home" className="relative overflow-hidden bg-[#1D1D1F]">
      <div className={`${wrap} grid items-center gap-8 pb-12 pt-6 md:gap-10 md:pb-16 md:pt-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-12 lg:pb-24 lg:pt-14`}>
        <div>
          <h1 className="rise font-display text-[30px] font-bold leading-tight text-white md:text-[44px] lg:text-[56px]" style={{ fontFamily: "Sora", letterSpacing: "-0.035em" }}>
            Branding and Printing Services in Kampala, Uganda
          </h1>
          <h2 className="rise mt-4 font-display text-[32px] font-extrabold leading-[1.04] text-white md:mt-5 md:text-[40px] lg:text-[48px]" style={{ animationDelay: ".08s", fontFamily: "Sora", letterSpacing: "-0.035em" }}>
            We Make Brands Impossible To Ignore.
          </h2>
          <p className="rise mt-4 max-w-[540px] text-[16px] leading-relaxed text-[#F5F5F7] md:mt-6 md:text-[17px]" style={{ animationDelay: ".16s" }}>
            Diglo Ventures supplies branded gift packs, corporate uniforms, PPE and quality print materials for growing businesses in Kampala. Choose the products your team needs, approve the design and arrange delivery across Kampala.
          </p>
          <div className="rise mt-6 flex flex-col gap-3 md:mt-8 md:flex-row" style={{ animationDelay: ".24s" }}>
            <button onClick={onQuote} className={`${btnOrange} w-full md:w-auto`} data-testid="button-hero-quote">Get a Free Quote <ArrowRight className="h-4 w-4" /></button>
            <a href="#work" className={`${btnDark} w-full md:w-auto`} data-testid="link-hero-work">View Our Work</a>
          </div>
          <ul className="mt-7 grid grid-cols-2 gap-x-4 gap-y-3 md:mt-8">
            {trust.map(([Icon, t], i) => (
              <li key={t} className="flex items-center gap-2 text-[12px] font-semibold text-[#F5F5F7] md:text-[13px]" data-testid={`text-trust-${i}`}>
                <Icon className="h-4 w-4 shrink-0 text-[#A1A1A6]" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="rise relative" style={{ animationDelay: ".2s" }}>
          <div className="h-[280px] overflow-hidden rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F] md:hidden">
            <img src={img("packaging.jpg")} alt="Concept gift pack with branded packaging" className="h-full w-full object-cover" fetchPriority="high" />
          </div>
          <div className="hidden h-[360px] overflow-hidden rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F] md:block lg:hidden">
            <img src={img("packaging.jpg")} alt="Concept gift pack with branded packaging" className="h-full w-full object-cover" fetchPriority="high" />
          </div>
          <div className="hidden h-[520px] grid-cols-2 grid-rows-2 gap-3 lg:grid">
            <figure className="relative overflow-hidden rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F]">
              <img src={img("packaging.jpg")} alt="Concept branded gift pack" className="h-full w-full object-cover" fetchPriority="high" />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-[#1D1D1F]/90 px-3 py-1 text-[12px] font-semibold text-white">Gift Packs</figcaption>
            </figure>
            <figure className="relative overflow-hidden rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F]">
              <img src={img("apparel.jpg")} alt="Concept corporate uniform and apparel" className="h-full w-full object-cover" fetchPriority="high" />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-[#1D1D1F]/90 px-3 py-1 text-[12px] font-semibold text-white">Uniforms</figcaption>
            </figure>
            <figure className="relative grid place-items-center overflow-hidden rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F]">
              <svg viewBox="0 0 220 150" className="h-[72%] w-[82%]" role="img" aria-label="Illustration of a safety helmet">
                <path d="M36 101c0-38 33-69 74-69s74 31 74 69H36Z" fill="#F5F5F7" />
                <path d="M26 101h168v15c0 7-6 13-13 13H39c-7 0-13-6-13-13v-15Z" fill="#A1A1A6" />
                <path d="M104 34v44M70 47l13 31m66-31-13 31" stroke="#3A3A3C" strokeWidth="7" strokeLinecap="round" />
              </svg>
              <span className="absolute bottom-3 left-3 rounded-full bg-[#1D1D1F]/90 px-3 py-1 text-[12px] font-semibold text-white">PPE</span>
            </figure>
            <figure className="relative overflow-hidden rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F]">
              <img src={img("hero.jpg")} alt="Concept branded business card and print pieces" className="h-full w-full object-cover object-[70%_80%]" fetchPriority="high" />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-[#1D1D1F]/90 px-3 py-1 text-[12px] font-semibold text-white">Business Cards</figcaption>
            </figure>
          </div>
          <div className="mt-2 hidden text-right text-[12px] text-[#A1A1A6] lg:block">Illustrative concepts</div>
          <div className="mt-2 hidden text-right text-[12px] text-[#A1A1A6] md:block lg:hidden">
            <span>Illustrative concept</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, sub, center = false }: { eyebrow: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={`reveal mb-8 max-w-[680px] md:mb-12 ${center ? "mx-auto text-center" : ""}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-[32px] font-bold leading-[1.1] sm:text-[42px]">{title}</h2>
      {sub && <p className="mt-4 text-[17px] leading-relaxed">{sub}</p>}
    </div>
  );
}

function Services({ onOrder }: { onOrder: (s: string) => void }) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Gift Packs", "Uniforms", "PPE", "Printing"];
  const visibleServices = SERVICES.filter((s) => {
    if (filter === "All") return true;
    if (filter === "Uniforms") return s.name === "Corporate Uniforms";
    if (filter === "Printing") return s.name === "Printing Services";
    return s.name === filter;
  });
  return (
    <section id="services" className="bg-[#1D1D1F] py-12 md:py-20 lg:py-24">
      <div className={wrap}>
        <SectionHead eyebrow="Services" title="Everything your team needs, under one roof." sub="Four focused services. One team handling your branded products from artwork to delivery." />
        <div className="sticky top-16 z-30 -mx-4 mb-5 flex flex-wrap gap-2 border-y border-[#3A3A3C] bg-[#1D1D1F]/95 px-4 py-2 backdrop-blur md:hidden">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f} className={`min-h-10 rounded-full border px-3 text-[12px] font-semibold ${filter === f ? "border-[#A1A1A6] bg-[#2D2D2F] text-white" : "border-[#3A3A3C] text-[#A1A1A6]"}`} data-testid={`button-service-filter-${f.toLowerCase().replaceAll(" ", "-")}`}>{f}</button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {visibleServices.map((s, i) => <ServiceCard key={s.name} service={s} index={i} onOrder={onOrder} />)}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index, onOrder }: { service: typeof SERVICES[number]; index: number; onOrder: (s: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="reveal group flex flex-col rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#FF6B00] hover:shadow-[0_4px_20px_rgba(0,0,0,.30)] md:p-6" data-testid={`card-service-${index}`}>
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#1D1D1F] text-[#F5F5F7]"><service.icon className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[18px] font-semibold leading-tight md:text-[20px]">{service.name}</h3>
          <p className="mt-1 text-[13px] font-semibold text-[#FF6B00]">Custom quote</p>
        </div>
      </div>
      <p className="mt-3 text-[14px] leading-relaxed text-[#F5F5F7] md:mt-4 md:text-[15px]">{service.line}</p>
      <ul className="mt-4 grid gap-2 text-[13px] text-[#F5F5F7]">
        {service.items.map((item, itemIndex) => (
          <li key={item} className={`flex items-center gap-2 ${itemIndex >= 3 && !expanded ? "hidden md:flex" : "flex"}`}>
            <Check className="h-4 w-4 shrink-0 text-[#A1A1A6]" />{item}
          </li>
        ))}
      </ul>
      {service.items.length > 3 && (
        <button onClick={() => setExpanded((v) => !v)} className="mt-2 self-start text-[13px] font-semibold text-[#A1A1A6] underline underline-offset-4 md:hidden" aria-expanded={expanded}>
          {expanded ? "See less" : "See more"}
        </button>
      )}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#3A3A3C] pt-4 mt-5">
        <a href="#quote" className="min-h-12 inline-flex items-center text-[13px] font-semibold text-[#A1A1A6] underline underline-offset-4">Details</a>
        <button onClick={() => onOrder(service.name)} className={`${btnOrange} min-h-12 !h-12 w-full !px-4 text-[14px]`} data-testid={`button-order-service-${index}`}>Order This</button>
      </div>
    </article>
  );
}

function HowItWorks() {
  const steps = [
    ["Send Your Idea", "Tell us what you need: the product, quantity and any ideas or files you already have."],
    ["Approve Your Design", "We send a free design proof. Request changes until it is right, then approve."],
    ["We Print and Deliver", "Your order is printed and delivered to you across Kampala."],
  ];
  return (
    <section className="bg-[#1D1D1F] py-12 md:py-20 lg:py-24">
      <div className={wrap}>
        <SectionHead eyebrow="How it works" title="Three steps from idea to your door." />
        <ol className="relative grid gap-4 before:absolute before:bottom-10 before:left-[23px] before:top-10 before:w-px before:bg-[#3A3A3C] md:grid-cols-3 md:gap-5 md:before:hidden">
          {steps.map(([t, d], i) => (
            <li key={t} className="reveal relative rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F] p-5 pl-16 md:p-6" style={{ transitionDelay: `${i * 90}ms` }} data-testid={`step-${i}`}>
              <span className="absolute left-3 top-4 grid h-7 w-7 place-items-center rounded-full bg-[#FF6B00] text-[14px] font-bold text-white md:static md:mb-4 md:h-10 md:w-10 md:text-[18px]">{i + 1}</span>
              <h3 className="text-[18px] font-semibold md:text-[20px]">{t}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#F5F5F7] md:text-[15px]">{d}</p>
              {i < 2 && <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 rounded-full border border-[#3A3A3C] bg-[#2D2D2F] p-1.5 text-[#F5F5F7] md:block" />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Why() {
  const reasons = [
    [Zap, "24 Hour Express", "Many standard print jobs can be ready within 24 hours of proof approval."],
    [FileCheck2, "Free Design Proof", "See exactly how your order will look before anything is printed."],
    [MapPin, "Delivery Across Kampala", "We bring finished orders to your shop, office or home."],
    [ShieldCheck, "Quality Guarantee - Reprint Free", "If a print fault is our mistake, we reprint it at no cost."],
  ] as const;
  return (
    <section id="why" className="bg-[#242426] py-12 md:py-20 lg:py-24">
      <div className={`${wrap} grid gap-12 lg:grid-cols-[.9fr_1.1fr]`}>
        <div className="reveal">
          <Eyebrow>Why Diglo Ventures</Eyebrow>
          <h2 className="text-[32px] font-bold leading-[1.1] sm:text-[42px]">Professional results, without the long wait.</h2>
          <p className="mt-4 max-w-[440px] text-[17px] leading-relaxed">Growing businesses need to look established from the first impression. We keep the process simple and the standard high.</p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-[#3A3A3C]">
            <img src={img("signage.jpg")} alt="Concept mockup of a roll-up banner and wall sign" className="aspect-[16/10] w-full object-cover" loading="lazy" />
          </div>
        </div>
        <div className="grid content-start gap-4 md:grid-cols-2">
          {reasons.map(([Icon, t, d], i) => (
            <div key={t} className="reveal rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F] p-6" style={{ transitionDelay: `${i * 70}ms` }} data-testid={`card-why-${i}`}>
              <Icon className="h-6 w-6 text-[#F5F5F7]" />
              <h3 className="mt-5 text-[19px] font-semibold">{t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ onOrder, onWhatsApp }: { onOrder: (s: string) => void; onWhatsApp: () => void }) {
  return (
    <section id="pricing" className="bg-[#1D1D1F] py-12 md:py-20 lg:py-24">
      <div className={wrap}>
        <SectionHead eyebrow="Pricing" title="Clear prices. No surprises." sub="Popular orders with transparent starting prices in Ugandan shillings." />
        <div className="grid gap-4 md:grid-cols-2 lg:hidden">
          {PRICES.map((p, i) => (
            <div key={p.name} className="reveal flex flex-col rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F] p-5" data-testid={`card-price-${i}`}>
              <div>
                <h3 className="text-[18px] font-semibold">{p.name}</h3>
                <p className="mt-1 text-[14px] text-[#A1A1A6]">{p.qty}</p>
                <p className="font-display mt-3 text-[24px] font-bold text-[#FF6B00]" style={{ fontFamily: "Sora" }} data-testid={`text-price-${i}`}>{formatUGX(p.price)} UGX</p>
              </div>
              <button onClick={() => onOrder(p.service)} className={`${btnOrange} mt-5 w-full`} data-testid={`button-order-price-${i}`}>Order This</button>
            </div>
          ))}
        </div>
        <div className="hidden overflow-hidden rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F] lg:block">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#242426] text-[13px] uppercase tracking-wide text-[#A1A1A6]">
              <tr><th className="px-5 py-4 font-semibold">Item</th><th className="px-5 py-4 font-semibold">Details</th><th className="px-5 py-4 font-semibold">Price</th><th className="px-5 py-4 text-right font-semibold">Order This</th></tr>
            </thead>
            <tbody className="divide-y divide-[#3A3A3C]">
              {PRICES.map((p, i) => (
                <tr key={p.name} data-testid={`row-price-${i}`}>
                  <th scope="row" className="px-5 py-4 text-[15px] font-semibold text-white">{p.name}</th>
                  <td className="px-5 py-4 text-[14px] text-[#F5F5F7]">{p.qty}</td>
                  <td className="px-5 py-4 text-[16px] font-bold text-[#FF6B00]">{formatUGX(p.price)} UGX</td>
                  <td className="px-5 py-4 text-right"><button onClick={() => onOrder(p.service)} className={`${btnOrange} !h-10 !px-5 text-[13px]`} data-testid={`button-order-table-${i}`}>Order This</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PriceCalculator />
        <div className="reveal mt-8 flex flex-col items-start justify-between gap-5 rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F] p-6 md:flex-row md:items-center">
          <p className="max-w-[720px] text-[15px] leading-relaxed text-[#F5F5F7]">All prices include design proof. Custom quote in 5 minutes on WhatsApp. Payment by Mobile Money or Bank Transfer.</p>
          <button onClick={onWhatsApp} className={`${btnOrange} shrink-0`} data-testid="button-pricing-whatsapp"><MessageCircle className="h-4 w-4" /> Quote on WhatsApp</button>
        </div>
      </div>
    </section>
  );
}

function Work({ onOrder }: { onOrder: (s: string) => void }) {
  const [filter, setFilter] = useState<"All" | Cat>("All");
  const cats = ["All", "Branding", "Print", "Merch", "Signage"] as const;
  const list = WORK.filter((w) => filter === "All" || w.cat === filter);
  return (
    <section id="work" className="bg-[#1D1D1F] py-12 md:py-20 lg:py-24">
      <div className={wrap}>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHead eyebrow="Work" title="What an order can look like." sub="Illustrative concept work, not client projects. Each example shows a typical order, starting price and delivery time." />
        </div>
        <div className="mb-8 overflow-x-auto pb-1" role="tablist">
          <div className="flex w-max gap-2">
            {cats.map((c) => (
              <button key={c} role="tab" aria-selected={filter === c} onClick={() => setFilter(c)} className={`h-10 rounded-full border px-5 text-[14px] font-semibold transition-all ${filter === c ? "border-[#3A3A3C] bg-[#2D2D2F] text-white" : "border-[#3A3A3C] bg-[#1D1D1F] text-[#F5F5F7] hover:border-[#A1A1A6]"}`} data-testid={`button-filter-${c.toLowerCase()}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((w, i) => (
            <article key={w.title} className="group flex flex-col overflow-hidden rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F] animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }} data-testid={`card-work-${i}`}>
              <div className="relative overflow-hidden bg-[#1D1D1F]">
                <img src={img(w.image)} alt={`Concept: ${w.title}`} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-[#242426] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#F5F5F7]">Concept · {w.cat}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-[19px] font-semibold">{w.title}</h3>
                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[14px]">
                  <dt>Client Type</dt><dd className="text-right font-medium text-[#F5F5F7]">{w.client}</dd>
                  <dt>What Ordered</dt><dd className="text-right font-medium text-[#F5F5F7]">{w.ordered}</dd>
                  <dt>Price From</dt><dd className="text-right font-semibold text-[#FF6B00]">{formatUGX(w.from)}</dd>
                  <dt>Delivery Time</dt><dd className="text-right font-medium text-[#F5F5F7]">{w.time}</dd>
                </dl>
                <button onClick={() => onOrder(w.service)} className={`${btnOrange} mt-6 !h-12 w-full lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100 lg:focus-visible:opacity-100`} data-testid={`button-order-work-${i}`}>Order Like This</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteSection() {
  const { openWhatsApp } = useSite();
  return (
    <section id="quote" className="scroll-mt-20 bg-[#1D1D1F] py-12 md:py-20 lg:py-24">
      <div className={`${wrap} grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:gap-12`}>
        <div>
          <SectionHead eyebrow="Get a quote" title="Tell us what you need." sub="Share your service and quantity. Diglo Ventures will follow up to confirm details and pricing." />
          <div className="rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F] p-4 md:p-6">
            <QuoteForm />
          </div>
        </div>
        <aside className="rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F] p-6 md:p-8 lg:mt-16">
          <Eyebrow>Why Diglo Ventures</Eyebrow>
          <h3 className="font-display text-[24px] font-bold text-white" style={{ fontFamily: "Sora" }}>Clear steps, responsive service.</h3>
          <ul className="mt-5 space-y-3 text-[15px] text-[#F5F5F7]">
            <li className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-[#A1A1A6]" />A design proof before production</li>
            <li className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-[#A1A1A6]" />Updates through WhatsApp</li>
            <li className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-[#A1A1A6]" />Pickup or delivery arrangements</li>
          </ul>
          <div className="mt-7 border-t border-[#3A3A3C] pt-5">
            <h4 className="text-[15px] font-semibold text-white">Contact and hours</h4>
            <p className="mt-3 text-[14px] text-[#A1A1A6]">Kampala, Uganda · Mon–Sat, 8AM–7PM EAT</p>
            <a href={`mailto:${CONTACT.email}`} className="mt-3 block break-all text-[14px] text-[#F5F5F7] underline underline-offset-4">{CONTACT.email}</a>
            <button onClick={() => openWhatsApp()} className={`${btnOrange} mt-5 w-full`}><MessageCircle className="h-4 w-4" /> WhatsApp Diglo Ventures</button>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Testimonials() {
  const people = [["Sarah N.", "Sarah's Cakes"], ["David M.", "Prime Fitness"], ["Grace K.", "Grace Boutique"]];
  return (
    <section className="bg-[#242426] py-12 md:py-20 lg:py-24">
      <div className={wrap}>
        <SectionHead eyebrow="Testimonials" title="In their words." sub="Customer quotes will appear here once each customer has approved their wording." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {people.map(([n, b], i) => (
            <figure key={n} className="reveal flex flex-col rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F] p-6" style={{ transitionDelay: `${i * 80}ms` }} data-testid={`card-testimonial-${i}`}>
              <Quote className="h-6 w-6 text-[#A1A1A6]" />
              <blockquote className="mt-4 flex-1 rounded-xl border border-dashed border-[#3A3A3C] bg-[#1D1D1F] p-4 text-[14px] italic">
                Awaiting approved quote. This space is reserved and intentionally left without text.
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#1D1D1F] text-[14px] font-semibold text-white">{n.split(" ").map((x) => x[0]).join("")}</span>
                <span><span className="block font-semibold text-white">{n}</span><span className="text-[14px] text-[#A1A1A6]">{b}</span></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-[#1D1D1F] py-12 md:py-20 lg:py-24">
      <div className={`${wrap} grid gap-10 lg:grid-cols-[.8fr_1.2fr]`}>
        <div className="reveal">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="text-[32px] font-bold leading-[1.1] sm:text-[42px]">Questions, answered.</h2>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#3A3A3C] px-3 py-1 text-[13px] font-semibold text-[#A1A1A6]"><Clock className="h-3.5 w-3.5" /> Draft answers, pending final review</p>
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

function FinalCta({ onWhatsApp, onQuote }: { onWhatsApp: () => void; onQuote: () => void }) {
  return (
    <section className="dark-zone bg-[#1D1D1F] py-20 md:py-28">
      <div className={`${wrap} reveal text-center`}>
        <h2 className="mx-auto max-w-[760px] text-[36px] font-extrabold leading-[1.05] sm:text-[56px]" style={{ letterSpacing: "-0.035em" }}>Ready To Look Like A Big Brand?</h2>
        <p className="mx-auto mt-5 max-w-[520px] text-[17px] text-[#A1A1A6]">Designed Today. Printed Tomorrow. Delivered To You.</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button onClick={onWhatsApp} className={btnOrange} data-testid="button-cta-whatsapp"><MessageCircle className="h-4 w-4" /> Get a Free Quote on WhatsApp</button>
          <button onClick={onQuote} className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-[15px] font-semibold text-white transition hover:border-white" data-testid="button-cta-email">Request by email</button>
        </div>
      </div>
    </section>
  );
}

/* ---------- dialogs ---------- */

import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight, Check, Clock, FileCheck2, MapPin, MessageCircle, Plus, Quote, ShieldCheck,
  Truck, Zap, PenTool, Printer, Shirt, Package, RefreshCw, Flag,
} from "lucide-react";
import { formatUGX } from "@/lib/site";
import seo from "@/lib/seo-data.json";
import { useSeo } from "@/lib/seo";
import { btnDark, btnOrange, img, wrap } from "@/components/tokens";
import { useSite } from "@/components/site-providers";
import { Footer, MobileBar, Nav } from "@/components/site-shell";
import { PriceCalculator } from "@/components/price-calculator";

/* ---------- data ---------- */
const SERVICES = [
  { name: "Brand Identity", from: 250000, icon: PenTool, items: ["Logo", "Colour Palette", "Font Guide", "Brand Book"], line: "Your Logo, Colours and Brand Guidelines, Designed To Look Professional From Day One." },
  { name: "Business Printing", from: 80000, icon: Printer, items: ["Business Cards", "Flyers", "Letterheads", "Receipts"], line: "Business Cards, Flyers, Receipts, Invoices and Company Profiles That Build Trust." },
  { name: "Large Format", from: 150000, icon: Flag, items: ["Banners", "Stickers", "Posters", "Signage", "Roll-Up"], line: "Banners, Stickers, Posters and Signage That Get Noticed From Across The Street." },
  { name: "Apparel", from: 35000, icon: Shirt, items: ["T-Shirts", "Hoodies", "Caps", "Uniforms"], line: "T-Shirts, Hoodies, Caps and Uniforms That Your Team Will Be Proud To Wear." },
  { name: "Packaging", from: 60000, icon: Package, items: ["Labels", "Boxes", "Paper Bags", "Stickers"], line: "Boxes, Labels and Bags That Make Your Product Look Expensive Before It Is Opened." },
  { name: "Brand Refresh", from: 180000, icon: RefreshCw, items: ["Logo Refresh", "Updated Colours", "Brand Guide"], line: "Modernise Your Existing Logo and Brand Without Losing Your Customers." },
];

const PRICES = [
  { name: "Business Cards", qty: "100 cards", price: 80000, service: "Business Printing" },
  { name: "Flyers", qty: "100 flyers", price: 120000, service: "Business Printing" },
  { name: "Logo Complete", qty: "Full logo package", price: 250000, service: "Brand Identity" },
  { name: "Banner", qty: "3 x 2 metres", price: 150000, service: "Large Format" },
  { name: "T-Shirt", qty: "Per printed shirt", price: 35000, service: "Apparel" },
  { name: "Stickers", qty: "100 stickers", price: 60000, service: "Packaging" },
];

type Cat = "Branding" | "Print" | "Merch" | "Signage";
const WORK: { title: string; cat: Cat; client: string; ordered: string; from: number; time: string; image: string; service: string }[] = [
  { title: "Bakery starter kit", cat: "Branding", client: "Home bakery", ordered: "Logo, colour palette, cake box labels", from: 250000, time: "3–5 days", image: "packaging.jpg", service: "Brand Identity" },
  { title: "Launch print set", cat: "Print", client: "New retail shop", ordered: "100 business cards, 100 flyers", from: 200000, time: "24 hours", image: "hero.jpg", service: "Business Printing" },
  { title: "Gym team kit", cat: "Merch", client: "Fitness studio", ordered: "Printed T-shirts and caps", from: 35000, time: "2–3 days", image: "apparel.jpg", service: "Apparel" },
  { title: "Storefront roll-up", cat: "Signage", client: "Fitness studio", ordered: "Roll-up banner and wall sign", from: 150000, time: "48 hours", image: "signage.jpg", service: "Large Format" },
  { title: "Boutique identity", cat: "Branding", client: "Fashion boutique", ordered: "Logo refresh and brand guide", from: 180000, time: "4–6 days", image: "hero.jpg", service: "Brand Refresh" },
  { title: "Product label run", cat: "Print", client: "Juice producer", ordered: "100 bottle labels", from: 60000, time: "24 hours", image: "packaging.jpg", service: "Packaging" },
  { title: "Staff uniforms", cat: "Merch", client: "Restaurant", ordered: "Embroidered polo uniforms", from: 35000, time: "3–4 days", image: "apparel.jpg", service: "Apparel" },
  { title: "Event banner", cat: "Signage", client: "Conference organiser", ordered: "3 x 2 m stage banner", from: 150000, time: "24 hours", image: "signage.jpg", service: "Large Format" },
  { title: "Shopping bag set", cat: "Branding", client: "Cosmetics seller", ordered: "Branded paper bags and stickers", from: 60000, time: "3 days", image: "packaging.jpg", service: "Packaging" },
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
    <div className="min-h-[100dvh] bg-white pb-24 md:pb-0">
      <Nav active={active} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        <Hero onQuote={() => openQuote()} />
        <WhatIs />
        <Services onOrder={openQuote} />
        <HowItWorks />
        <Why />
        <Pricing onOrder={openQuote} onWhatsApp={() => openWhatsApp()} />
        <Work onOrder={openQuote} />
        <Testimonials />
        <Faq />
        <FinalCta onWhatsApp={() => openWhatsApp()} onQuote={() => openQuote()} />
      </main>
      <Footer />
      <MobileBar active={active} />
    </div>
  );
}

function WhatIs() {
  return (
    <section className="bg-white pt-16 md:pt-20">
      <div className={`${wrap} reveal grid gap-6 md:grid-cols-[.8fr_1.2fr] md:items-start`}>
        <h2 className="text-[28px] font-bold leading-[1.15] sm:text-[34px]">{seo.homeQuestion}</h2>
        <p className="text-[18px] leading-relaxed text-[#6E6E73]" data-testid="text-what-is">{seo.homeAnswer}</p>
      </div>
    </section>
  );
}

/* ---------- sections ---------- */
function Hero({ onQuote }: { onQuote: () => void }) {
  const trust = [[Check, "500+ Businesses Served"], [Zap, "24 Hour Express"], [Truck, "Delivery Across Kampala"], [ShieldCheck, "Quality Guarantee"]] as const;
  return (
    <section id="home" className="relative overflow-hidden bg-white">
      <div className={`${wrap} grid items-center gap-10 pb-16 pt-10 md:pt-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-14 lg:pb-24`}>
        <div>
          <h1 className="rise mb-5 inline-flex items-center gap-2 rounded-full border border-[#D2D2D7] px-3.5 py-1.5 text-[13px] font-semibold !tracking-normal !text-[#6E6E73]" style={{ fontFamily: "Inter" }}>
            <span className="pulse-dot h-2 w-2 rounded-full bg-[#FF6B00]" />
            Branding and Printing Services in Kampala, Uganda
          </h1>
          <p className="rise font-display text-[40px] font-extrabold leading-[1.04] text-[#1D1D1F] sm:text-[56px] lg:text-[68px]" style={{ animationDelay: ".08s", fontFamily: "Sora", letterSpacing: "-0.035em" }}>
            We Make Brands Impossible To Ignore.
          </p>
          <p className="rise mt-6 max-w-[540px] text-[17px] leading-relaxed text-[#6E6E73]" style={{ animationDelay: ".16s" }}>
            Diglo Ventures designs and prints premium branding for growing businesses in Kampala. Logo design, business cards, banners, T-shirts, packaging and signage. Designed today, printed tomorrow, delivered to you.
          </p>
          <div className="rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: ".24s" }}>
            <button onClick={onQuote} className={btnOrange} data-testid="button-hero-quote">Get a Free Quote <ArrowRight className="h-4 w-4" /></button>
            <a href="#work" className={btnDark} data-testid="link-hero-work">View Our Work</a>
          </div>
        </div>
        <div className="rise relative" style={{ animationDelay: ".2s" }}>
          <div className="overflow-hidden rounded-[24px] border border-[#D2D2D7] bg-[#F5F5F7]">
            <img src={img("hero.jpg")} alt="Concept mockup of business cards, flyer, bag and T-shirt" className="aspect-[4/3.4] w-full object-cover transition-transform duration-[1.2s] hover:scale-[1.03]" />
          </div>
          <div className="absolute -bottom-5 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl border border-[#D2D2D7] bg-white p-4 shadow-[0_4px_20px_rgba(29,29,31,.06)] sm:left-auto sm:right-6 sm:w-[300px]">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#86868B]">Our promise</p>
              <p className="font-display mt-1 text-[14px] font-semibold leading-snug text-[#1D1D1F]" style={{ fontFamily: "Sora" }}>Designed Today. Printed Tomorrow. Delivered To You.</p>
            </div>
          </div>
          <p className="mt-9 text-right text-[12px] text-[#86868B]">Concept mockup, for illustration</p>
        </div>
      </div>
      <div className="border-y border-[#D2D2D7] bg-white">
        <ul className={`${wrap} grid grid-cols-2 gap-y-4 py-5 md:grid-cols-4`}>
          {trust.map(([Icon, t], i) => (
            <li key={t} className={`flex items-center gap-2.5 text-[14px] font-semibold text-[#1D1D1F] ${i > 0 ? "md:border-l md:border-[#D2D2D7] md:pl-6" : ""}`} data-testid={`text-trust-${i}`}>
              <Icon className="h-4 w-4 shrink-0 text-[#1D1D1F]" /> {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, sub, center = false }: { eyebrow: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={`reveal mb-12 max-w-[680px] ${center ? "mx-auto text-center" : ""}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-[32px] font-bold leading-[1.1] sm:text-[42px]">{title}</h2>
      {sub && <p className="mt-4 text-[17px] leading-relaxed">{sub}</p>}
    </div>
  );
}

function Services({ onOrder }: { onOrder: (s: string) => void }) {
  return (
    <section id="services" className="bg-white py-20 md:py-28">
      <div className={wrap}>
        <SectionHead eyebrow="Services" title="Everything your brand needs, under one roof." sub="Six focused services. One team handling design, print and delivery." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <article key={s.name} className="reveal group flex flex-col rounded-2xl border border-[#D2D2D7] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#2D2D2F] hover:shadow-[0_4px_20px_rgba(29,29,31,.06)]" style={{ transitionDelay: `${(i % 3) * 60}ms` }} data-testid={`card-service-${i}`}>
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#F5F5F7] text-[#1D1D1F] transition-colors group-hover:bg-[#1D1D1F] group-hover:text-white"><s.icon className="h-5 w-5" /></span>
                <span className="text-[12px] font-semibold text-[#86868B]">0{i + 1}</span>
              </div>
              <h3 className="mt-6 text-[22px] font-semibold">{s.name}</h3>
              <p className="mt-2 text-[15px] leading-relaxed">{s.line}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {s.items.map((it) => <li key={it} className="rounded-full border border-[#D2D2D7] px-3 py-1 text-[13px] text-[#1D1D1F]">{it}</li>)}
              </ul>
              <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#D2D2D7] pt-5 mt-7">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.12em]">From</p>
                  <p className="font-display text-[20px] font-bold text-[#FF6B00]" style={{ fontFamily: "Sora" }} data-testid={`text-service-price-${i}`}>{formatUGX(s.from)}</p>
                </div>
                <button onClick={() => onOrder(s.name)} className={`${btnOrange} !h-10 !px-4 text-[14px]`} data-testid={`button-order-service-${i}`}>Order This</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    ["Send Your Idea", "Tell us what you need: the product, quantity and any ideas or files you already have."],
    ["Approve Your Design", "We send a free design proof. Request changes until it is right, then approve."],
    ["We Print and Deliver", "Your order is printed and delivered to you across Kampala."],
  ];
  return (
    <section className="bg-[#F5F5F7] py-20 md:py-28">
      <div className={wrap}>
        <SectionHead eyebrow="How it works" title="Three steps from idea to your door." />
        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map(([t, d], i) => (
            <li key={t} className="reveal relative rounded-2xl border border-[#D2D2D7] bg-white p-7" style={{ transitionDelay: `${i * 90}ms` }} data-testid={`step-${i}`}>
              <span className="font-display text-[56px] font-extrabold leading-none text-[#D2D2D7]" style={{ fontFamily: "Sora" }}>{i + 1}</span>
              <h3 className="mt-4 text-[20px] font-semibold">{t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed">{d}</p>
              {i < 2 && <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 rounded-full border border-[#D2D2D7] bg-white p-1.5 text-[#1D1D1F] md:block" />}
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
    <section id="why" className="bg-[#F5F5F7] py-20 md:py-28">
      <div className={`${wrap} grid gap-12 lg:grid-cols-[.9fr_1.1fr]`}>
        <div className="reveal">
          <Eyebrow>Why Diglo</Eyebrow>
          <h2 className="text-[32px] font-bold leading-[1.1] sm:text-[42px]">Professional results, without the long wait.</h2>
          <p className="mt-4 max-w-[440px] text-[17px] leading-relaxed">Growing businesses need to look established from the first impression. We keep the process simple and the standard high.</p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-[#D2D2D7]">
            <img src={img("signage.jpg")} alt="Concept mockup of a roll-up banner and wall sign" className="aspect-[16/10] w-full object-cover" loading="lazy" />
          </div>
        </div>
        <div className="grid content-start gap-5 sm:grid-cols-2">
          {reasons.map(([Icon, t, d], i) => (
            <div key={t} className="reveal rounded-2xl border border-[#D2D2D7] bg-white p-6" style={{ transitionDelay: `${i * 70}ms` }} data-testid={`card-why-${i}`}>
              <Icon className="h-6 w-6 text-[#1D1D1F]" />
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
    <section id="pricing" className="bg-[#F5F5F7] py-20 md:py-28">
      <div className={wrap}>
        <SectionHead eyebrow="Pricing" title="Clear prices. No surprises." sub="Popular orders with transparent starting prices in Ugandan shillings." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRICES.map((p, i) => (
            <div key={p.name} className="reveal group flex items-center justify-between gap-4 rounded-2xl border border-[#D2D2D7] bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#2D2D2F]" data-testid={`card-price-${i}`}>
              <div className="min-w-0">
                <h3 className="text-[18px] font-semibold">{p.name}</h3>
                <p className="text-[14px]">{p.qty}</p>
                <p className="font-display mt-3 text-[24px] font-bold text-[#FF6B00]" style={{ fontFamily: "Sora" }} data-testid={`text-price-${i}`}>{formatUGX(p.price)}</p>
              </div>
              <button onClick={() => onOrder(p.service)} aria-label={`Order ${p.name}`} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#FF6B00] text-white transition-transform group-hover:rotate-[-45deg]" data-testid={`button-order-price-${i}`}><ArrowRight className="h-5 w-5" /></button>
            </div>
          ))}
        </div>
        <PriceCalculator />
        <div className="reveal mt-8 flex flex-col items-start justify-between gap-5 rounded-2xl border border-[#D2D2D7] bg-white p-6 md:flex-row md:items-center">
          <p className="max-w-[720px] text-[15px] leading-relaxed text-[#6E6E73]">All prices include design proof. Custom quote in 5 minutes on WhatsApp. Payment by Mobile Money or Bank Transfer.</p>
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
    <section id="work" className="bg-white py-20 md:py-28">
      <div className={wrap}>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHead eyebrow="Work" title="What an order can look like." sub="Illustrative concept work, not client projects. Each example shows a typical order, starting price and delivery time." />
        </div>
        <div className="-mx-5 mb-8 overflow-x-auto px-5 sm:mx-0 sm:px-0" role="tablist">
          <div className="flex w-max gap-2">
            {cats.map((c) => (
              <button key={c} role="tab" aria-selected={filter === c} onClick={() => setFilter(c)} className={`h-10 rounded-full border px-5 text-[14px] font-semibold transition-all ${filter === c ? "border-[#1D1D1F] bg-[#1D1D1F] text-white" : "border-[#D2D2D7] bg-white text-[#1D1D1F] hover:border-[#2D2D2F]"}`} data-testid={`button-filter-${c.toLowerCase()}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((w, i) => (
            <article key={w.title} className="group flex flex-col overflow-hidden rounded-2xl border border-[#D2D2D7] bg-white animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }} data-testid={`card-work-${i}`}>
              <div className="relative overflow-hidden bg-[#F5F5F7]">
                <img src={img(w.image)} alt={`Concept: ${w.title}`} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#1D1D1F]">Concept · {w.cat}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-[19px] font-semibold">{w.title}</h3>
                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[14px]">
                  <dt>Client Type</dt><dd className="text-right font-medium text-[#1D1D1F]">{w.client}</dd>
                  <dt>What Ordered</dt><dd className="text-right font-medium text-[#1D1D1F]">{w.ordered}</dd>
                  <dt>Price From</dt><dd className="text-right font-semibold text-[#FF6B00]">{formatUGX(w.from)}</dd>
                  <dt>Delivery Time</dt><dd className="text-right font-medium text-[#1D1D1F]">{w.time}</dd>
                </dl>
                <button onClick={() => onOrder(w.service)} className={`${btnOrange} mt-6 !h-11 w-full`} data-testid={`button-order-work-${i}`}>Order Like This</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const people = [["Sarah N.", "Sarah's Cakes"], ["David M.", "Prime Fitness"], ["Grace K.", "Grace Boutique"]];
  return (
    <section className="bg-[#F5F5F7] py-20 md:py-28">
      <div className={wrap}>
        <SectionHead eyebrow="Testimonials" title="In their words." sub="Customer quotes will appear here once each customer has approved their wording." />
        <div className="grid gap-5 md:grid-cols-3">
          {people.map(([n, b], i) => (
            <figure key={n} className="reveal flex flex-col rounded-2xl border border-[#D2D2D7] bg-white p-6" style={{ transitionDelay: `${i * 80}ms` }} data-testid={`card-testimonial-${i}`}>
              <Quote className="h-6 w-6 text-[#D2D2D7]" />
              <blockquote className="mt-4 flex-1 rounded-xl border border-dashed border-[#D2D2D7] bg-[#F5F5F7] p-4 text-[14px] italic">
                Awaiting approved quote. This space is reserved and intentionally left without text.
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#1D1D1F] text-[14px] font-semibold text-white">{n.split(" ").map((x) => x[0]).join("")}</span>
                <span><span className="block font-semibold text-[#1D1D1F]">{n}</span><span className="text-[14px]">{b}</span></span>
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
    <section id="faq" className="bg-white py-20 md:py-28">
      <div className={`${wrap} grid gap-10 lg:grid-cols-[.8fr_1.2fr]`}>
        <div className="reveal">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="text-[32px] font-bold leading-[1.1] sm:text-[42px]">Questions, answered.</h2>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#D2D2D7] px-3 py-1 text-[13px] font-semibold text-[#1D1D1F]"><Clock className="h-3.5 w-3.5" /> Draft answers, pending final review</p>
        </div>
        <div className="divide-y divide-[#D2D2D7] border-y border-[#D2D2D7]">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 py-5 text-left" data-testid={`button-faq-${i}`}>
                  <span className="font-display text-[17px] font-semibold text-[#1D1D1F]" style={{ fontFamily: "Sora" }}>{f.q}</span>
                  <Plus className={`h-5 w-5 shrink-0 text-[#1D1D1F] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
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

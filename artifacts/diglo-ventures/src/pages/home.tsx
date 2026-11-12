import { useEffect, useState, type ReactNode } from "react";
import { Link } from "wouter";
import { ArrowRight, Check, FileCheck2, MessageCircle, Plus, ShieldCheck, Truck, Zap, Printer, Shirt, Package } from "lucide-react";
import { CONTACT } from "@/lib/site";
import seo from "@/lib/seo-data.json";
import { useSeo } from "@/lib/seo";
import { btnDark, btnOrange, wrap } from "@/components/tokens";
import { useSite } from "@/components/site-providers";
import { Footer, MobileBar, MobileCtaBar, Nav } from "@/components/site-shell";
import { QuoteForm } from "@/components/quote-form";
import { UniformIndustry } from "@/components/uniform-industry";
import { ProductPhoto } from "@/components/product-photo";
import { DIGLO_IMAGES } from "@/lib/images";
import { CompanyProfileSections } from "@/components/company-profile-sections";
import { productQuotePath, quotePath } from "@/lib/products";

/* ---------- data ---------- */
const SERVICES = [
  { name: "Gift Packs", icon: Package, line: "Ready to give. Branded for you." },
  { name: "Corporate Uniforms", icon: Shirt, line: "Your team, looking sharp." },
  { name: "PPE", icon: ShieldCheck, line: "Safe. Compliant. On site." },
  { name: "Printing Services", icon: Printer, line: "Print that sells." },
];

type Cat = "Branding" | "Print" | "Merch" | "Signage";
const WORK: { title: string; cat: Cat; client: string; ordered: string; time: string; service: string; photo: keyof typeof DIGLO_IMAGES }[] = [
  { title: "Bakery gift pack", cat: "Branding", client: "Home bakery", ordered: "Gift boxes, branded bags and labels", time: "3–5 days", service: "Gift Packs", photo: "giftPacks" },
  { title: "Launch print set", cat: "Print", client: "New retail shop", ordered: "Business cards and flyers", time: "24 hours", service: "Printing Services", photo: "printing" },
  { title: "Gym team kit", cat: "Merch", client: "Fitness studio", ordered: "Printed T-shirts and caps", time: "2–3 days", service: "Corporate Uniforms", photo: "uniforms" },
  { title: "Storefront roll-up", cat: "Signage", client: "Fitness studio", ordered: "Roll-up banner and wall sign", time: "48 hours", service: "Printing Services", photo: "printing" },
  { title: "Boutique gift set", cat: "Branding", client: "Fashion boutique", ordered: "Branded bags, tags and thank-you cards", time: "4–6 days", service: "Gift Packs", photo: "giftPacks" },
  { title: "Product label run", cat: "Print", client: "Juice producer", ordered: "Bottle labels", time: "24 hours", service: "Printing Services", photo: "printing" },
  { title: "Staff uniforms", cat: "Merch", client: "Restaurant", ordered: "Embroidered polo uniforms", time: "3–4 days", service: "Corporate Uniforms", photo: "uniforms" },
  { title: "Event banner", cat: "Signage", client: "Conference organiser", ordered: "Stage banner", time: "24 hours", service: "Printing Services", photo: "printing" },
  { title: "Shopping bag set", cat: "Branding", client: "Cosmetics seller", ordered: "Branded paper bags and stickers", time: "3 days", service: "Gift Packs", photo: "giftPacks" },
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
    const ids = ["home", "services", "work", "why"];
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
    <div className="diglo-white-theme min-h-[100dvh] bg-white pb-[144px] text-[#4A4A4A] md:pb-0">
      <Nav active={active} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        <Hero onQuote={() => openQuote()} onWhatsApp={() => openWhatsApp()} />
        <div className="sticky top-[104px] z-30 border-y border-[#3A3A3C] bg-[#2D2D2F] py-2 text-center text-[13px] font-semibold text-white lg:top-[94px]" data-testid="badge-one-vendor">
          One Vendor. One Quote. One Delivery.
        </div>
        <TrustBar />
        <WhyWins />
        <WhatIs />
        <Services />
        <CompanyProfileSections />
        <UniformIndustry />
        <HowItWorks />
        <Why />
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
      <div className={`${wrap} grid grid-cols-1 gap-2 text-center text-[12px] font-semibold text-[#F5F5F7] sm:grid-cols-2 lg:grid-cols-4 sm:text-[13px]`}>
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

function Services() {
  return (
    <section id="services" className="bg-white py-10 md:py-16">
      <div className={wrap}>
        <SectionHead eyebrow="Services" title="Four services. One dependable team." sub="Based in Kampala, serving East Africa." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => <ServiceCard key={s.name} service={s} index={i} />)}
        </div>
        <div className="mt-8 flex flex-col gap-4 border-t border-[#E5E5E5] pt-5 md:flex-row md:items-center md:justify-between">
          <p className="text-[14px] font-medium text-[#D4D4D4]">Trusted by Hotels, Schools, Banks &amp; Churches across East Africa</p>
          <p className="text-[14px] text-[#4A4A4A]">See what we made for 500+ teams <a href="#work" className="ml-1 font-semibold">View Our Work <ArrowRight className="inline h-4 w-4" /></a></p>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: typeof SERVICES[number]; index: number }) {
  return (
    <article id={`service-${service.name.toLowerCase().replaceAll(" ", "-")}`} className="reveal group flex flex-col rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,.06)] transition-colors duration-200 hover:border-[#333333]" data-testid={`card-service-${index}`}>
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#F7F7F7] text-black"><service.icon className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[18px] font-semibold leading-tight text-black">{service.name}</h3>
        </div>
      </div>
      <p className="mt-3 min-h-6 text-[15px] leading-relaxed text-[#4A4A4A]">{service.line}</p>
      <p className="mt-3 flex-1 text-[13px] leading-relaxed text-[#4A4A4A]">Customized Quote - Price Depends on Quantity &amp; Branding</p>
      <div className="mt-5 border-t border-[#E5E5E5] pt-4">
        <Link href={quotePath(service.name, "Services", service.name)} className={`${btnOrange} min-h-11 !h-11 w-full !px-4 text-[14px] lg:max-w-[220px]`} data-testid={`button-order-service-${index}`}>Get Custom Quote</Link>
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
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

function Work({ onOrder }: { onOrder: (product: string, category?: string, service?: string) => void }) {
  const [filter, setFilter] = useState<"All" | Cat>("All");
  const cats = ["All", "Branding", "Print", "Merch", "Signage"] as const;
  const list = WORK.filter((w) => filter === "All" || w.cat === filter);
  return (
    <section id="work" className="bg-white py-10 md:py-16">
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
            <article key={w.title} className="group flex flex-col overflow-hidden rounded-xl border border-[#E5E5E5] bg-white shadow-[0_4px_20px_rgba(0,0,0,.06)]" data-testid={`card-work-${i}`}>
              <ProductPhoto src={DIGLO_IMAGES[w.photo]} alt={`Diglo Ventures - ${w.service} for ${w.title} in Kampala`} label={w.service} className="aspect-[4/3] border-b border-[#E5E5E5]" />
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-[18px] font-semibold text-black">{w.title}</h3>
                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[14px]">
                  <dt className="text-[#4A4A4A]">For</dt><dd className="text-right font-medium text-[#4A4A4A]">{w.client}</dd>
                  <dt className="text-[#4A4A4A]">Includes</dt><dd className="text-right font-medium text-[#4A4A4A]">{w.ordered}</dd>
                  <dt className="text-[#4A4A4A]">Delivery</dt><dd className="text-right font-medium text-[#4A4A4A]">{w.time}</dd>
                </dl>
                <button onClick={() => onOrder(w.title, "Our Work", w.service)} className={`${btnOrange} mt-5 w-full lg:max-w-[220px]`} data-testid={`button-order-work-${i}`}>Get Custom Quote</button>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          <SectionHead eyebrow="Get a quote" title="Tell us what you need." sub="Send a few details. We’ll confirm your customized quote on WhatsApp." />
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

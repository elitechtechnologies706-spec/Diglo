import { useEffect, useState, type ReactNode } from "react";
import { Link } from "wouter";
import { Home as HomeIcon, Image as ImageIcon, LayoutGrid, Mail, Menu, MessageCircle, PackageSearch, Phone, Send, Tag, X } from "lucide-react";
import { CONTACT } from "@/lib/site";
import seo from "@/lib/seo-data.json";
import { btnOrange, homeHash, wrap } from "@/components/tokens";
import { useSite } from "@/components/site-providers";

const SERVICE_LIST = ["Gift Packs", "Corporate Uniforms", "PPE", "Printing Services"];

export function Logo() {
  return (
    <span className="flex flex-col items-start leading-none" aria-label="Diglo Ventures" style={{ fontFamily: "Sora" }}>
      <span className="font-display text-[20px] font-extrabold tracking-tight text-white md:text-[28px]">
        DIGLO<span className="ml-0.5 inline-block h-2 w-2 rounded-full bg-[#FF6B00] align-baseline" />
      </span>
      <span className="mt-1 text-[9px] font-semibold uppercase tracking-[4px] text-[#A1A1A6] md:text-[11px]">VENTURES</span>
    </span>
  );
}

export function Nav({ active = "", menuOpen, setMenuOpen }: { active?: string; menuOpen: boolean; setMenuOpen: (b: boolean) => void }) {
  const { openQuote, showPhoneUnavailable } = useSite();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 8); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  const links = [["services", "Services"], ["work", "Work"], ["pricing", "Pricing"]] as const;
  const linkCls = (id: string) => `relative py-2 text-[15px] font-medium transition-colors ${active === id ? "text-white" : "text-[#A1A1A6] hover:text-white"}`;
  const dot = <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#FF6B00]" />;
  return (
    <header className={`sticky top-0 z-40 border-b border-[#3A3A3C] bg-[#1D1D1F]/95 backdrop-blur-md transition-shadow ${scrolled ? "shadow-[0_4px_20px_rgba(0,0,0,.30)]" : ""}`}>
      <div className={`${wrap} flex h-16 items-center justify-between md:h-20`}>
        <a href={homeHash("home")} aria-label="Diglo Ventures home" data-testid="link-logo"><Logo /></a>
        <nav className="hidden items-center gap-7 xl:gap-8 lg:flex">
          {links.map(([id, l]) => (
            <a key={id} href={homeHash(id)} className={linkCls(id)} data-testid={`link-nav-${id}`}>{l}{active === id && dot}</a>
          ))}
          <Link href="/track" className={linkCls("track")} data-testid="link-nav-track">Track Order{active === "track" && dot}</Link>
          <a href={homeHash("why")} className={linkCls("why")} data-testid="link-nav-why">Why Diglo Ventures{active === "why" && dot}</a>
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={showPhoneUnavailable} className="grid h-10 w-10 place-items-center rounded-full border border-[#3A3A3C] text-[#F5F5F7] lg:h-auto lg:w-auto lg:gap-2 lg:border-0 lg:px-2" aria-label="Phone number" data-testid="button-nav-phone">
            <Phone className="h-4 w-4" /><span className="hidden text-[14px] font-medium lg:inline">{CONTACT.phone || "Phone"}</span>
          </button>
          <button onClick={() => openQuote()} className={`${btnOrange} !h-10 !px-4 text-[13px] md:!h-11 md:!px-5 md:text-[14px] lg:!px-6 lg:text-[15px]`} data-testid="button-nav-quote">Get a Quote</button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="hidden h-11 w-11 place-items-center rounded-full border border-[#3A3A3C] text-white md:grid lg:hidden" aria-label="Menu" data-testid="button-menu">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <div className={`overflow-hidden border-t bg-[#2D2D2F] transition-all duration-300 lg:hidden ${menuOpen ? "max-h-96 border-[#3A3A3C] opacity-100" : "max-h-0 border-transparent opacity-0"}`}>
        <div className={`${wrap} flex flex-col py-3`}>
          {[...links, ["why", "Why Diglo Ventures"] as const].map(([id, l]) => (
            <a key={id} href={homeHash(id)} onClick={() => setMenuOpen(false)} className="py-3 text-base font-medium text-white" data-testid={`link-menu-${id}`}>{l}</a>
          ))}
          <Link href="/track" onClick={() => setMenuOpen(false)} className="py-3 text-base font-medium text-white" data-testid="link-menu-track">Track Order</Link>
        </div>
      </div>
    </header>
  );
}

export function MobileBar({ active = "" }: { active?: string }) {
  const { openQuote } = useSite();
  const items = [["home", "Home", HomeIcon], ["services", "Services", LayoutGrid], ["work", "Work", ImageIcon], ["pricing", "Pricing", Tag]] as const;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#3A3A3C] bg-[#1D1D1F]/95 text-[#F5F5F7] backdrop-blur md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="grid h-16 grid-cols-5">
        {items.map(([id, l, Icon]) => (
          <a key={id} href={homeHash(id)} className="relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-white" data-testid={`link-bottom-${id}`}>
            <Icon className={`h-5 w-5 ${active === id ? "text-[#FF6B00]" : "text-[#A1A1A6]"}`} strokeWidth={active === id ? 2.4 : 1.8} />
            {l}
            {active === id && <span className="absolute top-1 h-1 w-1 rounded-full bg-[#FF6B00]" />}
          </a>
        ))}
        <button onClick={() => openQuote()} className="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold text-white" data-testid="button-bottom-quote">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#FF6B00] text-white"><Send className="h-4 w-4" /></span>
          Quote
        </button>
      </div>
    </nav>
  );
}

export function Footer() {
  const { openWhatsApp, showPhoneUnavailable } = useSite();
  return (
    <footer className="dark-zone border-t border-[#3A3A3C] bg-[#1D1D1F] pb-10 pt-16 text-[#A1A1A6]">
      <div className={`${wrap} grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]`}>
        <div>
          <Logo />
          <p className="mt-4 max-w-[280px] text-[15px] leading-relaxed">Branding and printing for growing businesses in Kampala, Uganda.</p>
          <ul className="mt-6 space-y-2 text-[14px]">
            {seo.pages.map((p) => <li key={p.slug}><Link href={`/${p.slug}`} className="transition hover:text-white" data-testid={`link-footer-${p.slug}`}>{p.h1}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-[14px] font-semibold">Services</h4>
          <ul className="space-y-2.5 text-[15px]">{SERVICE_LIST.map((s) => <li key={s}><a href={homeHash("services")} className="transition hover:text-white">{s}</a></li>)}</ul>
        </div>
        <div>
          <h4 className="mb-4 text-[14px] font-semibold">Company</h4>
          <ul className="space-y-2.5 text-[15px]">
            <li><a href={homeHash("work")} className="transition hover:text-white">Work</a></li>
            <li><a href={homeHash("pricing")} className="transition hover:text-white">Pricing</a></li>
            <li><Link href="/track" className="transition hover:text-white">Track Order</Link></li>
            <li><a href={homeHash("faq")} className="transition hover:text-white">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-[14px] font-semibold">Contact + Hours</h4>
          <ul className="space-y-2.5 text-[15px]">
            <li><button onClick={() => openWhatsApp()} className="inline-flex items-center gap-2 transition hover:text-white" data-testid="button-footer-whatsapp"><MessageCircle className="h-4 w-4" /> WhatsApp</button></li>
            <li><button onClick={showPhoneUnavailable} className="inline-flex items-center gap-2 transition hover:text-white" data-testid="button-footer-phone"><Phone className="h-4 w-4" /> Phone</button></li>
            <li><a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 break-all transition hover:text-white" data-testid="link-footer-email"><Mail className="h-4 w-4 shrink-0" /> {CONTACT.email}</a></li>
            <li className="pt-4 text-[#A1A1A6]">Mon–Sat · 8AM–7PM EAT</li>
            <li className="text-[#A1A1A6]">Kampala, Uganda</li>
          </ul>
        </div>
      </div>
      <div className={`${wrap} mt-14 flex flex-col justify-between gap-2 border-t border-[#3A3A3C] pt-6 text-[13px] sm:flex-row`}>
        <p>© {new Date().getFullYear()} Diglo Ventures</p>
        <p>Portfolio images are illustrative concepts.</p>
      </div>
    </footer>
  );
}

/** Shell for non-home public pages. */
export function PageShell({ children, active = "" }: { children: ReactNode; active?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-[100dvh] bg-[#1D1D1F] pb-[144px] text-[#F5F5F7] md:pb-0">
      <Nav active={active} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>{children}</main>
      <Footer />
      <MobileBar />
      <MobileCtaBar />
    </div>
  );
}

export function MobileCtaBar() {
  const { openQuote, openWhatsApp } = useSite();
  return (
    <div className="fixed inset-x-0 bottom-16 z-40 h-16 border-t border-[#3A3A3C] bg-[#2D2D2F] px-3 py-2 md:hidden">
      <div className="grid h-full grid-cols-[3fr_2fr] gap-2">
        <button onClick={() => openQuote()} className={`${btnOrange} !h-12 w-full !px-2 text-[13px]`} data-testid="button-mobile-sticky-quote">Get a Quote</button>
        <button onClick={() => openWhatsApp()} className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full border border-[#A1A1A6] bg-[#2D2D2F] px-2 text-[13px] font-semibold text-white" data-testid="button-mobile-sticky-whatsapp"><MessageCircle className="h-4 w-4" /> WhatsApp</button>
      </div>
    </div>
  );
}

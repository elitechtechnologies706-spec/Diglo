import { useEffect, useState, type ReactNode } from "react";
import { Link } from "wouter";
import { Home as HomeIcon, Image as ImageIcon, LayoutGrid, Mail, Menu, MessageCircle, Phone, Send, Tag, X } from "lucide-react";
import { CONTACT } from "@/lib/site";
import seo from "@/lib/seo-data.json";
import { btnOrange, homeHash, wrap } from "@/components/tokens";
import { useSite } from "@/components/site-providers";
import { DesktopProductsMenu, MobileProductsAccordion } from "@/components/products-menu";

const SERVICE_LIST = ["Gift Packs", "Corporate Uniforms", "PPE", "Printing Services"];

export function Logo() {
  return (
    <span className="flex flex-col items-start leading-none" aria-label="Diglo Ventures" style={{ fontFamily: "Sora" }}>
      <span className="font-display text-[20px] font-extrabold tracking-tight text-white md:text-[22px]">
        DIGLO<span className="ml-0.5 inline-block h-2 w-2 rounded-full bg-[#FF6B00] align-baseline" />
      </span>
      <span className="mt-1 text-[9px] font-semibold uppercase tracking-[4px] text-[#A1A1A6] md:text-[10px]">VENTURES</span>
    </span>
  );
}

export function Nav({ active = "", menuOpen, setMenuOpen }: { active?: string; menuOpen: boolean; setMenuOpen: (b: boolean) => void }) {
  const { openQuote, openWhatsApp } = useSite();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 8); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  const links = [
    ["home", "Home"], ["service-gift-packs", "Gift Packs"], ["service-corporate-uniforms", "Uniforms"],
    ["service-ppe", "PPE"], ["service-printing-services", "Printing"], ["work", "Our Work"], ["pricing", "Pricing"],
  ] as const;
  const linkCls = (id: string) => `relative whitespace-nowrap py-1 text-[11px] font-medium text-white transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-[2px] after:scale-x-0 after:bg-[#FF6B00] after:transition-transform hover:text-[#FF6B00] hover:after:scale-x-100 xl:text-[12px] ${active === id ? "text-[#FF6B00] after:scale-x-100" : ""}`;
  return (
    <header className={`sticky top-0 z-40 border-b border-[#3A3A3C] bg-[#1D1D1F]/95 backdrop-blur-md transition-shadow ${scrolled ? "shadow-[0_4px_20px_rgba(0,0,0,.30)]" : ""}`}>
      <div className={`${wrap} flex h-16 items-center justify-between`}>
        <a href={homeHash("home")} aria-label="Diglo Ventures home" data-testid="link-logo"><Logo /></a>
        <nav aria-label="Main navigation" className="hidden min-w-0 flex-1 items-center justify-center gap-2 lg:flex xl:gap-3">
          <a href={homeHash("home")} className={linkCls("home")} data-testid="link-nav-home">Home</a>
          <DesktopProductsMenu active={active === "products"} linkClassName={linkCls("products")} />
          {links.filter(([id]) => id.startsWith("service-")).map(([id, l]) => (
            <a key={id} href={homeHash(id)} className={linkCls(id)} data-testid={`link-nav-${id}`}>{l}</a>
          ))}
          <Link href="/about" className={linkCls("about")} data-testid="link-nav-about">About Us</Link>
          {links.filter(([id]) => id === "work" || id === "pricing").map(([id, l]) => (
            <a key={id} href={homeHash(id)} className={linkCls(id)} data-testid={`link-nav-${id}`}>{l}</a>
          ))}
          <Link href="/track" className={linkCls("track")} data-testid="link-nav-track">Track Order</Link>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <a href={`tel:${CONTACT.phone.replace(/[^\d+]/g, "")}`} className="hidden items-center gap-2 whitespace-nowrap text-[14px] font-medium text-white lg:flex" aria-label={`Call ${CONTACT.phone}`} data-testid="link-nav-phone">
            <Phone className="h-4 w-4" />{CONTACT.phone}
          </a>
          <button onClick={() => openWhatsApp()} className="grid h-9 w-9 place-items-center rounded-lg text-white lg:hidden" aria-label="WhatsApp Diglo Ventures" data-testid="button-nav-whatsapp">
            <MessageCircle className="h-5 w-5" />
          </button>
          <button onClick={() => openQuote()} className={`${btnOrange} !h-9 !px-4 !text-[13px]`} data-testid="button-nav-quote">Get a Quote</button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="grid h-9 w-9 place-items-center rounded-lg text-white lg:hidden" aria-label="Menu" data-testid="button-menu">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <div className={`overflow-hidden border-t bg-[#2D2D2F] transition-all duration-300 lg:hidden ${menuOpen ? "max-h-[70vh] border-[#3A3A3C] opacity-100" : "max-h-0 border-transparent opacity-0"}`}>
        <nav aria-label="Mobile navigation" className={`${wrap} flex max-h-[70vh] flex-col overflow-y-auto py-3`}>
          <a href={homeHash("home")} onClick={() => setMenuOpen(false)} className="py-3 text-base font-medium text-white" data-testid="link-menu-home">Home</a>
          <MobileProductsAccordion onNavigate={() => setMenuOpen(false)} />
          {links.filter(([id]) => id.startsWith("service-")).map(([id, l]) => (
            <a key={id} href={homeHash(id)} onClick={() => setMenuOpen(false)} className="py-3 text-base font-medium text-white" data-testid={`link-menu-${id}`}>{l}</a>
          ))}
          <Link href="/about" onClick={() => setMenuOpen(false)} className="py-3 text-base font-medium text-white" data-testid="link-menu-about">About Us</Link>
          {links.filter(([id]) => id === "work" || id === "pricing").map(([id, l]) => (
            <a key={id} href={homeHash(id)} onClick={() => setMenuOpen(false)} className="py-3 text-base font-medium text-white" data-testid={`link-menu-${id}`}>{l}</a>
          ))}
          <Link href="/track" onClick={() => setMenuOpen(false)} className="py-3 text-base font-medium text-white" data-testid="link-menu-track">Track Order</Link>
        </nav>
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
            <Icon className={`h-5 w-5 ${active === id ? "text-white" : "text-[#A1A1A6]"}`} strokeWidth={active === id ? 2.2 : 1.8} />
            {l}
            {active === id && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#FF6B00]" aria-hidden="true" />}
          </a>
        ))}
        <button onClick={() => openQuote()} className="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold text-white" data-testid="button-bottom-quote">
          <Send className="h-5 w-5 text-[#A1A1A6]" />
          Quote
        </button>
      </div>
    </nav>
  );
}

export function Footer() {
  const { openWhatsApp } = useSite();
  return (
    <footer className="dark-zone border-t border-[#3A3A3C] bg-[#1D1D1F] pb-10 pt-16 text-[#A1A1A6]">
      <div className={`${wrap} grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]`}>
        <div>
          <Logo />
          <p className="mt-4 max-w-[280px] text-[15px] leading-relaxed">Gift packs, uniforms, PPE and printing for teams in Kampala.</p>
          <ul className="mt-6 space-y-2 text-[14px]">
            {seo.pages.map((p) => <li key={p.slug}><Link href={`/${p.slug}`} className="transition hover:text-white" data-testid={`link-footer-${p.slug}`}>{p.h1}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-[14px] font-semibold">Services</h4>
          <ul className="space-y-2.5 text-[15px]">{SERVICE_LIST.map((s) => <li key={s}><a href={homeHash(`service-${s.toLowerCase().replaceAll(" ", "-")}`)} className="transition hover:text-white">{s}</a></li>)}</ul>
        </div>
        <div>
          <h4 className="mb-4 text-[14px] font-semibold">Company</h4>
          <ul className="space-y-2.5 text-[15px]">
            <li><a href={homeHash("work")} className="transition hover:text-white">Work</a></li>
            <li><a href={homeHash("pricing")} className="transition hover:text-white">Pricing</a></li>
            <li><Link href="/about" className="transition hover:text-white" data-testid="link-footer-about">About Us</Link></li>
            <li><Link href="/track" className="transition hover:text-white">Track Order</Link></li>
            <li><a href={homeHash("faq")} className="transition hover:text-white">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-[14px] font-semibold">Contact + Hours</h4>
          <ul className="space-y-2.5 text-[15px]">
            <li><button onClick={() => openWhatsApp()} className="inline-flex items-center gap-2 transition hover:text-white" data-testid="button-footer-whatsapp"><MessageCircle className="h-4 w-4" /> WhatsApp</button></li>
            <li><a href={`tel:${CONTACT.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-2 transition hover:text-white" data-testid="link-footer-phone"><Phone className="h-4 w-4" /> {CONTACT.phone}</a></li>
            <li><a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 break-all transition hover:text-white" data-testid="link-footer-email"><Mail className="h-4 w-4 shrink-0" /> {CONTACT.email}</a></li>
            <li className="pt-4 text-[#A1A1A6]">Mon–Sat · 8AM–7PM EAT</li>
            <li className="text-[#A1A1A6]">Kampala, Uganda</li>
          </ul>
        </div>
      </div>
      <div className={`${wrap} mt-14 flex flex-col justify-between gap-2 border-t border-[#3A3A3C] pt-6 text-[13px] sm:flex-row`}>
        <p>© {new Date().getFullYear()} Diglo Ventures</p>
        <p>Kampala, Uganda</p>
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
        <button onClick={() => openWhatsApp()} className="inline-flex h-12 items-center justify-center gap-1.5 rounded-lg border border-[#A1A1A6] bg-[#2D2D2F] px-2 text-[14px] font-semibold text-white" data-testid="button-mobile-sticky-whatsapp"><MessageCircle className="h-4 w-4" /> WhatsApp</button>
      </div>
    </div>
  );
}

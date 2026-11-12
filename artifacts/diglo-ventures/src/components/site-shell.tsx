import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Home as HomeIcon, Image as ImageIcon, LayoutGrid, Mail, Menu, Shield, X } from "lucide-react";
import { CONTACT } from "@/lib/site";
import seo from "@/lib/seo-data.json";
import { btnDark, btnOrange, homeHash, wrap } from "@/components/tokens";
import { useSite } from "@/components/site-providers";
import { DesktopProductsMenus, MobileProductsAccordion } from "@/components/products-menu";
import { productDetails, quotePath } from "@/lib/products";

const SERVICE_LIST = ["Gift Packs", "Corporate Uniforms", "PPE", "Printing Services"];

export function Logo() {
  return (
    <span className="flex flex-col items-start leading-none" aria-label="Diglo Ventures" style={{ fontFamily: "Sora" }}>
      <span className="font-display text-[18px] font-extrabold tracking-tight text-black md:text-[22px]">
        DIGLO
      </span>
      <span className="mt-1 text-[9px] font-semibold uppercase tracking-[4px] text-[#4A4A4A] md:text-[10px]">VENTURES</span>
    </span>
  );
}

export function Nav({ active = "", menuOpen, setMenuOpen }: { active?: string; menuOpen: boolean; setMenuOpen: (b: boolean) => void }) {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 8); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  const route = location.split("?")[0].split("#")[0];
  const query = location.includes("?") ? location.slice(location.indexOf("?")) : window.location.search;
  const selectedProduct = new URLSearchParams(query).get("product") ?? "";
  const currentCategory = productDetails(selectedProduct).category;
  const homeIsCurrent = route === "/";
  const contactIsCurrent = route === "/quote" || (route === "/" && window.location.hash === "#quote");
  const linkCls = (id: string) => `relative whitespace-nowrap py-1 text-[13px] font-medium text-black transition-colors hover:text-[#FF6A00] hover:underline hover:underline-offset-4 ${id === "home" && homeIsCurrent || id === "about" && route === "/about" || active === id ? "text-[#FF6A00] underline underline-offset-4" : ""}`;
  return (
    <header className={`sticky top-0 z-40 border-b border-[#E5E5E5] bg-white/95 backdrop-blur-md transition-shadow ${scrolled ? "shadow-[0_4px_20px_rgba(0,0,0,.06)]" : ""}`}>
      <div className={`${wrap} flex min-h-16 flex-wrap items-center justify-between gap-x-2 gap-y-1 py-2 lg:h-16 lg:flex-nowrap lg:py-0`}>
        <div className="flex min-w-0 shrink-0 items-center">
          <a href={homeHash("home")} aria-label="Diglo Ventures home" data-testid="link-logo"><Logo /></a>
        </div>
        <nav aria-label="Main navigation" className="hidden min-w-0 flex-1 items-center justify-center gap-3 lg:flex xl:gap-5">
          <a href={homeHash("home")} aria-current={homeIsCurrent ? "page" : undefined} className={linkCls("home")} data-testid="link-nav-home">Home</a>
          <Link href="/about" aria-current={route === "/about" ? "page" : undefined} className={linkCls("about")} data-testid="link-nav-about">About Us</Link>
          <DesktopProductsMenus currentCategory={currentCategory} />
          <a href={homeHash("quote")} aria-current={contactIsCurrent ? "page" : undefined} className={linkCls("contact")} data-testid="link-nav-contact">Contact Us</a>
        </nav>
        <div className="flex shrink-0 items-center gap-1 lg:gap-2">
          <Link href="/quote" aria-current={route === "/quote" ? "page" : undefined} className={`${btnOrange} !h-9 !px-3 !text-[13px] lg:!h-10 lg:!px-4`} data-testid="link-nav-quote">Get Custom Quote</Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="nav-link grid h-8 w-8 place-items-center rounded-lg text-black lg:hidden" aria-label="Menu" data-testid="button-menu">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <div className={`overflow-hidden border-t bg-white transition-all duration-300 lg:hidden ${menuOpen ? "max-h-[70vh] border-[#E5E5E5] opacity-100" : "max-h-0 border-transparent opacity-0"}`}>
        <nav aria-label="Mobile navigation" className={`${wrap} flex max-h-[70vh] flex-col overflow-y-auto py-3`}>
          <a href={homeHash("home")} onClick={() => setMenuOpen(false)} aria-current={homeIsCurrent ? "page" : undefined} className="py-3 text-base font-medium text-black" data-testid="link-menu-home">Home</a>
          <Link href="/about" onClick={() => setMenuOpen(false)} aria-current={route === "/about" ? "page" : undefined} className="py-3 text-base font-medium text-black" data-testid="link-menu-about">About Us</Link>
          <MobileProductsAccordion onNavigate={() => setMenuOpen(false)} />
          <a href={homeHash("quote")} onClick={() => setMenuOpen(false)} aria-current={contactIsCurrent ? "page" : undefined} className="py-3 text-base font-medium text-black" data-testid="link-menu-contact">Contact Us</a>
          <Link href="/quote" onClick={() => setMenuOpen(false)} aria-current={route === "/quote" ? "page" : undefined} className="py-3 text-base font-medium text-black" data-testid="link-menu-quote">Get Custom Quote</Link>
        </nav>
      </div>
    </header>
  );
}

export function MobileBar({ active = "" }: { active?: string }) {
  const items = [["home", "Home", HomeIcon], ["services", "Products", LayoutGrid], ["work", "Work", ImageIcon], ["about", "About", Shield]] as const;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 w-full max-w-[100vw] border-t border-[#E5E5E5] bg-white/95 text-black backdrop-blur md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="grid h-16 grid-cols-5 [&>*]:min-w-0">
        {items.map(([id, l, Icon]) => (
          <a key={id} href={id === "about" ? "/about" : homeHash(id === "services" ? "services" : id)} aria-current={active === id ? "page" : undefined} className="relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-black" data-testid={`link-bottom-${id}`}>
            <Icon className="h-5 w-5 text-black" strokeWidth={active === id ? 2.2 : 1.8} />
            {l}
            {active === id && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-black" aria-hidden="true" />}
          </a>
        ))}
        <Link href="/quote" aria-current={active === "quote" ? "page" : undefined} className="flex flex-col items-center justify-center gap-1 text-[11px] font-semibold text-black" data-testid="link-bottom-quote"><Mail className="h-5 w-5 text-[#4A4A4A]" />Quote</Link>
      </div>
    </nav>
  );
}

export function Footer() {
  const { openWhatsApp } = useSite();
  const [location] = useLocation();
  const [activeHash, setActiveHash] = useState(window.location.hash);
  const activeRoute = location.split("?")[0].split("#")[0];
  const search = location.includes("?") ? location.slice(location.indexOf("?")) : window.location.search;
  const selectedProduct = new URLSearchParams(search).get("product") ?? "";
  useEffect(() => {
    const updateHash = () => setActiveHash(window.location.hash);
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);
  return (
    <footer className="border-t border-[#E5E5E5] bg-white pb-10 pt-12 text-[#4A4A4A]">
      <div className={`${wrap} grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]`}>
        <div>
          <Logo />
          <p className="mt-4 max-w-[280px] text-[15px] leading-relaxed">Gift packs, uniforms, PPE and printing. Based in Kampala, serving East Africa.</p>
          <ul className="mt-6 space-y-2 text-[14px]">
            {seo.pages.map((p) => <li key={p.slug}><Link href={`/${p.slug}`} aria-current={activeRoute === `/${p.slug}` ? "page" : undefined} className="transition hover:text-[#FF6A00] hover:underline" data-testid={`link-footer-${p.slug}`}>{p.h1}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-[14px] font-semibold text-black">Services</h4>
          <ul className="space-y-2.5 text-[15px]">{SERVICE_LIST.map((s) => <li key={s}><Link href={quotePath(s, "Services", s)} aria-current={activeRoute === "/quote" && selectedProduct === s ? "page" : undefined} className="transition hover:text-[#FF6A00] hover:underline">{s}</Link></li>)}</ul>
        </div>
        <div>
          <h4 className="mb-4 text-[14px] font-semibold text-black">Company</h4>
          <ul className="space-y-2.5 text-[15px]">
            <li><a href={homeHash("work")} aria-current={activeRoute === "/" && activeHash === "#work" ? "location" : undefined} className="transition hover:text-[#FF6A00] hover:underline">Work</a></li>
            <li><Link href="/about" aria-current={activeRoute === "/about" ? "page" : undefined} className="transition hover:text-[#FF6A00] hover:underline" data-testid="link-footer-about">About Us</Link></li>
            <li><Link href="/track" aria-current={activeRoute === "/track" ? "page" : undefined} className="transition hover:text-[#FF6A00] hover:underline">Track Order</Link></li>
            <li><a href={homeHash("faq")} aria-current={activeRoute === "/" && activeHash === "#faq" ? "location" : undefined} className="transition hover:text-[#FF6A00] hover:underline">FAQ</a></li>
            <li><Link href="/admin" aria-current={activeRoute === "/admin" ? "page" : undefined} className="transition hover:text-[#FF6A00] hover:underline">Admin</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-[14px] font-semibold text-black">Contact + Hours</h4>
          <ul className="space-y-2.5 text-[15px]">
            <li><button onClick={() => openWhatsApp()} className="inline-flex items-center gap-2 transition hover:bg-[#333333]" data-testid="button-footer-whatsapp">WhatsApp</button></li>
            <li><a href={`tel:${CONTACT.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-2 transition hover:text-[#FF6A00] hover:underline" data-testid="link-footer-phone">{CONTACT.phone}</a></li>
            <li><a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 break-all transition hover:text-[#FF6A00] hover:underline" data-testid="link-footer-email">{CONTACT.email}</a></li>
            <li className="pt-4 text-[#4A4A4A]">Mon–Sat · 8AM–7PM EAT</li>
            <li className="text-[#4A4A4A]">Based in Kampala, Serving East Africa</li>
          </ul>
        </div>
      </div>
      <div className={`${wrap} mt-14 flex flex-col justify-between gap-2 border-t border-[#E5E5E5] pt-6 text-[13px] sm:flex-row`}>
        <p>© {new Date().getFullYear()} Diglo Ventures</p>
        <p>Diglo Ventures Ltd - Kampala, Uganda - Serving East Africa</p>
      </div>
    </footer>
  );
}

/** Shell for non-home public pages. */
export function PageShell({ children, active = "" }: { children: ReactNode; active?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="diglo-white-theme min-h-[100dvh] bg-white pb-[144px] text-[#4A4A4A] md:pb-0">
      <Nav active={active} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>{children}</main>
      <Footer />
      <MobileBar active={active} />
      <MobileCtaBar />
    </div>
  );
}

export function MobileCtaBar() {
  const { openWhatsApp } = useSite();
  return (
    <div className="fixed inset-x-0 bottom-16 z-40 h-16 w-full max-w-[100vw] border-t border-[#E5E5E5] bg-white px-3 py-2 md:hidden">
      <div className="grid h-full min-w-0 grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-2">
        <Link href="/quote" className={`${btnOrange} !h-12 w-full !px-2 text-[13px]`} data-testid="link-mobile-sticky-quote">Get Quote</Link>
        <button onClick={() => openWhatsApp()} className={`${btnDark} !h-12 w-full !px-2 text-[12px] sm:text-[14px]`} data-testid="button-mobile-sticky-whatsapp">WhatsApp</button>
      </div>
    </div>
  );
}

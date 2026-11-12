import { useState } from "react";
import { ChevronDown, ArrowRight, Package, Printer, ShieldCheck, Shirt } from "lucide-react";
import { useSite } from "@/components/site-providers";
import { CONTACT } from "@/lib/site";
import { BASE, btnOrange } from "@/components/tokens";

const PRODUCT_GROUPS = [
  {
    title: "GIFT PACKS",
    service: "Gift Packs",
    Icon: Package,
    items: ["Corporate Gift Boxes", "Branded Mugs", "Notebooks & Pens", "Tote Bags", "Bottles & Tumblers", "Awards & Hampers"],
  },
  {
    title: "CORPORATE UNIFORMS",
    service: "Uniforms",
    Icon: Shirt,
    items: ["Polo Shirts", "Corporate Shirts", "Chef Jackets", "Aprons", "Scrubs", "Hi-Vis & Workwear", "School Uniforms"],
  },
  {
    title: "PPE & SAFETY",
    service: "PPE",
    Icon: ShieldCheck,
    items: ["Safety Helmets", "Reflector Vests", "Safety Boots", "Gloves", "Dust Masks", "First Aid Kits"],
  },
  {
    title: "PRINTING",
    service: "Printing",
    Icon: Printer,
    items: ["Business Cards", "Flyers & Brochures", "Banners & Stickers", "Calendars", "T-Shirt Printing", "ID Cards & Lanyards"],
  },
] as const;

function serviceHash(service: string, product: string) {
  const id = service === "Uniforms" ? "service-corporate-uniforms" : service === "Printing" ? "service-printing-services" : `service-${service.toLowerCase().replaceAll(" ", "-")}`;
  return `${BASE}?service=${encodeURIComponent(service)}&product=${encodeURIComponent(product)}#${id}`;
}

function ProductGroups({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  return (
    <div className={compact ? "space-y-1" : "grid grid-cols-4 gap-5"}>
      {PRODUCT_GROUPS.map(({ title, service, Icon, items }) => (
        <section key={title} className={compact ? "border-t border-[#3A3A3C] py-2 first:border-0" : ""}>
          <h3 className={`flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] text-[#A1A1A6] ${compact ? "py-2" : "mb-3"}`}>
            <Icon className="h-4 w-4" aria-hidden="true" />{title}
          </h3>
          <ul className={compact ? "space-y-0.5" : "space-y-1"}>
            {items.map((item) => (
              <li key={item}>
                <a
                  href={serviceHash(service, item)}
                  onClick={onNavigate}
                  className="group/item flex min-h-9 items-center justify-between gap-2 rounded-md px-2 text-[14px] text-white transition-colors hover:bg-[#3A3A3C]"
                  data-testid={`link-product-${item.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`}
                >
                  <span className="flex min-w-0 items-center gap-2"><Icon className="h-4 w-4 shrink-0 text-[#A1A1A6]" aria-hidden="true" /><span>{item}</span></span>
                  <span className="inline-flex shrink-0 items-center gap-1 text-[11px] text-transparent transition-colors group-hover/item:text-[#FF6B00] group-focus-visible/item:text-[#FF6B00]">
                    View <ArrowRight className="h-3 w-3" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function DesktopProductsMenu({ active, linkClassName }: { active: boolean; linkClassName: string }) {
  const { openWhatsApp } = useSite();
  return (
    <div className="group relative">
      <button type="button" aria-haspopup="true" className={`${linkClassName} inline-flex items-center gap-1`} data-testid="button-products-desktop">
        Products <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
      </button>
      <div style={{ width: "min(920px, calc(100vw - 32px))" }} className="desktop-products-panel invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-2 rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5 opacity-0 shadow-[0_12px_32px_rgba(0,0,0,.35)] transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <ProductGroups />
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#3A3A3C] pt-4">
          <p className="text-[13px] text-[#A1A1A6]">Not sure what you need? <span className="text-white">We reply in 5 mins.</span></p>
          <button
            onClick={() => openWhatsApp(`Hello Diglo Ventures, I would like a quote. Please contact me on ${CONTACT.phone}.`)}
            className={`${btnOrange} !h-9 !px-4 !text-[13px]`}
            data-testid="button-products-quote"
          >
            Get a Free Quote on WhatsApp
          </button>
        </div>
      </div>
      {active && <span className="sr-only">Products menu selected</span>}
    </div>
  );
}

export function MobileProductsAccordion({ onNavigate }: { onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-y border-[#3A3A3C]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3 text-left text-base font-medium text-white"
        data-testid="button-products-mobile"
      >
        Products <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="pb-3"><ProductGroups compact onNavigate={onNavigate} /></div>}
    </div>
  );
}

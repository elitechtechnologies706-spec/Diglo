import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown } from "lucide-react";
import { PRODUCT_GROUPS, productDetails, productQuotePath } from "@/lib/products";

function slug(value: string) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/-$/, "");
}

function ProductLinks({ group, onNavigate }: { group: (typeof PRODUCT_GROUPS)[number]; onNavigate?: () => void }) {
  const [location] = useLocation();
  const search = location.includes("?") ? location.slice(location.indexOf("?")) : window.location.search;
  const selectedProduct = new URLSearchParams(search).get("product");
  return (
    <ul className="space-y-0.5 py-2">
      {group.items.map((item) => (
        <li key={item}>
          <Link
            href={productQuotePath(item)}
            onClick={onNavigate}
            aria-current={selectedProduct === item ? "page" : undefined}
            className={`flex min-h-10 items-center rounded-md px-3 text-[14px] text-black transition-colors hover:bg-[#F7F7F7] ${selectedProduct === item ? "text-[#FF6A00] underline underline-offset-4" : ""}`}
            data-testid={`link-product-${slug(item)}`}
          >
            {item}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function DesktopGroup({ group, currentCategory }: { group: (typeof PRODUCT_GROUPS)[number]; currentCategory: string }) {
  const [open, setOpen] = useState(false);
  const active = currentCategory === group.title;
  return (
    <div
      className="group relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-current={active ? "page" : undefined}
        onFocus={() => setOpen(true)}
        className={`nav-link inline-flex min-h-10 items-center gap-1 whitespace-nowrap px-1 text-[12px] font-medium text-black transition-colors hover:text-[#FF6A00] hover:underline hover:underline-offset-4 lg:text-[13px] xl:text-[14px] ${open || active ? "text-[#FF6A00] underline underline-offset-4" : ""}`}
        data-testid={`button-menu-${slug(group.title)}`}
      >
        {group.title}<ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`absolute left-0 top-full z-50 mt-1 w-[280px] rounded-xl border border-[#E5E5E5] bg-white p-2 shadow-[0_4px_20px_rgba(0,0,0,.06)] transition-opacity ${open ? "visible opacity-100" : "invisible opacity-0"}`}
        data-testid={`menu-${slug(group.title)}`}
      >
        <ProductLinks group={group} />
      </div>
    </div>
  );
}

export function DesktopProductsMenus({ currentCategory = "" }: { currentCategory?: string }) {
  return (
    <div className="flex min-w-0 items-center gap-1 xl:gap-2">
      {PRODUCT_GROUPS.map((group) => <DesktopGroup key={group.title} group={group} currentCategory={currentCategory} />)}
    </div>
  );
}

export function MobileProductsAccordion({ onNavigate }: { onNavigate: () => void }) {
  const [location] = useLocation();
  const selectedProduct = new URLSearchParams(window.location.search).get("product") ?? "";
  const currentCategory = productDetails(selectedProduct).category;
  const [openGroup, setOpenGroup] = useState<string | null>(currentCategory || null);
  useEffect(() => { setOpenGroup(currentCategory || null); }, [location, currentCategory]);
  return (
    <div className="space-y-1 border-y border-[#E5E5E5] py-2">
      {PRODUCT_GROUPS.map((group) => {
        const open = openGroup === group.title;
        return (
          <section key={group.title}>
            <button
              type="button"
              onClick={() => setOpenGroup(open ? null : group.title)}
              aria-expanded={open}
              aria-current={currentCategory === group.title ? "page" : undefined}
              className={`nav-link flex min-h-12 w-full items-center justify-between px-2 text-left text-[15px] font-semibold text-black ${open || currentCategory === group.title ? "text-[#FF6A00] underline underline-offset-4" : ""}`}
              data-testid={`button-mobile-${slug(group.title)}`}
            >
              {group.title}<ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && <ProductLinks group={group} onNavigate={onNavigate} />}
          </section>
        );
      })}
    </div>
  );
}

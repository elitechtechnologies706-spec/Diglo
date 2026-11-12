import { useMemo } from "react";
import { useLocation } from "wouter";
import { PageShell } from "@/components/site-shell";
import { QuoteForm } from "@/components/quote-form";
import { wrap } from "@/components/tokens";
import { productDetails } from "@/lib/products";
import { useSeo } from "@/lib/seo";

export default function QuotePage() {
  const [location] = useLocation();
  const selection = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const product = params.get("product") ?? "";
    const inferred = productDetails(product);
    return {
      product,
      category: params.get("category") || inferred.category,
      service: params.get("service") || inferred.service,
    };
  }, [location]);

  useSeo({
    title: selection.product ? `Custom Quote for ${selection.product} | Diglo Ventures` : "Get a Custom Quote | Diglo Ventures",
    description: "Request a customized Diglo Ventures quote for products, branding and delivery.",
    path: "/quote",
    noindex: true,
  });

  return (
    <PageShell active="quote">
      <section className="py-10 md:py-16">
        <div className={`${wrap} max-w-[820px]`}>
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#333333]">Customized Quote</p>
          <h1 className="text-[28px] font-bold leading-[1.2] text-black md:text-[40px]">Tell us what you need.</h1>
          <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-[#4A4A4A]">
            Share the product and details. We’ll follow up with a customized quote on WhatsApp.
          </p>
          <div className="mt-7 rounded-xl border border-[#E5E5E5] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,.06)] sm:p-6">
            <QuoteForm
              key={`${selection.product}:${selection.category}:${selection.service}`}
              initialProduct={selection.product}
              initialCategory={selection.category}
              initialService={selection.service}
            />
          </div>
        </div>
      </section>
    </PageShell>
  );
}

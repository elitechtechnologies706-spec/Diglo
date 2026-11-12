import { useState } from "react";
import { ArrowRight, MessageCircle, Plus } from "lucide-react";
import { Link } from "wouter";
import seo from "@/lib/seo-data.json";
import { useSeo } from "@/lib/seo";
import { PageShell } from "@/components/site-shell";
import { useSite } from "@/components/site-providers";
import { btnDark, btnOrange, wrap } from "@/components/tokens";
import NotFound from "@/pages/not-found";
import { quotePath } from "@/lib/products";

export default function SeoPage({ slug }: { slug: string }) {
  const page = seo.pages.find((p) => p.slug === slug);
  useSeo({ title: page?.title ?? seo.homeTitle, description: page?.description, path: `/${slug}` });
  const { openWhatsApp } = useSite();
  const [open, setOpen] = useState<number | null>(0);
  if (!page) return <NotFound />;
  return (
    <PageShell>
      <section className="bg-[#1D1D1F] py-10 text-[#F5F5F7] md:py-16">
        <div className={`${wrap} grid items-center gap-6 lg:grid-cols-[1.1fr_.9fr]`}>
          <div>
            <p className="rise mb-3 text-[13px] font-semibold uppercase tracking-[0.14em]">{page.eyebrow}</p>
            <h1 className="rise text-[28px] font-bold leading-[1.3] md:text-[40px]" style={{ animationDelay: ".06s" }}>{page.h1}</h1>
            <h2 className="rise mt-5 text-[18px] font-semibold" style={{ animationDelay: ".12s" }}>{page.question}</h2>
            <p className="rise mt-2 max-w-[60ch] text-[15px] leading-relaxed text-[#D4D4D4]" style={{ animationDelay: ".16s" }} data-testid="text-seo-answer">{page.answer}</p>
            <div className="rise mt-5 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: ".22s" }}>
              <Link href={quotePath(page.productName, page.category, page.service)} className={btnOrange} data-testid="button-seo-quote">Get Custom Quote <ArrowRight className="h-4 w-4" /></Link>
              <button onClick={() => openWhatsApp(`Hello Diglo Ventures, I would like a quote for ${page.productName}.`)} className={btnDark} data-testid="button-seo-whatsapp"><MessageCircle className="h-4 w-4" /> Ask on WhatsApp</button>
            </div>
          </div>
          <div className="flex aspect-[4/3] min-h-[220px] items-center justify-center rounded-xl border border-[#E5E5E5] bg-white p-8 text-center text-[14px] font-medium text-[#4A4A4A]" data-testid="photo-seo-placeholder">
            IMAGE COMING SOON - Exact model from supplier
          </div>
        </div>
      </section>

      <section className="bg-[#1D1D1F] py-10 text-[#F5F5F7] md:py-16">
        <div className={`${wrap} grid gap-5 md:grid-cols-[.9fr_1.1fr]`}>
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-5" data-testid="card-seo-custom-quote">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em]">Customized Quote</p>
            <h3 className="mt-2 text-[22px] font-semibold text-black">{page.productName}</h3>
            <p className="mt-3 text-[15px] text-[#4A4A4A]">Customized Quote - Price Depends on Quantity &amp; Branding</p>
            <Link href={quotePath(page.productName, page.category, page.service)} className={`${btnOrange} mt-6 w-full`} data-testid="button-seo-order">Get Custom Quote</Link>
          </div>
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-5">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em]">FAQ</p>
            <div className="mt-2 divide-y divide-[#3A3A3C]">
              {page.faqs.map((f, i) => (
                <div key={f.q}>
                  <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left" data-testid={`button-seo-faq-${i}`}>
                    <span className="font-display text-[16px] font-semibold text-black" style={{ fontFamily: "Sora" }}>{f.q}</span>
                    <Plus className={`h-5 w-5 shrink-0 text-black transition-transform duration-300 ${open === i ? "rotate-45" : ""}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden"><p className="pb-4 text-[15px] leading-relaxed text-[#4A4A4A]">{f.a}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="dark-zone bg-[#1D1D1F] py-10 md:py-16">
        <div className={`${wrap} text-center`}>
          <h2 className="mx-auto max-w-[600px] text-[24px] font-bold leading-[1.3] md:text-[28px]">Ready to order?</h2>
          <button onClick={() => openWhatsApp()} className={`${btnOrange} mt-8`} data-testid="button-seo-cta"><MessageCircle className="h-4 w-4" /> Get a Free Quote on WhatsApp</button>
        </div>
      </section>
    </PageShell>
  );
}

import { useState } from "react";
import { ArrowRight, MessageCircle, Plus } from "lucide-react";
import seo from "@/lib/seo-data.json";
import { formatUGX } from "@/lib/site";
import { useSeo } from "@/lib/seo";
import { PageShell } from "@/components/site-shell";
import { useSite } from "@/components/site-providers";
import { btnDark, btnOrange, img, wrap } from "@/components/tokens";
import NotFound from "@/pages/not-found";

export default function SeoPage({ slug }: { slug: string }) {
  const page = seo.pages.find((p) => p.slug === slug);
  useSeo({ title: page?.title ?? seo.homeTitle, description: page?.description, path: `/${slug}` });
  const { openQuote, openWhatsApp } = useSite();
  const [open, setOpen] = useState<number | null>(0);
  if (!page) return <NotFound />;
  return (
    <PageShell>
      <section className="bg-[#1D1D1F] py-12 text-[#F5F5F7] md:py-20">
        <div className={`${wrap} grid items-center gap-8 lg:grid-cols-[1.1fr_.9fr] lg:gap-10`}>
          <div>
            <p className="rise mb-3 text-[13px] font-semibold uppercase tracking-[0.14em]">{page.eyebrow}</p>
            <h1 className="rise text-[30px] font-extrabold leading-[1.05] md:text-[44px] lg:text-[56px]" style={{ letterSpacing: "-0.03em", animationDelay: ".06s" }}>{page.h1}</h1>
            <h2 className="rise mt-8 text-[19px] font-semibold" style={{ animationDelay: ".12s" }}>{page.question}</h2>
            <p className="rise mt-3 text-[16px] leading-relaxed text-[#F5F5F7] md:text-[17px]" style={{ animationDelay: ".16s" }} data-testid="text-seo-answer">{page.answer}</p>
            <div className="rise mt-6 flex flex-col gap-3 md:mt-8 md:flex-row" style={{ animationDelay: ".22s" }}>
              <button onClick={() => openQuote(page.service)} className={btnOrange} data-testid="button-seo-quote">Get a Free Quote <ArrowRight className="h-4 w-4" /></button>
              <button onClick={() => openWhatsApp(`Hello Diglo Ventures, I would like a quote for ${page.productName}.`)} className={btnDark} data-testid="button-seo-whatsapp"><MessageCircle className="h-4 w-4" /> Ask on WhatsApp</button>
            </div>
          </div>
          <div className="rise overflow-hidden rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F]" style={{ animationDelay: ".18s" }}>
            <img src={img(page.image)} alt={`Concept mockup: ${page.eyebrow}`} className="aspect-[4/3] w-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="bg-[#1D1D1F] py-12 text-[#F5F5F7] md:py-20">
        <div className={`${wrap} grid gap-5 md:grid-cols-[.9fr_1.1fr]`}>
          <div className="rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F] p-6 md:p-7" data-testid="card-seo-price">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em]">Price</p>
            <h3 className="mt-2 text-[22px] font-semibold">{page.productName}</h3>
            <p className="text-[15px] text-[#F5F5F7]">{page.priceNote}</p>
            <p className="font-display mt-5 text-[34px] font-bold text-[#FF6B00]" style={{ fontFamily: "Sora" }}>From {formatUGX(page.price)}</p>
            <p className="mt-3 text-[14px] text-[#A1A1A6]">All prices include design proof. Payment by Mobile Money or Bank Transfer.</p>
            <button onClick={() => openQuote(page.service)} className={`${btnOrange} mt-6 w-full`} data-testid="button-seo-order">Order This</button>
          </div>
          <div className="rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F] p-6 md:p-7">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em]">FAQ</p>
            <div className="mt-2 divide-y divide-[#3A3A3C]">
              {page.faqs.map((f, i) => (
                <div key={f.q}>
                  <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left" data-testid={`button-seo-faq-${i}`}>
                    <span className="font-display text-[16px] font-semibold text-white" style={{ fontFamily: "Sora" }}>{f.q}</span>
                    <Plus className={`h-5 w-5 shrink-0 text-[#F5F5F7] transition-transform duration-300 ${open === i ? "rotate-45" : ""}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden"><p className="pb-4 text-[15px] leading-relaxed text-[#F5F5F7]">{f.a}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="dark-zone bg-[#1D1D1F] py-16 md:py-20">
        <div className={`${wrap} text-center`}>
          <h2 className="mx-auto max-w-[680px] text-[32px] font-extrabold leading-[1.08] sm:text-[44px]">Ready To Look Like A Big Brand?</h2>
          <p className="mx-auto mt-4 max-w-[480px] text-[16px] text-[#A1A1A6]">Designed Today. Printed Tomorrow. Delivered To You.</p>
          <button onClick={() => openWhatsApp()} className={`${btnOrange} mt-8`} data-testid="button-seo-cta"><MessageCircle className="h-4 w-4" /> Get a Free Quote on WhatsApp</button>
        </div>
      </section>
    </PageShell>
  );
}

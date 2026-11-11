import { Check, Clock3, Gift, Heart, Printer, Shield, ShieldCheck, BadgeCheck } from "lucide-react";
import { btnOrange, wrap } from "@/components/tokens";
import { useSite } from "@/components/site-providers";
import { CardCurrencyPicker, CurrencyAmount } from "@/components/currency-controls";

const SERVICES = [
  {
    title: "Commercial Printing Services",
    description: "High-resolution digital and offset printing for corporate stationery, marketing collateral, banners, and bespoke business publications.",
    icon: Printer,
    price: 80000,
    service: "Printing Services",
  },
  {
    title: "Branded Promotional Merchandise",
    description: "Premium corporate gifts, apparel, and promotional items tailored to amplify brand visibility and client loyalty.",
    icon: Gift,
    price: 45000,
    service: "Gift Packs",
  },
  {
    title: "Personal Protective Equipment (PPE)",
    description: "Certified, high-durability safety gear—including high-visibility uniforms, safety boots, helmets, and specialized protective wear engineered for the construction and security sectors.",
    icon: Shield,
    price: 65000,
    service: "PPE",
  },
];

const VALUES = [
  {
    title: "Uncompromised Quality",
    description: "We hold our printing, merchandise, and safety gear to the highest international and local standards, ensuring every product is flawless and durable.",
    icon: ShieldCheck,
  },
  {
    title: "Absolute Reliability",
    description: "We respect your timelines. Diglo Ventures is committed to dependable delivery schedules and seamless bulk logistics to keep your operations running smoothly.",
    icon: Clock3,
  },
  {
    title: "Integrity & Safety First",
    description: "We treat workplace protection with the utmost seriousness, supplying certified, authentic PPE that safeguards the human capital driving Uganda's development.",
    icon: BadgeCheck,
  },
  {
    title: "Client-Centric Innovation",
    description: "We adapt to the unique procurement needs of corporate offices, construction sites, and security details alike, providing tailored solutions under one roof.",
    icon: Heart,
  },
];

const PARTNER_REASONS = [
  {
    title: "The Power of One Vendor",
    description: "We eliminate the logistical headache of dealing with multiple suppliers. Procurement teams can manage both their marketing assets and safety gear requirements through a single, reliable point of contact.",
  },
  {
    title: "Corporate-Grade Reliability",
    description: "We understand that timelines dictate profitability. Diglo Ventures is built on strict quality control and dependable delivery schedules to keep your business moving forward without delay.",
  },
  {
    title: "Tailored Sector Expertise",
    description: "Whether designing a premium executive gift for a corporate boardroom or sourcing rugged, compliant gear for a construction site or security detail, we deliver solutions that match the precise standards of your industry.",
  },
];

function Heading({ eyebrow, title, id }: { eyebrow: string; title: string; id?: string }) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#A1A1A6]">{eyebrow}</p>
      <h2 id={id} className="text-[24px] font-bold leading-[1.3] text-white md:text-[28px]">{title}</h2>
    </div>
  );
}

export function CompanyProfileSections() {
  const { openQuote } = useSite();
  return (
    <div className="bg-[#1D1D1F] text-[#F5F5F7]">
      <section id="about" className="scroll-mt-24 py-10 md:py-16">
        <div className={wrap}>
          <Heading eyebrow="About Us" title="Branding Your Identity. Securing Your Progress." id="about-heading" />
          <div className="grid gap-4 lg:grid-cols-2">
            <p className="rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5 text-[15px] leading-relaxed text-[#D4D4D4]">
              Based in Kampala, Diglo Ventures is Uganda&apos;s premier one-stop corporate supply partner, dedicated to &apos;Branding Your Identity. Securing Your Progress.&apos; We bridge the gap between corporate market presence and industrial operational safety by providing a seamless, dual-focused service model.
            </p>
            <div className="rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5">
              <p className="text-[15px] leading-relaxed text-[#D4D4D4]">
                We cater to corporate organizations, security firms, construction companies, and thriving local businesses across Uganda. By combining cutting-edge technology with high-grade materials, we ensure our clients stand out in the marketplace while keeping their workforces protected on the ground.
              </p>
              <p className="mt-3 text-[14px] font-semibold text-white">Now serving all of East Africa.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              ["MISSION", "Coming Soon", "Our Mission Statement will be updated tomorrow"],
              ["VISION", "Coming Soon", "Our Vision Statement will be updated tomorrow"],
            ].map(([title, label, text]) => (
              <article key={title} className="rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5" data-testid={`card-${title.toLowerCase()}-placeholder`}>
                <h3 className="text-[14px] font-semibold tracking-[0.08em]">{title}</h3>
                <p className="mt-2 text-[16px] font-semibold text-white">{label}</p>
                <p className="mt-1 text-[14px] text-[#A1A1A6]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="company-services" className="bg-[#242426] py-10 md:py-16">
        <div className={wrap}>
          <Heading eyebrow="Our Services" title="One partner for print, promotion and protection." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ title, description, icon: Icon, price, service }) => (
              <article key={title} className="flex flex-col rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5" data-testid={`card-company-service-${service.toLowerCase().replaceAll(" ", "-")}`}>
                <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                <h3 className="mt-4 text-[18px] font-semibold leading-snug text-white">{title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[#D4D4D4]">{description}</p>
                <p className="mt-4 text-[18px] font-bold text-[#FF6B00]" data-testid={`text-company-price-${service.toLowerCase().replaceAll(" ", "-")}`}>From <CurrencyAmount amount={price} /></p>
                <CardCurrencyPicker />
                <p className="mt-2 text-[11px] text-[#A1A1A6]">Prices in your currency. Final quote confirmed on WhatsApp.</p>
                <button onClick={() => openQuote(service)} className={`${btnOrange} mt-4 w-full`} data-testid={`button-company-service-${service.toLowerCase().replaceAll(" ", "-")}`}>Get Quote</button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className={wrap}>
          <Heading eyebrow="Core Values" title="What we stand for." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ title, description, icon: Icon }) => (
              <article key={title} className="rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5" data-testid={`card-value-${title.toLowerCase().replaceAll(" ", "-")}`}>
                <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                <h3 className="mt-3 text-[18px] font-semibold text-white">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#D4D4D4]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#242426] py-10 md:py-16">
        <div className={wrap}>
          <Heading eyebrow="Why Partner With Us?" title="One dependable point of contact." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PARTNER_REASONS.map(({ title, description }) => (
              <article key={title} className="rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5" data-testid={`card-partner-${title.toLowerCase().replaceAll(" ", "-")}`}>
                <Check className="h-5 w-5 text-white" aria-hidden="true" />
                <h3 className="mt-3 text-[18px] font-semibold text-white">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#D4D4D4]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

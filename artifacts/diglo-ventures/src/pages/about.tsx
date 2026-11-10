import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/site-shell";
import { btnDark, btnOrange, homeHash, wrap } from "@/components/tokens";
import { useSite } from "@/components/site-providers";
import { useSeo } from "@/lib/seo";

const VALUES = [
  {
    title: "OUR MISSION",
    text: "To make every team in Uganda look professional, feel proud, and be remembered - with affordable branding, uniforms and printing, delivered fast.",
  },
  {
    title: "OUR VISION",
    text: "To be Uganda's most trusted branding partner - the first name businesses call when they want gift packs, uniforms, PPE and printing done right.",
  },
];

export default function About() {
  const { openQuote } = useSite();
  useSeo({
    title: "About Diglo Ventures | Kampala Branding and Printing",
    description: "Meet Diglo Ventures, a Kampala branding partner for gift packs, uniforms, PPE and printing.",
    path: "/about",
  });

  return (
    <PageShell active="about">
      <section className="bg-[#1D1D1F] py-10 md:py-16">
        <div className={wrap}>
          <div className="max-w-[720px]">
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#A1A1A6]">About Us</p>
            <h1 className="text-[28px] font-bold leading-[1.3] text-white">About Diglo Ventures</h1>
            <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-[#D4D4D4]">We help teams in Kampala look professional. Designed today. Delivered tomorrow.</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {VALUES.map(({ title, text }) => (
              <article key={title} className="rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5 md:p-6">
                <h2 className="text-[14px] font-semibold tracking-[0.08em] text-white">{title}</h2>
                <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-[#D4D4D4]">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {["500+ Teams Served", "24 Hour Express", "Kampala Based"].map((item) => (
              <div key={item} className="rounded-lg border border-[#3A3A3C] px-4 py-4 text-center text-[14px] font-medium text-white">{item}</div>
            ))}
          </div>

          <section className="mt-10 md:mt-14" aria-labelledby="team-heading">
            <h2 id="team-heading" className="text-[24px] font-bold leading-[1.3] text-white md:text-[28px]">Meet the Team</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <TeamCard initials="UF" label="Founder - Uncle Fred" />
              <TeamCard initials="PT" label="Our Production Team" />
              <TeamCard initials="PT" label="Our Production Team" />
            </div>
          </section>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => openQuote()} className={`${btnOrange} w-full sm:w-auto sm:max-w-[220px]`} data-testid="button-about-quote">Get a Quote</button>
            <Link href={homeHash("work")} className={`${btnDark} w-full sm:w-auto sm:max-w-[220px]`} data-testid="link-about-work">View Our Work <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function TeamCard({ initials, label }: { initials: string; label: string }) {
  return (
    <article className="flex min-h-28 items-center gap-4 rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#3A3A3C] bg-[#1D1D1F] text-[14px] font-semibold text-white">{initials}</span>
      <p className="text-[14px] font-medium text-white">{label}</p>
    </article>
  );
}

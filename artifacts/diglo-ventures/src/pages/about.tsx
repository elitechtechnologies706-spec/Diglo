import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/site-shell";
import { CompanyProfileSections } from "@/components/company-profile-sections";
import { btnDark, btnOrange, homeHash, wrap } from "@/components/tokens";
import { useSite } from "@/components/site-providers";
import { useSeo } from "@/lib/seo";
import { DIGLO_IMAGES } from "@/lib/images";

export default function About() {
  const { openQuote } = useSite();
  useSeo({
    title: "About Diglo Ventures | Serving East Africa",
    description: "Meet Diglo Ventures, a corporate supply partner based in Kampala and serving East Africa.",
    path: "/about",
  });

  return (
    <PageShell active="about">
      <CompanyProfileSections />
      <section className="bg-[#1D1D1F] py-10 md:py-16">
        <div className={wrap}>
          <div className="grid gap-4 sm:grid-cols-3">
            {["500+ Teams Served", "24 Hour Express", "Based in Kampala, Serving East Africa"].map((item) => (
              <div key={item} className="rounded-lg border border-[#3A3A3C] px-4 py-4 text-center text-[14px] font-medium text-white">{item}</div>
            ))}
          </div>

          <section className="mt-10 md:mt-14" aria-labelledby="team-heading">
            <h2 id="team-heading" className="text-[24px] font-bold leading-[1.3] text-white md:text-[28px]">Meet the Team</h2>
            <figure className="mt-5 overflow-hidden rounded-xl border border-[#3A3A3C] bg-[#2D2D2F]">
              <img
                src={DIGLO_IMAGES.officeTeam}
                alt="Illustrative stock photo of colleagues collaborating around a table"
                className="h-52 w-full object-cover sm:h-64"
              />
              <figcaption className="px-4 py-3 text-[12px] text-[#A1A1A6]">
                Illustrative Unsplash stock photo; not a photo of Diglo Ventures staff.
              </figcaption>
            </figure>
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

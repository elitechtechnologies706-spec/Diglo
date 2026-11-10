import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CircleHelp,
  Shirt,
  Sparkles,
} from "lucide-react";
import { useSite } from "@/components/site-providers";
import { formatUGX } from "@/lib/site";
import { ProductPhoto } from "@/components/product-photo";

type Industry = {
  name: string;
  code: string;
  summary: string;
  items: [string, string, string];
  mark: string;
  photo: string;
};

const INDUSTRIES: Industry[] = [
  {
    name: "Hotels & Restaurants",
    code: "HOSPITALITY",
    summary: "A considered look from front of house to the kitchen.",
    items: ["Chef Jacket", "Apron", "Waiter Shirt"],
    mark: "01",
    photo: "/images/industries/hospitality.jpg",
  },
  {
    name: "Hospitals & Clinics",
    code: "HEALTHCARE",
    summary: "Practical, clean uniforms for patient-facing teams.",
    items: ["Nurse Scrubs", "Lab Coat", "Reception Tunic"],
    mark: "02",
    photo: "/images/industries/healthcare.jpg",
  },
  {
    name: "Schools",
    code: "EDUCATION",
    summary: "Cohesive staff wear built for busy school days.",
    items: ["School Polo", "Teacher Shirt", "Cardigan"],
    mark: "03",
    photo: "/images/industries/education.jpg",
  },
  {
    name: "Offices & Banks",
    code: "CORPORATE",
    summary: "Sharp everyday pieces for teams that meet the public.",
    items: ["Corporate Shirt", "Branded Polo", "Blazer"],
    mark: "04",
    photo: "/images/industries/corporate.jpg",
  },
  {
    name: "Security & Cleaning",
    code: "OPERATIONS",
    summary: "Durable, easy-to-identify gear for hands-on work.",
    items: ["Reflective Vest", "Work Shirt", "Safety Trousers"],
    mark: "05",
    photo: "/images/industries/operations.jpg",
  },
  {
    name: "Churches & Events",
    code: "COMMUNITY",
    summary: "A unified team presence for gatherings and occasions.",
    items: ["Event Polo", "Choir Shirt", "Branded Scarf"],
    mark: "06",
    photo: "/images/industries/community.jpg",
  },
];

const ROLES = ["Chef", "Waiter", "Reception", "Housekeeper", "Nurse", "Security"] as const;
const COLORS = [
  { name: "Black", value: "#232326" },
  { name: "Navy", value: "#253954" },
  { name: "White", value: "#E7E5DF" },
  { name: "Maroon", value: "#702C3B" },
  { name: "Green", value: "#43644F" },
] as const;

const STEPS = ["Industry", "Role", "Colour", "Branding", "Quantity"];

function makeReference() {
  return `DG-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function UniformIndustry() {
  const { openWhatsApp } = useSite();
  const [industry, setIndustry] = useState<Industry>(INDUSTRIES[0]);
  const [role, setRole] = useState<(typeof ROLES)[number]>("Chef");
  const [color, setColor] = useState("Navy");
  const [customColor, setCustomColor] = useState("#527063");
  const [includeLogo, setIncludeLogo] = useState(true);
  const [includeStaffName, setIncludeStaffName] = useState(false);
  const [quantity, setQuantity] = useState(10);
  const [step, setStep] = useState(0);
  const selectedColor = color === "Your Brand Colour" ? customColor : COLORS.find((swatch) => swatch.name === color)?.value ?? "#253954";
  const estimate = useMemo(() => quantity * 45000, [quantity]);

  const chooseIndustry = (nextIndustry: Industry, moveToBuilder = false) => {
    setIndustry(nextIndustry);
    if (moveToBuilder) {
      setStep(0);
      document.getElementById("uniform-builder")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const sendQuote = () => {
    const reference = makeReference();
    const message = [
      `Hello Diglo Ventures, I would like a quote for Corporate Uniforms - ${reference}`,
      `Industry: ${industry.name}`,
      `Role: ${role}`,
      `Uniform colour: ${color}${color === "Your Brand Colour" ? ` (${customColor})` : ""}`,
      `Brand logo: ${includeLogo ? "Yes" : "No"}`,
      `Staff name: ${includeStaffName ? "Yes" : "No"}`,
      `Quantity: ${quantity} pieces`,
      `Starting estimate: ${formatUGX(estimate)}`,
      "",
      "Please confirm availability, sizing and a final quote.",
    ].join("\n");
    openWhatsApp(message);
  };

  return (
    <section aria-labelledby="uniform-industry-title" className="overflow-hidden bg-[#1D1D1F] py-10 text-[#F5F5F7] md:py-16">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
        <header className="mb-8 grid gap-4 md:mb-10 md:grid-cols-[1fr_0.55fr] md:items-end">
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#A1A1A6]">Workwear, made specific</p>
            <h2 id="uniform-industry-title" className="max-w-[700px] text-[24px] font-bold leading-[1.15] tracking-[-0.025em] text-white md:text-[28px]">
              Uniforms for Your Industry - Diglo Ventures Original
            </h2>
          </div>
          <p className="max-w-[390px] text-[15px] leading-relaxed text-[#D4D4D4] md:justify-self-end">
            Tell us your industry, we build the full outfit for your team.
          </p>
        </header>

        <div className="mb-12">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#A1A1A6]">01 / Find your fit</p>
              <h3 className="mt-1 text-[18px] font-semibold tracking-[-0.02em] text-white">Uniforms by industry</h3>
            </div>
            <p className="hidden text-[13px] text-[#A1A1A6] sm:block">Swipe to explore</p>
          </div>
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
            {INDUSTRIES.map((item) => {
              const isSelected = industry.name === item.name;
              return (
                <article
                  key={item.name}
                  className={`w-[min(84vw,330px)] shrink-0 snap-start overflow-hidden rounded-xl border bg-[#2D2D2F] transition-colors md:w-auto md:shrink ${isSelected ? "border-[#A1A1A6]" : "border-[#3A3A3C] hover:border-[#A1A1A6]"}`}
                >
                  <ProductPhoto
                    src={item.photo}
                    alt={`Diglo Ventures - ${item.name === "Hospitals & Clinics" ? "Healthcare" : item.name === "Offices & Banks" ? "Corporate" : item.name === "Security & Cleaning" ? "Operations" : item.name === "Churches & Events" ? "Community" : item.name === "Hotels & Restaurants" ? "Hospitality" : "Education"} Uniforms in Kampala - Branded`}
                    label={item.name}
                    className="h-[160px] border-b border-[#3A3A3C] md:h-[180px]"
                    imageClassName="object-[center_28%]"
                  />
                  <div className="flex min-h-[238px] flex-col p-5">
                    <h4 className="text-[18px] font-semibold leading-snug text-white">{item.name}</h4>
                    <p className="mt-1.5 min-h-[42px] text-[15px] leading-relaxed text-[#A1A1A6]">{item.summary}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${item.name} outfit items`}>
                      {item.items.map((piece) => (
                        <li key={piece} className="rounded-full border border-[#3A3A3C] px-2.5 py-1 text-[11px] text-[#D4D4D6]">{piece}</li>
                      ))}
                    </ul>
                    <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#3A3A3C] pt-4">
                      <p className="leading-tight">
                        <span className="block text-[10px] uppercase tracking-[0.12em] text-[#A1A1A6]">From / piece</span>
                        <span className="mt-1 block text-[16px] font-bold text-[#FF6B00]">{formatUGX(45000)}</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => chooseIndustry(item, true)}
                        className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#FF6B00] px-3.5 text-[12px] font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2D2D2F]"
                        aria-label={`Build this outfit for ${item.name}`}
                      >
                        Build This Outfit <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="mt-3 text-[12px] text-[#A1A1A6] md:hidden">Swipe sideways to view all six industries.</p>
        </div>

        <div id="uniform-builder" className="scroll-mt-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#A1A1A6]">02 / Make it yours</p>
              <h3 className="mt-1 text-[18px] font-semibold tracking-[-0.02em] text-white">Build your outfit</h3>
            </div>
            <p className="max-w-[430px] rounded-lg border border-[#3A3A3C] px-3 py-2 text-[13px] leading-relaxed text-[#D4D4D4]">
              <span className="mb-1 flex items-center gap-2 font-semibold text-white"><CircleHelp className="h-4 w-4" aria-hidden="true" /> Free Size Sample Kit</span>
              We bring sizes to your office in Kampala. Try before you order. Free size swap if wrong.
            </p>
          </div>

          <div className="grid overflow-hidden rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] md:grid-cols-[0.8fr_1.2fr]">
            <aside className="relative flex min-h-[210px] flex-col justify-between overflow-hidden border-b border-[#3A3A3C] bg-[#2D2D2F] p-5 md:min-h-[490px] md:border-b-0 md:border-r md:p-7">
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#A1A1A6]">Your selection</p>
                <h4 className="mt-3 max-w-[300px] text-[20px] font-bold leading-tight tracking-[-0.02em] text-white">{industry.name}</h4>
                <p className="mt-2 max-w-[300px] text-[15px] leading-relaxed text-[#A1A1A6]">{industry.summary}</p>
              </div>
              <div className="relative mt-6 flex items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-[#3A3A3C] bg-[#2D2D2F]" aria-hidden="true">
                    <Shirt className="h-5 w-5 text-[#D4D4D6]" />
                  </span>
                  <div>
                    <p className="text-[12px] text-[#A1A1A6]">Colour preview</p>
                    <p className="mt-0.5 text-[13px] font-semibold text-white">{color}</p>
                  </div>
                </div>
                <span className="h-9 w-9 rounded-full border border-white/30" style={{ backgroundColor: selectedColor }} aria-label={`${color} colour preview`} />
              </div>
              <p className="relative mt-5 border-t border-[#3A3A3C] pt-4 pr-14 text-[12px] leading-relaxed text-[#A1A1A6] sm:pr-0">
                From <span className="font-semibold text-[#FF6B00]">{formatUGX(45000)}</span> per piece · final pricing depends on fabric and branding.
              </p>
            </aside>

            <div className="flex min-w-0 flex-col p-4 sm:p-6 md:p-7">
              <div className="mb-6" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#A1A1A6]">Step {String(step + 1).padStart(2, "0")} <span className="text-[#A1A1A6]">/ {String(STEPS.length).padStart(2, "0")}</span></p>
                  <p className="text-[13px] font-semibold text-white">{STEPS[step]}</p>
                </div>
                <div className="grid grid-cols-5 gap-1.5" aria-hidden="true">
                  {STEPS.map((label, index) => (
                      <span key={label} className={`h-1 rounded-full ${index <= step ? "bg-[#A1A1A6]" : "bg-[#3A3A3C]"}`} />
                  ))}
                </div>
              </div>

              <div className="min-h-[245px] flex-1">
                {step === 0 && (
                  <fieldset>
                    <legend className="mb-1 text-[18px] font-semibold text-white">What kind of team?</legend>
                    <p className="mb-4 text-[15px] text-[#A1A1A6]">Choose the industry the outfit is for.</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {INDUSTRIES.map((item) => (
                        <button key={item.name} type="button" onClick={() => chooseIndustry(item)} aria-pressed={industry.name === item.name} className={`flex min-h-12 items-center justify-between gap-2 rounded-lg border px-3 text-left text-[13px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${industry.name === item.name ? "border-[#A1A1A6] bg-[#2D2D2F] text-white" : "border-[#3A3A3C] bg-[#1D1D1F] text-[#D4D4D6] hover:border-[#A1A1A6]"}`}>
                          <span>{item.name}</span>{industry.name === item.name && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}

                {step === 1 && (
                  <fieldset>
                    <legend className="mb-1 text-[18px] font-semibold text-white">Choose a role</legend>
                    <p className="mb-4 text-[15px] text-[#A1A1A6]">We’ll tailor the quote to the work being done.</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {ROLES.map((option) => (
                        <button key={option} type="button" onClick={() => setRole(option)} aria-pressed={role === option} className={`min-h-12 rounded-lg border px-3 text-[13px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${role === option ? "border-[#A1A1A6] bg-[#2D2D2F] text-white" : "border-[#3A3A3C] bg-[#1D1D1F] text-[#D4D4D6] hover:border-[#A1A1A6]"}`}>{option}</button>
                      ))}
                    </div>
                  </fieldset>
                )}

                {step === 2 && (
                  <fieldset>
                    <legend className="mb-1 text-[18px] font-semibold text-white">Pick a uniform colour</legend>
                    <p className="mb-4 text-[15px] text-[#A1A1A6]">Choose a starting point. We’ll confirm available fabric shades.</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {COLORS.map((swatch) => (
                        <button key={swatch.name} type="button" onClick={() => setColor(swatch.name)} aria-pressed={color === swatch.name} className={`flex min-h-[52px] items-center gap-2.5 rounded-lg border px-3 text-left text-[13px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${color === swatch.name ? "border-[#A1A1A6] bg-[#2D2D2F]" : "border-[#3A3A3C] bg-[#1D1D1F] hover:border-[#A1A1A6]"}`}>
                          <span className="h-6 w-6 shrink-0 rounded-full border border-white/25" style={{ backgroundColor: swatch.value }} aria-hidden="true" />
                          <span className="text-[#F5F5F7]">{swatch.name}</span>
                          {color === swatch.name && <Check className="ml-auto h-4 w-4 text-white" aria-hidden="true" />}
                        </button>
                      ))}
                      <label className={`flex min-h-[52px] cursor-pointer items-center gap-2.5 rounded-lg border px-3 text-[13px] transition focus-within:ring-2 focus-within:ring-white ${color === "Your Brand Colour" ? "border-[#A1A1A6] bg-[#2D2D2F]" : "border-[#3A3A3C] bg-[#1D1D1F] hover:border-[#A1A1A6]"}`}>
                        <input className="h-6 w-6 cursor-pointer rounded-full border-0 bg-transparent p-0" type="color" value={customColor} onChange={(event) => { setCustomColor(event.target.value); setColor("Your Brand Colour"); }} aria-label="Choose your brand colour" />
                        <span className="text-[#F5F5F7]">Your Brand Colour</span>
                        {color === "Your Brand Colour" && <Check className="ml-auto h-4 w-4 text-white" aria-hidden="true" />}
                      </label>
                    </div>
                  </fieldset>
                )}

                {step === 3 && (
                  <fieldset>
                    <legend className="mb-1 text-[18px] font-semibold text-white">Add your team details</legend>
                    <p className="mb-4 text-[15px] text-[#A1A1A6]">Select the custom touches you’d like us to include.</p>
                    <div className="space-y-3">
                      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-4">
                        <input type="checkbox" checked={includeLogo} onChange={(event) => setIncludeLogo(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#A1A1A6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" />
                        <span><span className="block text-[14px] font-semibold text-white">Add company or organisation logo</span><span className="mt-1 block text-[12px] text-[#A1A1A6]">We’ll confirm embroidery or print placement with you.</span></span>
                      </label>
                      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-4">
                        <input type="checkbox" checked={includeStaffName} onChange={(event) => setIncludeStaffName(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#A1A1A6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" />
                        <span><span className="block text-[14px] font-semibold text-white">Add staff names</span><span className="mt-1 block text-[12px] text-[#A1A1A6]">Name personalisation can be confirmed with your final artwork.</span></span>
                      </label>
                    </div>
                  </fieldset>
                )}

                {step === 4 && (
                  <div>
                    <label htmlFor="uniform-quantity" className="mb-1 block text-[18px] font-semibold text-white">How many pieces?</label>
                    <p className="mb-5 text-[15px] text-[#A1A1A6]">Enter the number of uniforms you need.</p>
                    <div className="flex max-w-[360px] items-center gap-3">
                      <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-[#3A3A3C] bg-[#2D2D2F] text-[22px] text-white hover:border-[#A1A1A6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="Decrease quantity">−</button>
                      <input id="uniform-quantity" type="number" min={1} max={9999} value={quantity} onChange={(event) => setQuantity(Math.max(1, Math.min(9999, Number(event.target.value) || 1)))} className="h-12 min-w-0 flex-1 rounded-lg border border-[#3A3A3C] bg-[#2D2D2F] px-4 text-center text-[18px] font-semibold text-white outline-none focus:border-[#A1A1A6] focus-visible:ring-2 focus-visible:ring-white" />
                      <button type="button" onClick={() => setQuantity((current) => Math.min(9999, current + 1))} className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-[#3A3A3C] bg-[#2D2D2F] text-[22px] text-white hover:border-[#A1A1A6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="Increase quantity">+</button>
                    </div>
                    <div className="mt-5 rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-4">
                      <div className="flex items-center justify-between gap-3 text-[13px]">
                        <span className="text-[#A1A1A6]">Starting estimate</span>
                        <span className="font-semibold text-[#FF6B00]">{formatUGX(estimate)}</span>
                      </div>
                      <p className="mt-2 text-[11px] leading-relaxed text-[#A1A1A6]">Estimate uses the starting price of {formatUGX(45000)} UGX per piece. Final quote depends on style, fabric and branding.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-7 flex flex-col-reverse gap-2 border-t border-[#3A3A3C] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#3A3A3C] px-5 text-[13px] font-semibold text-[#D4D4D6] transition hover:border-[#77777A] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
                </button>
                {step < STEPS.length - 1 ? (
                  <button type="button" onClick={() => setStep((current) => Math.min(STEPS.length - 1, current + 1))} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#FF6B00] px-6 text-[14px] font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2D2D2F]">
                    Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button type="button" onClick={sendQuote} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#FF6B00] px-6 text-[14px] font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2D2D2F]">
                    <Sparkles className="h-4 w-4" aria-hidden="true" /> Get a WhatsApp Quote
                  </button>
                )}
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-[#A1A1A6]">Your reference is created when you request a quote. No order is placed until Diglo Ventures confirms the details.</p>
        </div>
      </div>
    </section>
  );
}

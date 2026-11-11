import { useState } from "react";
import { CheckCircle2, Copy, Send } from "lucide-react";
import { buildQuoteMessage, makeQuoteRef, whatsappUrl } from "@/lib/diglo";
import { COUNTRIES, CURRENCY_OPTIONS, SERVICE_NAMES, formatPrice } from "@/lib/site";
import { btnDark, btnOrange, inputCls, labelCls } from "@/components/tokens";
import { useSite } from "@/components/site-providers";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

type Result = { ref: string; name: string; service: string; quantity: number; details: string; whatsapp: string };

const SERVICE_STARTING_PRICE: Record<string, number> = {
  "Gift Packs": 45000,
  "Corporate Uniforms": 45000,
  PPE: 65000,
  "Printing Services": 800,
  "Not sure yet": 0,
};

export function QuoteForm({ initialService = "", compact = false }: { initialService?: string; compact?: boolean }) {
  const { currency, changeCurrency, country, chooseCountry } = useSite();
  const [f, setF] = useState({ name: "", phone: "", service: initialService, quantity: "", details: "" });
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const estimateUGXForDisplay = SERVICE_STARTING_PRICE[f.service] && Number(f.quantity) > 0
    ? SERVICE_STARTING_PRICE[f.service] * Number(f.quantity)
    : null;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const quantity = Number(f.quantity);
    const name = f.name.trim();
    const phone = f.phone.trim();
    const service = f.service.trim();
    const details = f.details.trim();
    const startingPrice = SERVICE_STARTING_PRICE[service] ?? 0;
    const estimateUGX = startingPrice * quantity;
    const total = startingPrice ? `${formatPrice(estimateUGX, currency)} (${formatPrice(estimateUGX, "USD")} USD)` : "To confirm";
    const phoneDigits = phone.replace(/\D/g, "");
    if (name.length < 2 || !service || phoneDigits.length < 8 || phoneDigits.length > 15) {
      setError("Please add your name, a valid phone number, and choose a service.");
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      setError("Please enter a quantity of at least 1.");
      return;
    }
    const ref = makeQuoteRef();
    const message = buildQuoteMessage({ ref, service, quantity, details, name, currency, country, total });
    const whatsapp = whatsappUrl(message);
    if (!whatsapp) {
      setError("WhatsApp is unavailable right now. Please try again.");
      return;
    }
    setResult({ ref, name, service, quantity, details, whatsapp });
    window.open(whatsapp, "_blank", "noopener,noreferrer");

    if (!supabase) {
      setSaveFailed(true);
      return;
    }
    try {
      const { error: saveError } = await supabase.from("quotes").insert([{
        code: ref,
        name,
        phone,
        country,
        currency,
        service,
        quantity,
        total_text: total,
        status: "New",
      }]);
      if (saveError) setSaveFailed(true);
      else toast({ title: "Quote saved ✅" });
    } catch {
      // Keep the WhatsApp quote flow available if Supabase is temporarily unreachable.
      setSaveFailed(true);
    }
  };

  const copyCode = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.ref);
      setCopied(true);
    } catch {
      const input = document.createElement("textarea");
      input.value = result.ref;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      const copiedSuccessfully = document.execCommand("copy");
      input.remove();
      setCopied(copiedSuccessfully);
    }
  };

  if (result) {
    return (
      <div className="rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5 text-[#F5F5F7] animate-in fade-in zoom-in-95 duration-300" data-testid="status-quote-ready">
        <CheckCircle2 className="h-8 w-8 text-white" />
        <h3 className="mt-4 font-display text-[24px] font-bold leading-tight text-white" style={{ fontFamily: "Sora" }}>Quote ready!</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-[#F5F5F7]">Tap to send on WhatsApp - Code <span className="font-semibold text-white">{result.ref}</span></p>
        {saveFailed && <p className="mt-2 text-[13px] text-[#A1A1A6]" role="status">This quote is ready for WhatsApp, but could not be saved online.</p>}
        <button type="button" onClick={() => window.open(result.whatsapp, "_blank", "noopener,noreferrer")} className={`${btnOrange} mt-4 w-full md:w-auto`} data-testid="button-quote-open-whatsapp">
          <Send className="h-4 w-4" /> Open WhatsApp
        </button>
        <button type="button" onClick={copyCode} className={`${btnDark} mt-3 w-full md:ml-2 md:mt-4 md:w-auto`} data-testid="button-quote-copy-code">
          <Copy className="h-4 w-4" /> {copied ? "Code Copied" : "Copy Code"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <fieldset>
        <legend className={labelCls}>1. Choose Your Currency *</legend>
        <div className="mobile-currency-grid grid min-w-0 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {CURRENCY_OPTIONS.map(({ code, country: optionCountry, flag }) => (
            <button
              key={code}
              type="button"
              aria-pressed={currency === code}
              onClick={() => changeCurrency(code)}
              className={`min-h-11 rounded-lg border px-2 text-[12px] font-semibold transition-colors ${currency === code ? "border-[#FF6B00] bg-[#FF6B00] text-white" : "border-[#3A3A3C] bg-[#1D1D1F] text-white hover:border-[#A1A1A6]"}`}
              data-testid={`button-quote-currency-${code.toLowerCase()}`}
            >
              {flag} {code} - {optionCountry}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[13px] text-[#D4D4D4]" data-testid="text-quote-currency">You are requesting quote in: {currency} - {CURRENCY_OPTIONS.find((option) => option.code === currency)?.label}</p>
      </fieldset>
      <div className={`grid gap-4 ${compact ? "" : "md:grid-cols-2"}`}>
        <label className="block"><span className={labelCls}>Name</span>
          <input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={`${inputCls} !h-[52px] md:!h-12`} placeholder="Full name" autoComplete="name" data-testid="input-quote-name" /></label>
        <label className="block"><span className={labelCls}>Phone</span>
          <input required type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className={`${inputCls} !h-[52px] md:!h-12`} placeholder="+254 721 928 484" data-testid="input-quote-phone" /></label>
        <label className="block"><span className={labelCls}>Service</span>
          <select required value={f.service} onChange={(e) => setF({ ...f, service: e.target.value })} className={`${inputCls} !h-[52px] md:!h-12`} data-testid="select-quote-service">
            <option value="">Choose a service</option>
            {SERVICE_NAMES.map((s) => <option key={s}>{s}</option>)}
          </select></label>
      </div>
      <label className="block"><span className={labelCls}>Country</span>
        <select value={country} onChange={(e) => chooseCountry(e.target.value as typeof country)} className={`${inputCls} !h-[52px] md:!h-12`} data-testid="select-quote-country">
          {COUNTRIES.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
      <div className={`grid gap-4 ${compact ? "" : "md:grid-cols-[1fr_2fr]"}`}>
        <label className="block"><span className={labelCls}>Quantity</span>
          <input required type="number" min={1} inputMode="numeric" value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} className={`${inputCls} !h-[52px] md:!h-12`} placeholder="100" data-testid="input-quote-quantity" /></label>
        <label className="block"><span className={labelCls}>Details</span>
          <input value={f.details} onChange={(e) => setF({ ...f, details: e.target.value })} className={`${inputCls} !h-[52px] md:!h-12`} placeholder="Colours, deadline, delivery area" data-testid="input-quote-details" /></label>
      </div>
      <div className="w-full min-w-0 break-words rounded-lg border border-[#3A3A3C] bg-[#1D1D1F] p-3.5">
        <p className="text-[14px] font-semibold text-white" data-testid="text-quote-estimate">
          <span key={currency} className="diglo-currency-fade">
            Total: {estimateUGXForDisplay ? (
              <>
                {formatPrice(estimateUGXForDisplay, currency)}{" "}
                <span className="text-[11px] font-normal text-[#A1A1A6]">({formatPrice(estimateUGXForDisplay, "USD")} USD)</span>
              </>
            ) : "Quote confirmed on WhatsApp"}
          </span>
        </p>
        <p className="mt-1 text-[12px] text-[#A1A1A6]">Delivery across East Africa - Quote includes delivery estimate for your country</p>
      </div>
      {error && <p className="text-[14px] font-medium text-[#A1A1A6]" role="alert" data-testid="text-quote-error">{error}</p>}
      <button type="submit" className={`${btnOrange} w-full`} data-testid="button-quote-submit">
        <Send className="h-4 w-4" /> Send on WhatsApp
      </button>
    </form>
  );
}

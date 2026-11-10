import { useState } from "react";
import { CheckCircle2, Copy, Send } from "lucide-react";
import { buildQuoteMessage, makeQuoteRef, whatsappUrl } from "@/lib/diglo";
import { SERVICE_NAMES } from "@/lib/site";
import { btnDark, btnOrange, inputCls, labelCls } from "@/components/tokens";

type Result = { ref: string; name: string; service: string; quantity: number; details: string; whatsapp: string };

export function QuoteForm({ initialService = "", compact = false }: { initialService?: string; compact?: boolean }) {
  const [f, setF] = useState({ name: "", service: initialService, quantity: "", details: "" });
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const quantity = Number(f.quantity);
    const name = f.name.trim();
    const service = f.service.trim();
    const details = f.details.trim();
    if (name.length < 2 || !service) {
      setError("Please add your name and choose a service.");
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      setError("Please enter a quantity of at least 1.");
      return;
    }
    const ref = makeQuoteRef();
    const message = buildQuoteMessage({ ref, service, quantity, details, name });
    const whatsapp = whatsappUrl(message);
    if (!whatsapp) {
      setError("WhatsApp is unavailable right now. Please try again.");
      return;
    }
    setResult({ ref, name, service, quantity, details, whatsapp });
    window.open(whatsapp, "_blank", "noopener,noreferrer");
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
      <div className={`grid gap-4 ${compact ? "" : "md:grid-cols-2"}`}>
        <label className="block"><span className={labelCls}>Name</span>
          <input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={`${inputCls} !h-[52px] md:!h-12`} placeholder="Full name" autoComplete="name" data-testid="input-quote-name" /></label>
        <label className="block"><span className={labelCls}>Service</span>
          <select required value={f.service} onChange={(e) => setF({ ...f, service: e.target.value })} className={`${inputCls} !h-[52px] md:!h-12`} data-testid="select-quote-service">
            <option value="">Choose a service</option>
            {SERVICE_NAMES.map((s) => <option key={s}>{s}</option>)}
          </select></label>
      </div>
      <div className={`grid gap-4 ${compact ? "" : "md:grid-cols-[1fr_2fr]"}`}>
        <label className="block"><span className={labelCls}>Quantity</span>
          <input required type="number" min={1} inputMode="numeric" value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} className={`${inputCls} !h-[52px] md:!h-12`} placeholder="100" data-testid="input-quote-quantity" /></label>
        <label className="block"><span className={labelCls}>Details</span>
          <input value={f.details} onChange={(e) => setF({ ...f, details: e.target.value })} className={`${inputCls} !h-[52px] md:!h-12`} placeholder="Colours, deadline, delivery area" data-testid="input-quote-details" /></label>
      </div>
      {error && <p className="text-[14px] font-medium text-[#A1A1A6]" role="alert" data-testid="text-quote-error">{error}</p>}
      <button type="submit" className={`${btnOrange} w-full`} data-testid="button-quote-submit">
        <Send className="h-4 w-4" /> Send on WhatsApp
      </button>
    </form>
  );
}

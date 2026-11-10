import { useEffect, useState } from "react";
import { CheckCircle2, Clock, RefreshCw, Send } from "lucide-react";
import { submitLead, retryPendingLeads, whatsappUrl } from "@/lib/diglo";
import { SERVICE_NAMES } from "@/lib/site";
import { btnGhost, btnOrange, inputCls, labelCls } from "@/components/tokens";

type Result = { ref: string; sent: boolean; name: string };

export function QuoteForm({ initialService = "", compact = false }: { initialService?: string; compact?: boolean }) {
  const [f, setF] = useState({ name: "", phone: "", service: initialService, quantity: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [retryNote, setRetryNote] = useState("");

  // Only flip to "sent" once the API confirms delivery of this ref.
  useEffect(() => {
    const onSent = (e: Event) => {
      const detail = (e as CustomEvent<{ ref: string; queuedRef: string }>).detail;
      setResult((r) => (r && !r.sent && (r.ref === detail?.ref || r.ref === detail?.queuedRef) ? { ...r, ref: detail.ref, sent: true } : r));
    };
    window.addEventListener("diglo:lead-sent", onSent);
    return () => window.removeEventListener("diglo:lead-sent", onSent);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const qty = Number(f.quantity);
    if (!f.name.trim() || !f.phone.trim() || !f.service) { setError("Please add your name, phone number and service."); return; }
    if (!Number.isFinite(qty) || qty < 1) { setError("Please enter a quantity of at least 1."); return; }
    setBusy(true);
    try {
      const r = await submitLead({ name: f.name.trim(), phone: f.phone.trim(), service: f.service, quantity: qty, message: f.message.trim() });
      setResult({ ...r, name: f.name.trim() });
      if (r.sent) {
        const url = whatsappUrl(`Hello Diglo Ventures, I just sent quote request ${r.ref} for ${f.service}, quantity ${qty}.`);
        if (url) window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const retry = async () => {
    setRetrying(true); setRetryNote("");
    try {
      const n = await retryPendingLeads();
      setRetryNote(n > 0 ? `${n} saved request${n === 1 ? "" : "s"} delivered.` : "Still not delivered. We will keep trying automatically.");
    } catch {
      setRetryNote("Retry failed. Please check your connection.");
    } finally { setRetrying(false); }
  };

  if (result) {
    return result.sent ? (
      <div className="rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F] p-5 text-[#F5F5F7] animate-in fade-in zoom-in-95 duration-300 md:p-6" data-testid="status-quote-sent">
        <CheckCircle2 className="h-8 w-8 text-[#F5F5F7]" />
        <p className="mt-4 break-words font-display text-[24px] font-bold leading-tight text-white" style={{ fontFamily: "Sora" }}>{result.ref}</p>
        <p className="mt-3 text-[16px] leading-relaxed text-[#F5F5F7]">
          Thank you, {result.name}. Your quote request {result.ref} has been sent. We will reply within 5 minutes on WhatsApp.
        </p>
        {whatsappUrl(`Hello Diglo Ventures, I just sent quote request ${result.ref}.`) ? (
          <a href={whatsappUrl(`Hello Diglo Ventures, I just sent quote request ${result.ref}.`)!} target="_blank" rel="noopener noreferrer" className={`${btnOrange} mt-4 w-full md:w-auto`}>Open WhatsApp</a>
        ) : <p className="mt-3 text-sm">The business WhatsApp number is not configured yet. Your saved request is available to Diglo in Supabase.</p>}
      </div>
    ) : (
      <div className="rounded-2xl border border-[#3A3A3C] bg-[#242426] p-5 text-[#F5F5F7] animate-in fade-in duration-300 md:p-6" data-testid="status-quote-pending">
        <Clock className="h-7 w-7 text-[#F5F5F7]" />
        <p className="mt-4 font-semibold text-white">Saved on this device. Not sent yet.</p>
        <p className="mt-2 text-[15px] leading-relaxed">
          Your request {result.ref} could not reach us right now. It is saved on this device for up to seven days and will be retried when this page is open and online. This message will update once it is delivered. Clearing browser data will remove the saved request.
        </p>
        <button onClick={retry} disabled={retrying} className={`${btnGhost} mt-4`} data-testid="button-quote-retry">
          <RefreshCw className={`h-4 w-4 ${retrying ? "animate-spin" : ""}`} /> {retrying ? "Retrying" : "Retry now"}
        </button>
        {retryNote && <p className="mt-3 text-[14px]" data-testid="text-retry-note">{retryNote}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className={`grid gap-4 ${compact ? "" : "md:grid-cols-2"}`}>
        <label className="block"><span className={labelCls}>Name</span>
          <input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={`${inputCls} !h-[52px] md:!h-12`} placeholder="Full name" autoComplete="name" data-testid="input-quote-name" /></label>
        <label className="block"><span className={labelCls}>Phone</span>
          <div className="flex">
            <span className="grid h-[52px] place-items-center rounded-l-xl border border-r-0 border-[#3A3A3C] bg-[#2D2D2F] px-3 text-[15px] font-medium text-white md:h-12">+256</span>
            <input required type="tel" inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className={`${inputCls} !h-[52px] rounded-l-none md:!h-12`} placeholder="7XX XXX XXX" autoComplete="tel-national" data-testid="input-quote-phone" />
          </div>
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <label className="block"><span className={labelCls}>Service</span>
          <select required value={f.service} onChange={(e) => setF({ ...f, service: e.target.value })} className={`${inputCls} !h-[52px] md:!h-12`} data-testid="select-quote-service">
            <option value="">Choose a service</option>
            {SERVICE_NAMES.map((s) => <option key={s}>{s}</option>)}
          </select></label>
        <label className="block"><span className={labelCls}>Quantity</span>
          <input required type="number" min={1} inputMode="numeric" value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} className={`${inputCls} !h-[52px] md:!h-12`} placeholder="100" data-testid="input-quote-quantity" /></label>
      </div>
      <label className="block"><span className={labelCls}>Message</span>
        <textarea rows={compact ? 3 : 4} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} className={`${inputCls} h-auto py-3`} placeholder="Business name, colours, deadline, delivery area" data-testid="input-quote-message" /></label>
      {error && <p className="text-[14px] font-medium text-[#6E6E73]" role="alert" data-testid="text-quote-error">{error}</p>}
      <button type="submit" disabled={busy} className={`${btnOrange} w-full`} data-testid="button-quote-submit">
        <Send className="h-4 w-4" /> {busy ? "Sending" : "Send Quote Request"}
      </button>
    </form>
  );
}

import { useState } from "react";
import { AlertTriangle, Check, MessageCircle, PackageSearch, Search, WifiOff } from "lucide-react";
import { lookupOrders, supabase, type TrackedOrder } from "@/lib/diglo";
import { useSeo } from "@/lib/seo";
import { PageShell } from "@/components/site-shell";
import { useSite } from "@/components/site-providers";
import { btnDark, btnOrange, inputCls, wrap } from "@/components/tokens";

const STAGES = ["Received", "Designing", "Awaiting Approval", "Printing", "Ready", "Delivered"] as const;
const NOT_FOUND = "Order not found. Please WhatsApp us with your code.";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "notfound" }
  | { kind: "config" }
  | { kind: "network"; message: string }
  | { kind: "found"; orders: TrackedOrder[] };

function isValidQuery(q: string) {
  if (/^DG-[A-Z0-9]{4,}$/i.test(q)) return true;
  return q.replace(/\D/g, "").length >= 9;
}

function Timeline({ order }: { order: TrackedOrder }) {
  const idx = STAGES.findIndex((s) => s.toLowerCase() === String(order.stage).toLowerCase());
  return (
    <article className="rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5 text-[#F5F5F7] animate-in fade-in slide-in-from-bottom-2 duration-500" data-testid={`card-order-${order.ref}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em]">Order</p>
          <h2 className="mt-1 text-[22px] font-bold" data-testid="text-order-ref">{order.ref}</h2>
          <p className="text-[15px]">{order.service}</p>
        </div>
        <p className="text-[13px]">Updated {new Date(order.updated_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</p>
      </div>
      <ol className="mt-8 grid gap-0 sm:grid-cols-6">
        {STAGES.map((s, i) => {
          const past = idx >= 0 && i < idx;
          const current = i === idx;
          return (
            <li key={s} className="relative flex items-center gap-3 pb-5 sm:flex-col sm:items-start sm:pb-0" data-testid={`stage-${i}`}>
              {i < STAGES.length - 1 && (
                <span className={`absolute left-[13px] top-7 h-[calc(100%-20px)] w-0.5 sm:left-7 sm:top-[13px] sm:h-0.5 sm:w-[calc(100%-20px)] ${past ? "bg-[#A1A1A6]" : "bg-[#3A3A3C]"}`} />
              )}
              <span className={`relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 ${current ? "border-black bg-black text-white" : past ? "border-[#A1A1A6] bg-[#2D2D2F] text-white" : "border-[#3A3A3C] bg-[#2D2D2F] text-[#A1A1A6]"}`}>
                {past ? <Check className="h-3.5 w-3.5" /> : current ? <span className="pulse-dot h-2 w-2 rounded-full bg-white" /> : null}
              </span>
              <span className={`text-[14px] sm:mt-3 ${current ? "font-bold text-white" : past ? "font-medium text-[#D4D4D4]" : "text-[#A1A1A6]"}`}>{s}</span>
            </li>
          );
        })}
      </ol>
      {idx < 0 && <p className="mt-4 text-[14px]">Current stage: {order.stage}</p>}
    </article>
  );
}

export default function Track() {
  useSeo({ title: "Track Your Order | Diglo Ventures", description: "Check the stage of your Diglo Ventures order using your DG order code or phone number.", path: "/track" });
  const { openWhatsApp } = useSite();
  const [q, setQ] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query || !isValidQuery(query)) { setState({ kind: "notfound" }); return; }
    if (!supabase) { setState({ kind: "config" }); return; }
    setState({ kind: "loading" });
    try {
      const orders = await lookupOrders(query);
      setState(orders.length ? { kind: "found", orders } : { kind: "notfound" });
    } catch (err) {
      setState({ kind: "network", message: err instanceof Error ? err.message : "Unknown error" });
    }
  };

  return (
    <PageShell active="track">
      <section className="bg-[#1D1D1F] py-10 text-[#F5F5F7] md:py-16">
        <div className={`${wrap} max-w-[880px]`}>
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em]">Track Order</p>
          <h1 className="text-[28px] font-bold leading-[1.3] md:text-[40px]">Where is my order?</h1>
          <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-[#D4D4D4]">Enter your order code (for example DG-1234) or the phone number you ordered with.</p>
          <form onSubmit={search} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1A6]" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="DG-XXXX or phone number" className={`${inputCls} pl-11`} aria-label="Order code or phone" data-testid="input-track-query" />
            </div>
            <button type="submit" disabled={state.kind === "loading"} className={btnOrange} data-testid="button-track-search">
              <PackageSearch className="h-4 w-4" /> {state.kind === "loading" ? "Checking" : "Track Order"}
            </button>
          </form>

          <div className="mt-10" aria-live="polite">
            {state.kind === "loading" && (
              <div className="space-y-4 rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5">
                <div className="h-5 w-32 animate-pulse rounded bg-[#3A3A3C]" />
                <div className="h-4 w-56 animate-pulse rounded bg-[#3A3A3C]" />
                <div className="h-10 w-full animate-pulse rounded bg-[#3A3A3C]" />
              </div>
            )}
            {state.kind === "notfound" && (
              <div className="rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5 text-[#F5F5F7]" data-testid="status-track-notfound">
                <p className="text-[15px] font-semibold text-white">{NOT_FOUND}</p>
                <button onClick={() => openWhatsApp(`Hello Diglo Ventures, I would like an update on my order ${q.trim()}.`)} className={`${btnOrange} mt-4`} data-testid="button-track-whatsapp"><MessageCircle className="h-4 w-4" /> WhatsApp Us</button>
              </div>
            )}
            {state.kind === "config" && (
              <div className="rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5" data-testid="status-track-config">
                <AlertTriangle className="h-6 w-6 text-[#A1A1A6]" />
                <p className="mt-3 font-semibold text-white">Order tracking is not connected yet.</p>
                <p className="mt-1 text-[15px] text-[#D4D4D4]">This is a setup issue on our side, not a problem with your order. Please message us for an update.</p>
                <button onClick={() => openWhatsApp(`Hello Diglo Ventures, I would like an update on my order ${q.trim()}.`)} className={`${btnOrange} mt-4`}><MessageCircle className="h-4 w-4" /> WhatsApp Us</button>
              </div>
            )}
            {state.kind === "network" && (
              <div className="rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-5" data-testid="status-track-error">
                <WifiOff className="h-6 w-6 text-[#A1A1A6]" />
                <p className="mt-3 font-semibold text-white">We could not check right now.</p>
                <p className="mt-1 text-[15px] text-[#D4D4D4]">There was a connection problem. Your order has not been affected. Please try again.</p>
                <button onClick={search} className={`${btnDark} mt-4`} data-testid="button-track-retry">Try again</button>
              </div>
            )}
            {state.kind === "found" && <div className="space-y-5">{state.orders.map((o) => <Timeline key={o.ref} order={o} />)}</div>}
            {state.kind === "idle" && (
              <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {STAGES.map((s, i) => (
                  <li key={s} className="flex items-center gap-3 rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] px-4 py-3 text-[14px] text-white"><span className="text-[12px] font-semibold text-[#A1A1A6]">0{i + 1}</span>{s}</li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

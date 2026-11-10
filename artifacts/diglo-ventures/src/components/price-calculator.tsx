import { useMemo, useState } from "react";
import { Calculator, MessageCircle } from "lucide-react";
import { PRODUCTS, calculateEstimate } from "@/lib/calculator";
import { formatUGX } from "@/lib/site";
import { inputCls, labelCls } from "@/components/tokens";
import { useSite } from "@/components/site-providers";

type Paper = "standard" | "premium";
type Delivery = "pickup" | "kampala" | "upcountry";

const MIN = 10;
const MAX = 5000;
const fmt = (n: number) => n.toLocaleString("en-US");

function Seg<T extends string>({ value, options, onChange, name }: { value: T; options: [T, string][]; onChange: (v: T) => void; name: string }) {
  return (
    <div className="grid gap-1 rounded-xl bg-[#F5F5F7] p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))` }} role="radiogroup">
      {options.map(([v, l]) => (
        <button key={v} type="button" role="radio" aria-checked={value === v} onClick={() => onChange(v)}
          className={`h-10 rounded-lg px-2 text-[13px] font-semibold transition-all sm:text-[14px] ${value === v ? "bg-white text-[#1D1D1F] shadow-[0_1px_0_#D2D2D7,0_4px_20px_rgba(29,29,31,.06)]" : "text-[#6E6E73] hover:text-[#1D1D1F]"}`}
          data-testid={`button-${name}-${v}`}>{l}</button>
      ))}
    </div>
  );
}

export function PriceCalculator() {
  const { openWhatsApp } = useSite();
  const [productId, setProductId] = useState<string>(PRODUCTS[0]?.id ?? "");
  const [quantity, setQuantity] = useState(100);
  const [qtyText, setQtyText] = useState("100");
  const [paper, setPaper] = useState<Paper>("standard");
  const [delivery, setDelivery] = useState<Delivery>("pickup");

  const product = PRODUCTS.find((p) => p.id === productId);
  const est = useMemo(() => calculateEstimate({ productId, quantity, paper, delivery }), [productId, quantity, paper, delivery]);
  const known = est.base + (est.paper ?? 0) + (est.delivery ?? 0);

  const setQty = (n: number) => {
    const c = Math.min(MAX, Math.max(MIN, Math.round(n || MIN)));
    setQuantity(c); setQtyText(String(c));
  };

  const totalText = est.total !== null ? fmt(est.total) : `${fmt(known)} plus items to confirm`;
  const send = () => {
    openWhatsApp(`Hello Diglo Ventures, I would like a quote for ${product?.name ?? "printing"}, Quantity ${quantity}, Estimated Price ${totalText} UGX. Please confirm.`);
  };

  const Row = ({ label, value, testid, muted = false }: { label: string; value: string; testid: string; muted?: boolean }) => (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="text-[15px]">{label}</dt>
      <dd className={`text-right text-[15px] font-semibold ${muted ? "text-[#6E6E73] italic" : "text-[#1D1D1F]"}`} data-testid={testid}>{value}</dd>
    </div>
  );

  return (
    <div id="calculator" className="reveal mt-8 grid overflow-hidden rounded-2xl border border-[#D2D2D7] bg-white lg:grid-cols-[1.15fr_.85fr]">
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#F5F5F7] text-[#1D1D1F]"><Calculator className="h-5 w-5" /></span>
          <div>
            <h3 className="text-[20px] font-semibold">Price Calculator</h3>
            <p className="text-[14px]">An instant estimate. We confirm the final price.</p>
          </div>
        </div>

        <div className="mt-7 space-y-6">
          <label className="block"><span className={labelCls}>Product</span>
            <select value={productId} onChange={(e) => setProductId(e.target.value)} className={inputCls} data-testid="select-calc-product">
              {PRODUCTS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>

          <div>
            <div className="flex items-center justify-between">
              <span className={labelCls}>Quantity</span>
              <input type="number" min={MIN} max={MAX} value={qtyText}
                onChange={(e) => { setQtyText(e.target.value); const n = Number(e.target.value); if (n >= MIN && n <= MAX) setQuantity(Math.round(n)); }}
                onBlur={() => setQty(Number(qtyText))}
                className="h-10 w-28 rounded-lg border border-[#D2D2D7] bg-[#F5F5F7] px-3 text-right text-[15px] font-semibold text-[#1D1D1F] outline-none focus:border-[#1D1D1F] focus:bg-white"
                aria-label="Quantity" data-testid="input-calc-quantity" />
            </div>
            <input type="range" min={MIN} max={MAX} step={10} value={quantity} onChange={(e) => setQty(Number(e.target.value))}
              className="mt-3 w-full accent-[#1D1D1F]" aria-label="Quantity slider" data-testid="slider-calc-quantity" />
            <div className="mt-1 flex justify-between text-[12px]"><span>{MIN}</span><span>500+ saves 10%</span><span>{fmt(MAX)}</span></div>
          </div>

          <div><span className={labelCls}>Paper</span>
            <Seg name="paper" value={paper} onChange={(v) => setPaper(v as Paper)} options={[["standard", "Standard"], ["premium", "Premium"]]} /></div>
          <div><span className={labelCls}>Delivery</span>
            <Seg name="delivery" value={delivery} onChange={(v) => setDelivery(v as Delivery)} options={[["pickup", "Pickup"], ["kampala", "Kampala 15,000"], ["upcountry", "Upcountry"]]} /></div>
        </div>
      </div>

      <div className="flex flex-col border-t border-[#D2D2D7] bg-white p-6 sm:p-8 lg:border-l lg:border-t-0">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em]">Your estimate</p>
        <dl className="mt-3 divide-y divide-[#D2D2D7]">
          <Row label={`Base (${product?.name ?? "-"} x ${fmt(quantity)})`} value={`${fmt(est.base + est.discount)} UGX`} testid="text-calc-base" />
          <Row label={`Paper (${paper === "premium" ? "Premium" : "Standard"})`} value={est.paper === null ? "To confirm" : `${fmt(est.paper)} UGX`} muted={est.paper === null} testid="text-calc-paper" />
          <Row label="Delivery" value={est.delivery === null ? "To confirm" : `${fmt(est.delivery)} UGX`} muted={est.delivery === null} testid="text-calc-delivery" />
          {est.discount > 0 && <Row label="500+ saving (10%)" value={`- ${fmt(est.discount)} UGX`} testid="text-calc-discount" />}
        </dl>
        <div className="mt-4 border-t-2 border-[#1D1D1F] pt-4">
          <p className="text-[14px]">Estimated total</p>
          <p className="font-display text-[30px] font-bold leading-tight text-[#FF6B00] transition-all" style={{ fontFamily: "Sora" }} data-testid="text-calc-total">
            {est.total !== null ? formatUGX(est.total) : `${formatUGX(known)} +`}
          </p>
          {est.discount > 0 && <p className="mt-1 text-[14px] font-semibold text-[#1D1D1F]" data-testid="text-calc-saving">You save 10% ({fmt(est.discount)} UGX) on the base price for 500+.</p>}
          {(est.needsConfirmation || est.total === null) && <p className="mt-2 text-[13px]" data-testid="text-calc-confirm">Some charges are not set yet and will be confirmed with your quote. They are not counted as zero.</p>}
        </div>
        <button onClick={send} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-5 text-[15px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(255,107,0,.7)]" data-testid="button-calc-whatsapp">
          <MessageCircle className="h-4 w-4" /> Send This Quote to WhatsApp
        </button>
      </div>
    </div>
  );
}

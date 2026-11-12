import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { buildQuoteMessage, makeQuoteRef, whatsappUrl } from "@/lib/diglo";
import { btnDark, btnOrange, inputCls, labelCls } from "@/components/tokens";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

type QuoteFormData = {
  name: string;
  phone: string;
  product: string;
  quantity: string;
  brandingDetails: string;
  deliveryArea: string;
  message: string;
};

type Result = { ref: string; whatsapp: string };

export function QuoteForm({
  initialProduct = "",
  initialCategory = "",
  initialService = "",
  compact = false,
}: {
  initialProduct?: string;
  initialCategory?: string;
  initialService?: string;
  compact?: boolean;
}) {
  const [f, setF] = useState<QuoteFormData>({
    name: "",
    phone: "",
    product: initialProduct,
    quantity: "",
    brandingDetails: "",
    deliveryArea: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const quantity = Number(f.quantity);
    const name = f.name.trim();
    const phone = f.phone.trim();
    const product = f.product.trim();
    const brandingDetails = f.brandingDetails.trim();
    const deliveryArea = f.deliveryArea.trim();
    const messageText = f.message.trim();
    const phoneDigits = phone.replace(/\D/g, "");
    if (name.length < 2 || !product || phoneDigits.length < 8 || phoneDigits.length > 15) {
      setError("Please add your name, product, and a valid phone / WhatsApp number.");
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      setError("Please enter a quantity of at least 1.");
      return;
    }
    const ref = makeQuoteRef();
    const category = initialCategory || "";
    const service = initialService || "";
    const message = buildQuoteMessage({
      ref,
      product,
      category,
      service,
      quantity,
      brandingDetails,
      deliveryArea,
      message: messageText,
      name,
      phone,
    });
    const whatsapp = whatsappUrl(message);
    if (!whatsapp) {
      setError("WhatsApp is unavailable right now. Please try again.");
      return;
    }
    setResult({ ref, whatsapp });
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
        product,
        category: category || null,
        service,
        quantity,
        branding_details: brandingDetails || null,
        delivery_area: deliveryArea || null,
        message: messageText || null,
        status: "New",
      }]);
      if (saveError) setSaveFailed(true);
      else toast({ title: "Quote saved ✅" });
    } catch {
      // Keep the WhatsApp quote flow available if Supabase is temporarily unreachable.
      setSaveFailed(true);
    }
  };

  if (result) {
    return (
      <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 text-[#4A4A4A] animate-in fade-in zoom-in-95 duration-300" data-testid="status-quote-ready">
        <CheckCircle2 className="h-8 w-8 text-black" />
        <h3 className="mt-4 font-display text-[22px] font-bold leading-tight text-black" style={{ fontFamily: "Sora" }}>Thank you. We will send your customized quote on WhatsApp.</h3>
        {saveFailed && <p className="mt-2 text-[13px] text-[#4A4A4A]" role="status">Your WhatsApp request is ready, but this copy could not be saved online.</p>}
        <button type="button" onClick={() => window.open(result.whatsapp, "_blank", "noopener,noreferrer")} className={`${btnOrange} mt-4 w-full md:w-auto`} data-testid="button-quote-open-whatsapp">
          <Send className="h-4 w-4" /> Open WhatsApp
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate data-testid="form-custom-quote">
      {f.product && (
        <p className="rounded-lg border border-[#E5E5E5] bg-white px-4 py-3 text-[14px] font-medium text-[#333333]" data-testid="text-ordering-product">
          You are ordering: <span className="font-semibold text-black">{f.product}</span> - Customized Quote
        </p>
      )}
      <div className={`grid gap-4 ${compact ? "" : "md:grid-cols-2"}`}>
        <label className="block"><span className={labelCls}>Name</span>
          <input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={`${inputCls} !h-[52px] md:!h-12`} placeholder="Full name" autoComplete="name" data-testid="input-quote-name" /></label>
        <label className="block"><span className={labelCls}>Phone / WhatsApp</span>
          <input required type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className={`${inputCls} !h-[52px] md:!h-12`} placeholder="+254 721 928 484" data-testid="input-quote-phone" /></label>
        <label className="block"><span className={labelCls}>Product</span>
          <input required value={f.product} readOnly={Boolean(initialProduct)} onChange={(e) => setF({ ...f, product: e.target.value })} className={`${inputCls} !h-[52px] md:!h-12`} placeholder="Enter the product you need" data-testid="input-quote-product" /></label>
        <label className="block"><span className={labelCls}>Quantity</span>
          <input required type="number" min={1} inputMode="numeric" value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} className={`${inputCls} !h-[52px] md:!h-12`} placeholder="How many?" data-testid="input-quote-quantity" /></label>
        <label className="block"><span className={labelCls}>Branding Details</span>
          <input value={f.brandingDetails} onChange={(e) => setF({ ...f, brandingDetails: e.target.value })} className={`${inputCls} !h-[52px] md:!h-12`} placeholder="Logo, colours, print or embroidery" data-testid="input-quote-branding" /></label>
        <label className="block"><span className={labelCls}>Delivery Area / Location</span>
          <input value={f.deliveryArea} onChange={(e) => setF({ ...f, deliveryArea: e.target.value })} className={`${inputCls} !h-[52px] md:!h-12`} placeholder="Town, city or delivery location" data-testid="input-quote-delivery-area" /></label>
        <label className="block md:col-span-2"><span className={labelCls}>Message</span>
          <textarea value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} className={`${inputCls} min-h-28 py-3`} placeholder="Tell us anything else we should know" data-testid="input-quote-message" /></label>
      </div>
      <input type="hidden" name="category" value={initialCategory} />
      <input type="hidden" name="service" value={initialService} />
      {error && <p className="text-[14px] font-medium text-[#A1A1A6]" role="alert" data-testid="text-quote-error">{error}</p>}
      <button type="submit" className={`${btnOrange} w-full`} data-testid="button-quote-submit">
        <Send className="h-4 w-4" /> Get Custom Quote
      </button>
    </form>
  );
}

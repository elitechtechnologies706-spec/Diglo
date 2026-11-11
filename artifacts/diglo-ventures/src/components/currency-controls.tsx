import { CURRENCY_OPTIONS, type Currency } from "@/lib/site";
import { useSite } from "@/components/site-providers";

export function CurrencyPicker({ compact = false }: { compact?: boolean }) {
  const { currency, changeCurrency } = useSite();
  return (
    <>
      <div className={`hidden items-center gap-1 sm:flex ${compact ? "gap-0.5" : ""}`} aria-label="Choose display currency">
        {CURRENCY_OPTIONS.map(({ code }) => (
          <button
            key={code}
            type="button"
            aria-pressed={currency === code}
            onClick={() => changeCurrency(code)}
            className={`rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors ${compact ? "px-1.5 text-[10px]" : ""} ${currency === code ? "border-[#FF6B00] bg-[#FF6B00] text-white" : "border-[#3A3A3C] bg-[#2D2D2F] text-white hover:border-[#A1A1A6]"}`}
            data-testid={`button-currency-${code.toLowerCase()}`}
          >
            {code}
          </button>
        ))}
      </div>
      <label className="sm:hidden">
        <span className="sr-only">Choose display currency</span>
        <select
          aria-label="Choose display currency"
          value={currency}
          onChange={(event) => changeCurrency(event.target.value as Currency)}
          className="h-8 rounded-md border border-[#3A3A3C] bg-[#2D2D2F] px-2 text-[12px] font-semibold text-white"
          data-testid="select-currency-mobile"
        >
          {CURRENCY_OPTIONS.map(({ code }) => <option key={code} value={code}>{code} ▼</option>)}
        </select>
      </label>
    </>
  );
}

export function CardCurrencyPicker() {
  const { currency, changeCurrency } = useSite();
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-[#A1A1A6]">
      <span>Show price in:</span>
      {CURRENCY_OPTIONS.map(({ code }) => (
        <button
          key={code}
          type="button"
          aria-pressed={currency === code}
          onClick={() => changeCurrency(code)}
          className={`rounded px-1.5 py-0.5 font-semibold transition-colors ${currency === code ? "bg-[#FF6B00] text-white" : "text-[#D4D4D4] hover:text-white"}`}
          data-testid={`button-card-currency-${code.toLowerCase()}`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

export const wrap = "mx-auto w-full max-w-[1200px] px-4 md:px-6";
export const btnOrange =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-6 h-12 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(255,107,0,.7)] active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2";
export const btnDark =
  "inline-flex items-center justify-center gap-2 rounded-full border border-white/60 bg-[#1D1D1F] px-6 h-12 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white hover:bg-[#2D2D2F] active:translate-y-0 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#3A3A3C] bg-[#2D2D2F] px-5 h-11 text-[14px] font-semibold text-[#F5F5F7] transition hover:border-[#A1A1A6] disabled:opacity-60";
export const inputCls =
  "w-full rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] px-4 h-12 text-[15px] text-white placeholder:text-[#A1A1A6] outline-none transition focus:border-[#A1A1A6]";
export const labelCls = "mb-1.5 block text-[14px] font-medium text-white";
export const BASE = import.meta.env.BASE_URL;
export const homeHash = (id: string) => `${BASE}#${id}`;
export const img = (f: string) => `${BASE}images/${f.replace(/\.jpe?g$/i, ".webp")}`;

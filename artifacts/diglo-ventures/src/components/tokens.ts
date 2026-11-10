export const wrap = "mx-auto w-full max-w-[1200px] px-5 sm:px-8";
export const btnOrange =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-6 h-12 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(255,107,0,.7)] active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2";
export const btnDark =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#1A1A1A] px-6 h-12 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2a2a2a] active:translate-y-0 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-5 h-11 text-[14px] font-semibold text-[#1A1A1A] transition hover:border-[#1A1A1A] disabled:opacity-60";
export const inputCls =
  "w-full rounded-xl border border-[#E5E5E5] bg-[#F2F2F2] px-4 h-12 text-[15px] text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A] focus:bg-white";
export const labelCls = "mb-1.5 block text-[14px] font-medium text-[#1A1A1A]";
export const BASE = import.meta.env.BASE_URL;
export const homeHash = (id: string) => `${BASE}#${id}`;
export const img = (f: string) => `${BASE}images/${f}`;

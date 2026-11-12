export const wrap = "mx-auto w-full max-w-[1280px] px-[14px] sm:px-4 md:px-5 lg:px-6";
export const btnOrange =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-black px-[18px] h-11 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#333333] active:translate-y-0 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 md:h-10 md:text-[14px]";
export const btnDark =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-black bg-black px-[18px] h-11 text-[15px] font-semibold text-white transition-colors duration-200 hover:border-[#333333] hover:bg-[#333333] active:translate-y-0 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 md:h-10 md:text-[14px]";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-[#E5E5E5] bg-white px-4 h-10 text-[14px] font-semibold text-black transition-colors hover:border-[#333333] disabled:opacity-60";
export const inputCls =
  "w-full rounded-lg border border-[#E5E5E5] bg-white px-4 h-12 text-[15px] text-black placeholder:text-[#4A4A4A] outline-none transition focus:border-[#333333]";
export const labelCls = "mb-1.5 block text-[14px] font-medium text-black";
export const BASE = import.meta.env.BASE_URL;
export const homeHash = (id: string) => `${BASE}#${id}`;

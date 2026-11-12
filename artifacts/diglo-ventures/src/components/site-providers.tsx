import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { Mail, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { whatsappUrl } from "@/lib/diglo";
import { CONTACT } from "@/lib/site";
import { btnDark } from "@/components/tokens";

export const DEFAULT_WA_MESSAGE = "Hello Diglo Ventures, I would like a quote for branding and printing.";

type Ctx = {
  openWhatsApp: (message?: string) => void;
  openQuote: (product?: string, category?: string, service?: string) => void;
  showPhoneUnavailable: () => void;
};
const SiteCtx = createContext<Ctx | null>(null);

export function useSite() {
  const c = useContext(SiteCtx);
  if (!c) throw new Error("useSite must be used inside SiteProviders");
  return c;
}

/** Shared helper for every WhatsApp button; the testing number lives in CONTACT. */
export function getWhatsAppLink(message: string): string | null {
  try {
    return whatsappUrl(message);
  } catch {
    return null;
  }
}

export function SiteProviders({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const [waNotice, setWaNotice] = useState<null | { kind: "whatsapp" | "phone"; message: string }>(null);

  const openWhatsApp = useCallback((message: string = DEFAULT_WA_MESSAGE) => {
    const url = getWhatsAppLink(message);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    else setWaNotice({ kind: "whatsapp", message });
  }, []);
  const openQuote = useCallback((product = "", category = "", service = "") => {
    const params = new URLSearchParams();
    if (product) params.set("product", product);
    if (category) params.set("category", category);
    if (service) params.set("service", service);
    const query = params.toString();
    setLocation(query ? `/quote?${query}` : "/quote");
  }, [setLocation]);
  const showPhoneUnavailable = useCallback(() => {
    if (CONTACT.phone) window.location.href = `tel:${CONTACT.phone}`;
    else setWaNotice({ kind: "phone", message: DEFAULT_WA_MESSAGE });
  }, []);

  const noticeKind = waNotice?.kind === "phone" ? "Phone" : "WhatsApp";
  return (
    <SiteCtx.Provider value={{ openWhatsApp, openQuote, showPhoneUnavailable }}>
      {children}
      <Dialog open={!!waNotice} onOpenChange={(o) => !o && setWaNotice(null)}>
        <DialogContent className="rounded-xl border-[#E5E5E5] bg-white text-[#4A4A4A] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-black">{noticeKind} is unavailable</DialogTitle>
            <DialogDescription className="text-[#4A4A4A]">
              Your message could not be opened. You can reach Diglo Ventures by email instead.
            </DialogDescription>
          </DialogHeader>
          {waNotice && (
            <a
              href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Quote request")}&body=${encodeURIComponent(waNotice.message)}`}
              className={`${btnDark} w-full`}
              data-testid="link-unavailable-email"
            >
              <Mail className="h-4 w-4" /> Email {CONTACT.email}
            </a>
          )}
        </DialogContent>
      </Dialog>
    </SiteCtx.Provider>
  );
}

export function FloatingWhatsApp() {
  const { openWhatsApp } = useSite();
  const [location] = useLocation();
  if (location.startsWith("/admin")) return null;
  return (
    <button
      onClick={() => openWhatsApp(DEFAULT_WA_MESSAGE)}
      aria-label="Get a quote on WhatsApp"
      className="group fixed bottom-[140px] right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-black text-white shadow-[0_4px_20px_rgba(0,0,0,.06)] transition-transform duration-200 hover:-translate-y-1 hover:scale-105 hover:bg-[#333333] md:bottom-6 md:right-6"
      data-testid="button-floating-whatsapp"
    >
      <MessageCircle className="h-6 w-6 transition-transform group-hover:rotate-[-8deg]" />
    </button>
  );
}

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { Mail, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { whatsappUrl, retryPendingLeads } from "@/lib/diglo";
import { CONTACT } from "@/lib/site";
import { btnDark } from "@/components/tokens";
import { QuoteForm } from "@/components/quote-form";

export const DEFAULT_WA_MESSAGE = "Hello Diglo Ventures, I would like a quote for branding and printing.";

type Ctx = {
  openWhatsApp: (message?: string) => void;
  openQuote: (service?: string) => void;
  showPhoneUnavailable: () => void;
};
const SiteCtx = createContext<Ctx | null>(null);

export function useSite() {
  const c = useContext(SiteCtx);
  if (!c) throw new Error("useSite must be used inside SiteProviders");
  return c;
}

/** Shared helper for every WhatsApp button. Never invents a number. */
export function getWhatsAppLink(message: string): string | null {
  try {
    return whatsappUrl(message);
  } catch {
    return null;
  }
}

export function SiteProviders({ children }: { children: ReactNode }) {
  const [waNotice, setWaNotice] = useState<null | { kind: "whatsapp" | "phone"; message: string }>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteService, setQuoteService] = useState("");

  const openWhatsApp = useCallback((message: string = DEFAULT_WA_MESSAGE) => {
    const url = getWhatsAppLink(message);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    else setWaNotice({ kind: "whatsapp", message });
  }, []);
  const openQuote = useCallback((service = "") => { setQuoteService(service); setQuoteOpen(true); }, []);
  const showPhoneUnavailable = useCallback(() => {
    if (CONTACT.phone) window.location.href = `tel:${CONTACT.phone}`;
    else setWaNotice({ kind: "phone", message: DEFAULT_WA_MESSAGE });
  }, []);

  // Retry queued leads at startup and whenever the browser comes back online.
  useEffect(() => {
    const run = () => { retryPendingLeads().catch(() => undefined); };
    run();
    window.addEventListener("online", run);
    return () => window.removeEventListener("online", run);
  }, []);

  const noticeKind = waNotice?.kind === "phone" ? "Phone" : "WhatsApp";
  return (
    <SiteCtx.Provider value={{ openWhatsApp, openQuote, showPhoneUnavailable }}>
      {children}
      <Dialog open={quoteOpen} onOpenChange={setQuoteOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl border-[#3A3A3C] bg-[#2D2D2F] text-[#F5F5F7] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-[22px] text-[#1D1D1F]">Get a Free Quote</DialogTitle>
            <DialogDescription className="text-[#6E6E73]">Tell us what you need. We reply on WhatsApp.</DialogDescription>
          </DialogHeader>
          <QuoteForm key={quoteOpen ? `open-${quoteService}` : "closed"} initialService={quoteService} />
        </DialogContent>
      </Dialog>
      <Dialog open={!!waNotice} onOpenChange={(o) => !o && setWaNotice(null)}>
        <DialogContent className="rounded-2xl border-[#3A3A3C] bg-[#2D2D2F] text-[#F5F5F7] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-[#1D1D1F]">{noticeKind} number not configured yet</DialogTitle>
            <DialogDescription className="text-[#6E6E73]">
              A {noticeKind === "WhatsApp" ? "WhatsApp" : "phone"} number has not been added to this website yet, so nothing was opened. You can reach Diglo Ventures by email instead.
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
      className="group fixed bottom-[140px] right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#FF6B00] text-white shadow-[0_14px_30px_-12px_rgba(255,107,0,.8)] transition-transform duration-200 hover:-translate-y-1 hover:scale-105 md:bottom-6 md:right-6"
      data-testid="button-floating-whatsapp"
    >
      <MessageCircle className="h-6 w-6 transition-transform group-hover:rotate-[-8deg]" />
    </button>
  );
}

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Check, ExternalLink, LogOut, RefreshCw, ShieldCheck } from "lucide-react";
import type { DigloQuote } from "@workspace/api-client-react";
import { Logo } from "@/components/site-shell";
import { useSeo } from "@/lib/seo";
import { btnDark, btnGhost, inputCls, labelCls, wrap } from "@/components/tokens";

const ADMIN_API = "/api/diglo/admin";
const errorMessage = (error: unknown) => error instanceof Error ? error.message : "Something went wrong.";
const dateText = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
};

async function responseError(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (body && typeof body === "object" && "error" in body && typeof body.error === "string") return body.error;
  } catch {
    // Use a generic status message for an empty or non-JSON response.
  }
  return `Request failed (${response.status}).`;
}

function customerWhatsApp(quote: DigloQuote): string | null {
  const phone = quote.phone.replace(/\D/g, "");
  if (phone.length < 8 || phone.length > 15) return null;
  const message = `Hello ${quote.name}, following up on your Diglo Ventures quote ${quote.code}.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export default function Admin() {
  useSeo({ title: "Admin | Diglo Ventures", path: "/admin", noindex: true });
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [quotes, setQuotes] = useState<DigloQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadQuotes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${ADMIN_API}/quotes`, { credentials: "same-origin" });
      if (response.status === 401) {
        setAuthenticated(false);
        setQuotes([]);
        return;
      }
      if (!response.ok) throw new Error(await responseError(response));
      const data: DigloQuote[] = await response.json();
      setQuotes(data);
      setAuthenticated(true);
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadQuotes(); }, [loadQuotes]);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${ADMIN_API}/login`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) throw new Error(await responseError(response));
      setAuthenticated(true);
      setPassword("");
      await loadQuotes();
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await fetch(`${ADMIN_API}/logout`, { method: "POST", credentials: "same-origin" });
    } finally {
      setAuthenticated(false);
      setQuotes([]);
      setNotice("");
    }
  };

  const markDone = async (quote: DigloQuote) => {
    setBusyId(quote.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`${ADMIN_API}/quotes/${encodeURIComponent(quote.id)}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Done" }),
      });
      if (!response.ok) throw new Error(await responseError(response));
      const updated: DigloQuote = await response.json();
      setQuotes((current) => current.map((item) => item.id === updated.id ? updated : item));
      setNotice(`${quote.code} marked done.`);
    } catch (reason) {
      setError(errorMessage(reason));
    } finally {
      setBusyId(null);
    }
  };

  const tableCell = "px-3 py-3 text-left align-top text-[13px] text-[#4A4A4A]";
  const tableHead = "whitespace-nowrap px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#4A4A4A]";

  return (
    <main className="diglo-white-theme min-h-[100dvh] bg-white text-black">
      <header className="border-b border-[#E5E5E5] bg-white">
        <div className={`${wrap} flex min-h-16 items-center justify-between gap-3 py-3`}>
          <div className="flex items-center gap-3">
            <Logo />
            <span className="border-l border-[#E5E5E5] pl-3 text-sm font-medium text-[#4A4A4A]">Quote Admin</span>
          </div>
          {authenticated && (
            <button onClick={signOut} className={btnGhost} data-testid="button-admin-signout">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          )}
        </div>
      </header>

      {!authenticated ? (
        <section className="mx-auto grid min-h-[70vh] w-full max-w-[440px] content-center px-[14px] py-10">
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,.06)] sm:p-6">
            <ShieldCheck className="h-6 w-6 text-black" aria-hidden="true" />
            <h1 className="mt-4 text-xl font-bold">Admin sign in</h1>
            <p className="mt-2 text-sm text-[#4A4A4A]">Enter the private Diglo Ventures admin password.</p>
            <form onSubmit={signIn} className="mt-5 space-y-4">
              <label className="block">
                <span className={labelCls}>Admin password</span>
                <input
                  type="password"
                  required
                  maxLength={256}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={inputCls}
                  data-testid="input-admin-password"
                />
              </label>
              {error && <p className="text-sm text-[#F5F5F7]" role="alert">{error}</p>}
              <button type="submit" disabled={loading} className={`${btnDark} w-full`} data-testid="button-admin-signin">
                {loading ? "Checking…" : "Sign in"}
              </button>
            </form>
          </div>
        </section>
      ) : (
        <section className={`${wrap} py-8`}>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">Quotes</h1>
              <p className="mt-1 text-sm text-[#A1A1A6]">{quotes.length} saved quote{quotes.length === 1 ? "" : "s"}</p>
            </div>
            <button onClick={() => void loadQuotes()} disabled={loading} className={btnGhost} data-testid="button-admin-refresh">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>

          {error && <p className="mb-4 rounded-lg border border-[#3A3A3C] bg-[#2D2D2F] p-3 text-sm" role="alert">{error}</p>}
          {notice && <p className="mb-4 rounded-lg border border-[#3A3A3C] bg-[#2D2D2F] p-3 text-sm" role="status">{notice}</p>}

          <div className="overflow-x-auto rounded-xl border border-[#E5E5E5] bg-white">
            <table className="w-full min-w-[680px] border-collapse">
              <thead className="border-b border-[#E5E5E5]">
                <tr>
                  {["Product", "Quantity", "Status", "Date", "Actions"].map((label) => (
                    <th key={label} className={tableHead}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {loading && quotes.length === 0 ? (
                  <tr><td colSpan={5} className={`${tableCell} py-8 text-center text-[#4A4A4A]`}>Loading quotes…</td></tr>
                ) : quotes.length === 0 ? (
                  <tr><td colSpan={5} className={`${tableCell} py-8 text-center text-[#4A4A4A]`}>No quotes saved yet.</td></tr>
                ) : quotes.map((quote) => {
                  const whatsapp = customerWhatsApp(quote);
                  return (
                    <tr key={quote.id} data-testid={`row-quote-${quote.id}`}>
                      <td className={`${tableCell} font-semibold`}>{quote.product || "Legacy quote"}</td>
                      <td className={tableCell}>{quote.quantity.toLocaleString()}</td>
                      <td className={tableCell}>{quote.status}</td>
                      <td className={`${tableCell} whitespace-nowrap`}>{dateText(quote.created_at)}</td>
                      <td className={`${tableCell} whitespace-nowrap`}>
                        {whatsapp && (
                          <a href={whatsapp} target="_blank" rel="noreferrer" className="mr-2 inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#3A3A3C] px-2.5 font-semibold text-white hover:bg-[#242426]" data-testid={`link-quote-whatsapp-${quote.id}`}>
                            <ExternalLink className="h-4 w-4" /> WhatsApp
                          </a>
                        )}
                        <button
                          onClick={() => void markDone(quote)}
                          disabled={quote.status === "Done" || busyId === quote.id}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#2D2D2F] px-2.5 font-semibold text-white disabled:opacity-45"
                          data-testid={`button-quote-done-${quote.id}`}
                        >
                          <Check className="h-4 w-4" /> {quote.status === "Done" ? "Done" : busyId === quote.id ? "Saving…" : "Mark Done"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { AlertTriangle, LogOut, PackagePlus, RefreshCw, Search, ShieldAlert } from "lucide-react";
import {
  supabase, requireSupabase, isAdmin, listLeads, listOrders, updateLeadStatus, updateOrder, createOrderFromLead,
  type Lead, type Order,
} from "@/lib/diglo";
import { useSeo } from "@/lib/seo";
import { Logo } from "@/components/site-shell";
import { btnDark, btnGhost, inputCls, labelCls } from "@/components/tokens";

const STATUSES = ["New", "Contacted", "Quoted", "Paid", "Delivered"];
const STAGES = ["Received", "Designing", "Awaiting Approval", "Printing", "Ready", "Delivered"];
const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong.");
const when = (d: string) => new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

function Notice({ tone = "info", children }: { tone?: "info" | "error"; children: React.ReactNode }) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className="flex items-start gap-3 rounded-xl border border-[#3A3A3C] bg-[#242426] p-4 text-[14px] text-[#F5F5F7]">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> <div>{children}</div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const { error } = await requireSupabase().auth.signInWithPassword({ email: email.trim(), password });
      if (error) setError(error.message);
    } catch (e) { setError(errMsg(e)); } finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block"><span className={labelCls}>Email</span>
        <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} data-testid="input-admin-email" /></label>
      <label className="block"><span className={labelCls}>Password</span>
        <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} data-testid="input-admin-password" /></label>
      {error && <Notice tone="error">{error}</Notice>}
      <button type="submit" disabled={busy} className={`${btnDark} w-full`} data-testid="button-admin-signin">{busy ? "Signing in" : "Sign in"}</button>
      <p className="text-center text-[13px]">Staff access only. Accounts are created by the owner.</p>
    </form>
  );
}

function Pill({ value, onChange, options, testid, disabled }: { value: string; onChange: (v: string) => void; options: string[]; testid: string; disabled?: boolean }) {
  return (
    <select value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} className="h-9 rounded-lg border border-[#3A3A3C] bg-[#2D2D2F] px-2 text-[13px] font-medium text-white outline-none focus:border-[#A1A1A6] disabled:opacity-50" data-testid={testid}>
      {!options.includes(value) && <option value={value}>{value || "-"}</option>}
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}

function Dashboard({ user }: { user: User }) {
  const [tab, setTab] = useState<"leads" | "orders">("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");
  const [busyId, setBusyId] = useState<Lead["id"] | Order["id"] | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const [l, o] = await Promise.all([listLeads(), listOrders()]); setLeads(l); setOrders(o); }
    catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const act = async (id: Lead["id"] | Order["id"], fn: () => Promise<void>, ok: string) => {
    setBusyId(id); setError(""); setFlash("");
    try { await fn(); setFlash(ok); await load(); } catch (e) { setError(errMsg(e)); } finally { setBusyId(null); }
  };

  const match = (r: { ref: string; phone: string; status: string }) => {
    const s = q.trim().toLowerCase();
    return (!s || r.ref.toLowerCase().includes(s) || r.phone.replace(/\s/g, "").includes(s.replace(/\s/g, ""))) && (status === "All" || r.status === status);
  };
  const fLeads = useMemo(() => leads.filter(match), [leads, q, status]); // eslint-disable-line react-hooks/exhaustive-deps
  const fOrders = useMemo(() => orders.filter(match), [orders, q, status]); // eslint-disable-line react-hooks/exhaustive-deps
  const orderRefs = useMemo(() => new Set(orders.map((o) => o.ref)), [orders]);

  const th = "px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-[0.1em] text-[#86868B] whitespace-nowrap";
  const td = "px-4 py-3 align-top text-[14px] text-[#F5F5F7]";

  return (
    <div className="min-h-[100dvh] bg-[#1D1D1F] text-[#F5F5F7]">
      <header className="sticky top-0 z-30 border-b border-[#3A3A3C] bg-[#1D1D1F]">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:h-20 md:px-6">
          <div className="flex items-center gap-3"><Logo /><span className="rounded-full border border-[#3A3A3C] px-2.5 py-0.5 text-[12px] font-semibold">Admin</span></div>
          <div className="flex items-center gap-3">
            <span className="hidden text-[13px] sm:inline">{user.email}</span>
            <button onClick={() => requireSupabase().auth.signOut()} className={btnGhost} data-testid="button-admin-signout"><LogOut className="h-4 w-4" /> Sign out</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex rounded-xl border border-[#3A3A3C] bg-[#2D2D2F] p-1">
            {(["leads", "orders"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`h-9 rounded-lg px-4 text-[14px] font-semibold capitalize transition ${tab === t ? "bg-[#1D1D1F] text-white" : "text-[#A1A1A6] hover:text-white"}`} data-testid={`tab-${t}`}>
                {t} <span className="ml-1 opacity-70">{t === "leads" ? leads.length : orders.length}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ref or phone" className="h-10 w-full rounded-lg border border-[#3A3A3C] bg-[#2D2D2F] pl-9 pr-3 text-[14px] text-white outline-none placeholder:text-[#A1A1A6] focus:border-[#A1A1A6] sm:w-60" data-testid="input-admin-search" /></div>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-lg border border-[#3A3A3C] bg-[#2D2D2F] px-3 text-[14px] text-white outline-none" data-testid="select-admin-status">
              <option>All</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button onClick={load} className={`${btnGhost} !h-10`} data-testid="button-admin-refresh"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {error && <Notice tone="error">{error}</Notice>}
          {flash && <Notice>{flash}</Notice>}
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F]">
          {loading ? (
            <div className="space-y-3 p-6">{[0, 1, 2, 3].map((i) => <div key={i} className="h-10 animate-pulse rounded bg-[#242426]" />)}</div>
          ) : tab === "leads" ? (
            fLeads.length === 0 ? <p className="p-10 text-center text-[15px]">No leads match.</p> : (
              <table className="w-full min-w-[900px]">
                <thead className="border-b border-[#3A3A3C]"><tr><th className={th}>Ref</th><th className={th}>Customer</th><th className={th}>Service</th><th className={th}>Message</th><th className={th}>Created</th><th className={th}>Status</th><th className={th}></th></tr></thead>
                <tbody className="divide-y divide-[#3A3A3C]">
                  {fLeads.map((l) => (
                    <tr key={l.id} className="transition hover:bg-[#242426]" data-testid={`row-lead-${l.id}`}>
                      <td className={`${td} font-semibold whitespace-nowrap`}>{l.ref}</td>
                      <td className={td}><div className="font-medium text-white">{l.name}</div><div className="text-[13px] text-[#A1A1A6]">{l.phone}</div></td>
                      <td className={td}>{l.service}<div className="text-[13px] text-[#A1A1A6]">Qty {l.quantity}</div></td>
                      <td className={`${td} max-w-[240px] text-[13px] text-[#A1A1A6]`}>{l.message || "-"}</td>
                      <td className={`${td} whitespace-nowrap text-[13px]`}>{when(l.created_at)}</td>
                      <td className={td}><Pill value={l.status} options={STATUSES} disabled={busyId === l.id} testid={`select-lead-status-${l.id}`} onChange={(v) => act(l.id, () => updateLeadStatus(l.id, v as Lead["status"]), `${l.ref} marked ${v}.`)} /></td>
                      <td className={td}>
                        {orderRefs.has(l.ref) ? <span className="text-[13px] text-[#A1A1A6]">Order exists</span> : (
                          <button disabled={busyId === l.id} onClick={() => act(l.id, () => createOrderFromLead(l), `Order created from ${l.ref}.`)} className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#1D1D1F] px-3 text-[13px] font-semibold text-white disabled:opacity-50" data-testid={`button-create-order-${l.id}`}>
                            <PackagePlus className="h-4 w-4" /> Create order
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : fOrders.length === 0 ? <p className="p-10 text-center text-[15px]">No orders yet. Create one from a lead.</p> : (
            <table className="w-full min-w-[760px]">
              <thead className="border-b border-[#3A3A3C]"><tr><th className={th}>Ref</th><th className={th}>Phone</th><th className={th}>Service</th><th className={th}>Status</th><th className={th}>Stage</th><th className={th}>Updated</th></tr></thead>
              <tbody className="divide-y divide-[#3A3A3C]">
                {fOrders.map((o) => (
                  <tr key={o.id} className="transition hover:bg-[#242426]" data-testid={`row-order-${o.id}`}>
                    <td className={`${td} font-semibold`}>{o.ref}</td>
                    <td className={td}>{o.phone}</td>
                    <td className={td}>{o.service}</td>
                    <td className={td}><Pill value={o.status} options={STATUSES} disabled={busyId === o.id} testid={`select-order-status-${o.id}`} onChange={(v) => act(o.id, () => updateOrder(o.id, { status: v as Order["status"] }), `${o.ref} status set to ${v}.`)} /></td>
                    <td className={td}><Pill value={o.stage} options={STAGES} disabled={busyId === o.id} testid={`select-order-stage-${o.id}`} onChange={(v) => act(o.id, () => updateOrder(o.id, { stage: v as Order["stage"] }), `${o.ref} moved to ${v}.`)} /></td>
                    <td className={`${td} whitespace-nowrap text-[13px]`}>{when(o.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default function Admin() {
  useSeo({ title: "Admin | Diglo Ventures", path: "/admin", noindex: true });
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    const client = supabase;
    client.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setReady(true); }).catch(() => setReady(true));
    const { data: sub } = client.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (ready && user && isAdmin(user)) return <Dashboard user={user} />;

  return (
    <div className="grid min-h-[100dvh] place-items-center bg-[#1D1D1F] px-4 py-10 text-[#F5F5F7]">
      <div className="w-full max-w-[400px] rounded-2xl border border-[#3A3A3C] bg-[#2D2D2F] p-6 animate-in fade-in zoom-in-95 duration-300 md:p-7">
        <Logo />
        <h1 className="mt-6 text-[24px] font-bold">Admin sign in</h1>
        <div className="mt-6">
          {!ready ? <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-[#242426]" />)}</div>
            : !supabase ? <Notice tone="error">Admin is not configured. Supabase connection settings are missing.</Notice>
            : user ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-xl border border-[#3A3A3C] bg-[#242426] p-4 text-[14px] text-[#F5F5F7]"><ShieldAlert className="h-4 w-4 shrink-0" /> {user.email} does not have admin access.</div>
                <button onClick={() => requireSupabase().auth.signOut()} className={`${btnDark} w-full`} data-testid="button-admin-signout-denied">Sign out</button>
              </div>
            ) : <Login />}
        </div>
      </div>
    </div>
  );
}

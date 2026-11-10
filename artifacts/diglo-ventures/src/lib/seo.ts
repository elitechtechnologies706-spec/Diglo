import { useEffect } from "react";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute("content", content);
}

/** Runtime metadata sync for client-side navigation. Static HTML is produced by scripts/prerender.mjs. */
export function useSeo({ title, description, path, noindex = false }: { title: string; description?: string; path: string; noindex?: boolean }) {
  useEffect(() => {
    document.title = title;
    setMeta("property", "og:title", title);
    setMeta("name", "twitter:title", title);
    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
      setMeta("name", "twitter:description", description);
    }
    const site = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "");
    if (site) setMeta("property", "og:url", site + path);
    const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const prev = robots?.getAttribute("content") ?? null;
    if (noindex) setMeta("name", "robots", "noindex, nofollow");
    return () => { if (noindex && prev !== null) setMeta("name", "robots", prev); };
  }, [title, description, path, noindex]);
}

import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, u as useRouter } from "../_libs/tanstack__react-router.mjs";
import { m as isRedirect } from "../_libs/tanstack__router-core.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { S as SiteNav } from "./site-nav-BmFaWZZW.mjs";
import { u as useAuth } from "./use-auth-Dnv6YYKq.mjs";
import { a as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-CH1Jykwh.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-LE0CZ32P.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "./client-DTwX7J9u.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function useServerFn(serverFn) {
  const router = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router.stores.location.get();
        return router.navigate(router.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const getMindsetMatches = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("51a7de1f6b4128453bcca3bb79867bc7d069c18708ab3e5f046094858802554e"));
function DiscoverPage() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const fetchMatches = useServerFn(getMindsetMatches);
  const [matches, setMatches] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({
        to: "/login"
      });
      return;
    }
    fetchMatches({}).then((data) => setMatches(data)).catch((e) => {
      console.error(e);
      toast.error("Couldn't load matches");
    }).finally(() => setBusy(false));
  }, [user, loading, navigate, fetchMatches]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-5xl mx-auto px-6 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold uppercase tracking-[0.3em] text-brand mb-3", children: "AI mindset matching" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl font-extrabold italic uppercase leading-[0.9]", children: [
          "Find your ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-brand", children: "tribe." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 mt-3 max-w-xl", children: "Ranked by interest overlap + bio similarity. Each match comes with an AI-generated reason to connect." })
      ] }),
      busy && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40", children: "Scanning the network…" }),
      !busy && matches && matches.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-dashed border-white/10 rounded-3xl p-10 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg", children: "No matches yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 mt-2", children: "Be the first to invite ambitious builders. Share MindSync." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-4", children: matches?.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-3xl border border-white/10 bg-white/[0.03] p-6 hover:border-brand/40 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-extrabold italic uppercase", children: m.display_name || m.username }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/40 text-sm", children: [
              "@",
              m.username
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl font-extrabold text-brand", children: m.score }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-white/40", children: "match" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-brand/90 italic mb-3", children: [
          '"',
          m.reason,
          '"'
        ] }),
        m.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/60 mb-4 line-clamp-3", children: m.bio }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: m.interests.slice(0, 5).map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-3 py-1 rounded-full border ${m.overlap.includes(i) ? "bg-brand/15 border-brand/30 text-brand font-bold" : "bg-white/5 border-white/10 text-white/60"}`, children: i }, i)) })
      ] }, m.id)) })
    ] })
  ] });
}
export {
  DiscoverPage as component
};

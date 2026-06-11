import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as SiteNav } from "./site-nav-BmFaWZZW.mjs";
import { u as useAuth } from "./use-auth-Dnv6YYKq.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
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
const heroGlow = "/assets/hero-glow-yA53dDEM.jpg";
const streaks = [{
  name: "Coding",
  color: "var(--streak-coding)"
}, {
  name: "Reading",
  color: "var(--streak-reading)"
}, {
  name: "Startup",
  color: "var(--streak-startup)"
}, {
  name: "AI / Data",
  color: "var(--streak-ai)"
}, {
  name: "Interview",
  color: "var(--streak-interview)"
}, {
  name: "Fitness",
  color: "var(--streak-fitness)"
}];
function Landing() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!loading && user) {
      navigate({
        to: "/circles"
      });
    }
  }, [user, loading, navigate]);
  if (loading || user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col items-center justify-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-10 h-10 border-4 border-white/20 border-t-brand animate-spin rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-sm font-semibold tracking-wider uppercase", children: "Loading..." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground selection:bg-brand selection:text-black", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "relative overflow-hidden pt-20 pb-24 px-6 max-w-6xl mx-auto text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroGlow, alt: "", width: 1536, height: 1024, className: "pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto w-full max-w-5xl opacity-40 mix-blend-screen" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-brand animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold tracking-wide uppercase opacity-70", children: "The new social for builders" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.9] tracking-tighter mb-8 italic", children: [
        "GROWTH IS ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-brand", children: "ADDICTIVE." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-xl mx-auto text-lg text-white/60 mb-10", children: "Stop scrolling, start shipping. The first social network built on proof-based progress, deep accountability, and mindset matching." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", className: "w-full sm:w-auto px-8 py-4 bg-brand text-black font-extrabold rounded-2xl hover:scale-105 transition-transform", children: "START YOUR STREAK" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors", children: "I HAVE AN ACCOUNT" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-6 py-20 max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold mb-2 uppercase italic tracking-tight", children: "6 Dimensions of Growth" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40", children: "Categorize your daily wins and build multi-dimensional momentum." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4", children: streaks.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 rounded-3xl border border-white/10 flex flex-col items-center gap-4 transition hover:-translate-y-1", style: {
        backgroundColor: `color-mix(in oklab, ${s.color} 10%, transparent)`
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-2xl", style: {
          backgroundColor: s.color,
          boxShadow: `0 0 24px ${s.color}80`
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm tracking-widest uppercase", children: s.name })
      ] }, s.name)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "px-6 py-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-8 bg-white/5 rounded-[40px] p-10 border border-white/10 relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-4xl font-extrabold italic mb-4 uppercase", children: "Mindset Matching" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-lg max-w-md", children: "Our algorithm doesn't track interests. It tracks intensity. Match with people operating at your same frequency." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex -space-x-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 rounded-full border-4 border-background bg-zinc-800" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 rounded-full border-4 border-background bg-zinc-700" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 rounded-full border-4 border-background bg-zinc-600" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 rounded-full border-4 border-background bg-brand/80 grid place-items-center text-black font-bold text-xs", children: "+400" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-0 bottom-0 opacity-20 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-96 h-96 bg-brand/20 blur-[100px] rounded-full" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-4 bg-card rounded-[40px] overflow-hidden border border-white/10 flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full aspect-[3/4] bg-gradient-to-br from-brand/30 via-streak-ai/20 to-streak-interview/30 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium uppercase tracking-[0.15em] text-white/40", children: "Creator Story" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xl font-bold", children: "Alex Rivers" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40 uppercase tracking-widest", children: "Serial Founder • SF" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-1 bg-brand rounded-full text-black font-extrabold text-xs", children: "42 DAY STREAK" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 flex-1 rounded-full", style: {
              background: "var(--brand)"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 flex-1 rounded-full", style: {
              background: "var(--streak-coding)"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 flex-1 rounded-full", style: {
              background: "var(--streak-fitness)"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 flex-1 bg-white/20 rounded-full" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-6 py-20 bg-brand text-black", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:w-1/2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-5xl md:text-7xl font-extrabold italic uppercase leading-[0.8] mb-8", children: [
          "PROOF OVER ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "PROMISES."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureRow, { title: "Proof-Based Posts", body: "Every status update requires a tangible artifact of progress — a commit, a screenshot, a certificate." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureRow, { title: "Future Vault", body: "Lock messages for your future self. Only unlocks when you hit your milestones." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureRow, { title: "Accountability Partners", body: "Pair with someone chasing the same goal. Weekly check-ins, real momentum." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FeatureRow, { title: "Startup Idea Drops", body: "Post an idea. Find collaborators. Get voted into reality." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:w-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full aspect-square bg-black rounded-3xl p-10 flex flex-col justify-between text-brand", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.3em] opacity-60", children: "Vault.unlock" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-7xl font-extrabold italic", children: "2027" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-white/50 text-sm", children: '"Did you ship the thing?"' })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [...Array(12)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 flex-1 rounded-full bg-brand/30" }, i)) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-6 py-32 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl font-extrabold italic uppercase mb-6", children: "Ready to upgrade your social circle?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 mb-10 text-lg", children: "Join the ambitious tracking their journey to the top." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", className: "inline-block px-10 py-4 bg-brand text-black font-extrabold rounded-2xl hover:scale-105 transition-transform", children: "CLAIM YOUR HANDLE" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "px-6 py-12 border-t border-white/10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-white/30 uppercase tracking-[0.2em]", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " MINDSYNC PLATFORM • ALL SYSTEMS OPERATIONAL"
    ] }) })
  ] });
}
function FeatureRow({
  title,
  body
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-6 mt-1 flex-shrink-0 bg-black rounded-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-xl uppercase", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "opacity-70", children: body })
    ] })
  ] });
}
export {
  Landing as component
};

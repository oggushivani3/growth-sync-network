import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-DTwX7J9u.mjs";
import { u as useAuth } from "./use-auth-Dnv6YYKq.mjs";
import { S as SiteNav } from "./site-nav-BmFaWZZW.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const STREAK_DEFS = [{
  key: "Coding",
  color: "var(--streak-coding)"
}, {
  key: "Reading",
  color: "var(--streak-reading)"
}, {
  key: "Startup",
  color: "var(--streak-startup)"
}, {
  key: "AI",
  color: "var(--streak-ai)"
}, {
  key: "Interview",
  color: "var(--streak-interview)"
}, {
  key: "Fitness",
  color: "var(--streak-fitness)"
}];
function ProfilePage() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = reactExports.useState(null);
  const [fetching, setFetching] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({
        to: "/login"
      });
      return;
    }
    (async () => {
      const {
        data,
        error
      } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (error) toast.error(error.message);
      if (data && !data.onboarded) {
        navigate({
          to: "/onboarding"
        });
        return;
      }
      setProfile(data);
      setFetching(false);
    })();
  }, [user, loading, navigate]);
  async function signOut() {
    await supabase.auth.signOut();
    navigate({
      to: "/"
    });
  }
  if (loading || fetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background grid place-items-center text-white/50", children: "Loading…" });
  }
  if (!profile) return null;
  const initials = (profile.display_name || profile.username || "U").slice(0, 2).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiteNav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "max-w-5xl mx-auto px-6 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start gap-6 mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-28 rounded-full bg-gradient-to-br from-brand via-streak-interview to-streak-ai grid place-items-center text-3xl font-extrabold text-black", children: initials }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-extrabold italic uppercase", children: profile.display_name || profile.username }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/40 mt-1", children: [
            "@",
            profile.username
          ] }),
          profile.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-white/70 max-w-xl", children: profile.bio }),
          profile.career_goal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 inline-flex items-center gap-2 bg-brand/10 border border-brand/20 px-4 py-2 rounded-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-brand" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-brand", children: profile.career_goal })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: signOut, className: "px-5 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold hover:bg-white/10", children: "Sign out" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-4", children: "Your streaks" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3", children: STREAK_DEFS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 rounded-2xl border border-white/10 flex flex-col items-center gap-3", style: {
          backgroundColor: `color-mix(in oklab, ${s.color} 8%, transparent)`
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-xl", style: {
            backgroundColor: s.color,
            boxShadow: `0 0 18px ${s.color}80`
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold tracking-widest uppercase", children: s.key }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl font-extrabold", children: "0" })
        ] }, s.key)) })
      ] }),
      profile.interests.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-4", children: "Mindset" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: profile.interests.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-semibold", children: i }, i)) })
      ] }),
      profile.skills.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-4", children: "Skills" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: profile.skills.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-4 py-2 rounded-full bg-brand/10 border border-brand/20 text-sm font-semibold text-brand", children: s }, s)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-dashed border-white/10 rounded-3xl p-10 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-sm uppercase tracking-widest mb-2", children: "Coming next" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold", children: "Feed · Stories · Growth Circles · Future Vault" })
      ] })
    ] })
  ] });
}
export {
  ProfilePage as component
};

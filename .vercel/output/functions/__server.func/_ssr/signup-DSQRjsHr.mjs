import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link, d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-DTwX7J9u.mjs";
import { u as useAuth } from "./use-auth-Dnv6YYKq.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
const schema = objectType({
  displayName: stringType().trim().min(2, "At least 2 characters").max(60),
  email: stringType().trim().email("Invalid email").max(255),
  password: stringType().min(8, "Min 8 characters").max(72)
});
function SignupPage() {
  const navigate = useNavigate();
  const {
    user,
    loading
  } = useAuth();
  const [submitting, setSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!loading && user) navigate({
      to: "/onboarding"
    });
  }, [user, loading, navigate]);
  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      displayName: fd.get("displayName"),
      email: fd.get("email"),
      password: fd.get("password")
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const {
      error
    } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
        data: {
          display_name: parsed.data.displayName
        }
      }
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome to MindSync!");
    navigate({
      to: "/onboarding"
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthShell, { title: "Start your streak", subtitle: "Create your account in 30 seconds.", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { name: "displayName", label: "Display name", placeholder: "Alex Rivers" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { name: "email", label: "Email", type: "email", placeholder: "you@growth.com" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { name: "password", label: "Password", type: "password", placeholder: "Min 8 characters" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: submitting, className: "w-full px-6 py-4 bg-brand text-black font-extrabold rounded-2xl hover:scale-[1.02] transition-transform disabled:opacity-60", children: submitting ? "CREATING..." : "CREATE ACCOUNT" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-white/50 text-center mt-6", children: [
      "Already have one?",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-brand font-bold", children: "Login" })
    ] })
  ] });
}
function Field({
  name,
  label,
  type = "text",
  placeholder
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-white/50 mb-2 block", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name, type, placeholder, required: true, className: "w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand transition-colors text-white placeholder:text-white/30" })
  ] });
}
function AuthShell({
  title,
  subtitle,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground grid lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex flex-col justify-between p-12 bg-brand text-black", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 bg-black rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-4 bg-brand rounded-sm rotate-45" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-extrabold tracking-tight", children: "MINDSYNC" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-6xl font-extrabold italic uppercase leading-[0.85]", children: [
          "Proof over ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "promises."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-md text-black/70", children: "Join builders shipping every day. No vanity metrics, just streaks that mean something." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] opacity-60", children: "All systems operational" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-6 lg:p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "lg:hidden flex items-center gap-2 mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 bg-brand rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-4 bg-black rounded-sm rotate-45" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-extrabold tracking-tight", children: "MINDSYNC" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-extrabold italic uppercase mb-2", children: title }),
      subtitle ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 mb-8", children: subtitle }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8" }),
      children
    ] }) })
  ] });
}
export {
  AuthShell,
  SignupPage as component
};

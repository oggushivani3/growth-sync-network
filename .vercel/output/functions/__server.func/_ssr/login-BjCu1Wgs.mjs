import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-DTwX7J9u.mjs";
import { u as useAuth } from "./use-auth-Dnv6YYKq.mjs";
import { A as AuthShell } from "./router-DASSJNse.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
const schema = objectType({
  email: stringType().trim().email().max(255),
  password: stringType().min(1).max(72)
});
function LoginPage() {
  const navigate = useNavigate();
  const {
    user,
    loading
  } = useAuth();
  const [submitting, setSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!loading && user) navigate({
      to: "/profile"
    });
  }, [user, loading, navigate]);
  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
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
    } = await supabase.auth.signInWithPassword(parsed.data);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back");
    navigate({
      to: "/profile"
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthShell, { title: "Welcome back", subtitle: "Pick up your streak where you left it.", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-white/50 mb-2 block", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "email", type: "email", required: true, placeholder: "you@growth.com", className: "w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand transition-colors" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-white/50 mb-2 block", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "password", type: "password", required: true, placeholder: "••••••••", className: "w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand transition-colors" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: submitting, className: "w-full px-6 py-4 bg-brand text-black font-extrabold rounded-2xl hover:scale-[1.02] transition-transform disabled:opacity-60", children: submitting ? "SIGNING IN..." : "SIGN IN" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-white/50 text-center mt-6", children: [
      "New here?",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", className: "text-brand font-bold", children: "Create an account" })
    ] })
  ] });
}
export {
  LoginPage as component
};

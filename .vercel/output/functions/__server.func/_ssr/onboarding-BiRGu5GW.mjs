import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-DTwX7J9u.mjs";
import { u as useAuth } from "./use-auth-Dnv6YYKq.mjs";
import { I as INTERESTS } from "./interests-DOXyJ8Wz.mjs";
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
function Onboarding() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = reactExports.useState(0);
  const [username, setUsername] = reactExports.useState("");
  const [bio, setBio] = reactExports.useState("");
  const [goal, setGoal] = reactExports.useState("");
  const [interests, setInterests] = reactExports.useState([]);
  const [skills, setSkills] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!loading && !user) navigate({
      to: "/login"
    });
  }, [user, loading, navigate]);
  function toggleInterest(i) {
    setInterests((cur) => cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]);
  }
  async function finish() {
    if (!user) return;
    if (username.trim().length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    if (interests.length < 2) {
      toast.error("Pick at least 2 interests for mindset matching");
      return;
    }
    setSaving(true);
    const {
      error
    } = await supabase.from("profiles").update({
      username: username.trim().toLowerCase(),
      bio: bio.trim() || null,
      career_goal: goal.trim() || null,
      interests,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      onboarded: true
    }).eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile ready. Time to ship.");
    navigate({
      to: "/profile"
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background px-6 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-12", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1 flex-1 rounded-full transition ${i <= step ? "bg-brand" : "bg-white/10"}` }, i)) }),
    step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Claim your handle", subtitle: "Your unique identifier on MindSync.", onNext: () => {
      if (username.trim().length < 3) return toast.error("Min 3 characters");
      setStep(1);
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-white/50 mb-2 block", children: "Username" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus-within:border-brand", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/40 mr-1", children: "@" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: username, onChange: (e) => setUsername(e.target.value.replace(/[^a-z0-9_]/gi, "")), placeholder: "alex_ships", maxLength: 30, className: "flex-1 bg-transparent focus:outline-none" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-white/50 mb-2 block", children: "Bio (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: bio, onChange: (e) => setBio(e.target.value.slice(0, 160)), placeholder: "Building in public. Coffee, code, repeat.", rows: 3, className: "w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand resize-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-white/30 mt-1 block text-right", children: [
          bio.length,
          "/160"
        ] })
      ] })
    ] }),
    step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Mindset Matching", subtitle: "Pick what you're chasing. We'll match you with people moving at your frequency.", onBack: () => setStep(0), onNext: () => {
      if (interests.length < 2) return toast.error("Pick at least 2");
      setStep(2);
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: INTERESTS.map((i) => {
        const on = interests.includes(i);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => toggleInterest(i), className: `px-4 py-2 rounded-full border text-sm font-semibold transition ${on ? "bg-brand text-black border-brand" : "bg-white/5 border-white/10 hover:border-white/30"}`, children: i }, i);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-white/40 mt-4", children: [
        interests.length,
        " selected"
      ] })
    ] }),
    step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "What are you building toward?", subtitle: "Set the north star. You can change it anytime.", onBack: () => setStep(1), onNext: finish, nextLabel: saving ? "SAVING..." : "ENTER MINDSYNC", disabled: saving, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-white/50 mb-2 block", children: "Career goal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: goal, onChange: (e) => setGoal(e.target.value.slice(0, 120)), placeholder: "Land my first FAANG offer by Dec 2026", className: "w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-white/50 mb-2 block", children: "Skills (comma separated)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: skills, onChange: (e) => setSkills(e.target.value), placeholder: "React, Python, System Design", className: "w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand" })
      ] })
    ] })
  ] }) });
}
function Section({
  title,
  subtitle,
  children,
  onBack,
  onNext,
  nextLabel = "CONTINUE",
  disabled
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl md:text-5xl font-extrabold italic uppercase mb-3", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 mb-8", children: subtitle }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-5", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex gap-3", children: [
      onBack && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onBack, className: "px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10", children: "BACK" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onNext, disabled, className: "flex-1 px-6 py-3.5 bg-brand text-black font-extrabold rounded-2xl hover:scale-[1.02] transition-transform disabled:opacity-60", children: nextLabel })
    ] })
  ] });
}
export {
  Onboarding as component
};

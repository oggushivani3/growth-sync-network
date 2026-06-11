import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./use-auth-Dnv6YYKq.mjs";
function SiteNav() {
  const { user } = useAuth();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-background/80 px-6 py-4 backdrop-blur-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 bg-brand rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-4 bg-black rounded-sm rotate-45" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-extrabold tracking-tight", children: "MINDSYNC" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4 md:gap-6", children: user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/discover", className: "hidden sm:inline text-sm font-medium hover:text-brand transition-colors", children: "Discover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/circles", className: "hidden sm:inline text-sm font-medium hover:text-brand transition-colors", children: "Circles" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/profile",
          className: "px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-brand transition",
          children: "My Profile"
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hidden sm:inline text-sm font-medium hover:text-brand transition-colors", children: "Manifesto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-sm font-medium hover:text-brand transition-colors", children: "Login" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/signup",
          className: "px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-brand transition",
          children: "Join Platform"
        }
      )
    ] }) })
  ] });
}
export {
  SiteNav as S
};

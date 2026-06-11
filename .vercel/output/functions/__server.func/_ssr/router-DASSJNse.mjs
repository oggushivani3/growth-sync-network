import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster } from "../_libs/sonner.mjs";
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
const appCss = "/assets/styles-D0pqvDdv.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-extrabold text-brand", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-full bg-brand px-5 py-2 text-sm font-bold text-black transition hover:scale-[1.02]",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong. Try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "rounded-full bg-brand px-5 py-2 text-sm font-bold text-black",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "rounded-full border border-white/10 px-5 py-2 text-sm font-medium", children: "Go home" })
    ] })
  ] }) });
}
const Route$8 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MindSync — Growth is addictive" },
      {
        name: "description",
        content: "The social network for ambitious builders. Track growth streaks, share proof of work, find your mindset match."
      },
      { property: "og:title", content: "MindSync — Growth is addictive" },
      { property: "og:description", content: "Stop scrolling, start shipping. Proof-based social for builders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ],
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$8.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { theme: "dark", position: "top-center", richColors: true })
  ] });
}
const $$splitComponentImporter$7 = () => import("./signup-DSQRjsHr.mjs");
const Route$7 = createFileRoute("/signup")({
  head: () => ({
    meta: [{
      title: "Join MindSync"
    }, {
      name: "description",
      content: "Create your MindSync account and start your growth streak."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
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
const $$splitComponentImporter$6 = () => import("./profile-BbHVcNcw.mjs");
const Route$6 = createFileRoute("/profile")({
  head: () => ({
    meta: [{
      title: "Profile — MindSync"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./onboarding-BiRGu5GW.mjs");
const Route$5 = createFileRoute("/onboarding")({
  head: () => ({
    meta: [{
      title: "Onboarding — MindSync"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./login-BjCu1Wgs.mjs");
const Route$4 = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Login — MindSync"
    }, {
      name: "description",
      content: "Sign in to your MindSync account."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./discover-gKSQNjHB.mjs");
const Route$3 = createFileRoute("/discover")({
  head: () => ({
    meta: [{
      title: "Discover — MindSync"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./index-D2HyVZdw.mjs");
const Route$2 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "MindSync — Growth is addictive"
    }, {
      name: "description",
      content: "The social network for ambitious builders. Track growth streaks, share proof of work, find your mindset match."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./circles.index-B4TJddMc.mjs");
const Route$1 = createFileRoute("/circles/")({
  head: () => ({
    meta: [{
      title: "Circles — MindSync"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./circles._id-BY3xM8JB.mjs");
const Route = createFileRoute("/circles/$id")({
  head: () => ({
    meta: [{
      title: "Circle — MindSync"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SignupRoute = Route$7.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$8
});
const ProfileRoute = Route$6.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => Route$8
});
const OnboardingRoute = Route$5.update({
  id: "/onboarding",
  path: "/onboarding",
  getParentRoute: () => Route$8
});
const LoginRoute = Route$4.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$8
});
const DiscoverRoute = Route$3.update({
  id: "/discover",
  path: "/discover",
  getParentRoute: () => Route$8
});
const IndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$8
});
const CirclesIndexRoute = Route$1.update({
  id: "/circles/",
  path: "/circles/",
  getParentRoute: () => Route$8
});
const CirclesIdRoute = Route.update({
  id: "/circles/$id",
  path: "/circles/$id",
  getParentRoute: () => Route$8
});
const rootRouteChildren = {
  IndexRoute,
  DiscoverRoute,
  LoginRoute,
  OnboardingRoute,
  ProfileRoute,
  SignupRoute,
  CirclesIdRoute,
  CirclesIndexRoute
};
const routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  AuthShell as A,
  Route as R,
  router as r
};

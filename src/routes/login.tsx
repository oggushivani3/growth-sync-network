import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AuthShell } from "./signup";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — MindSync" },
      { name: "description", content: "Sign in to your MindSync account." },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(72),
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/profile" });
  }, [user, loading, navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      email: fd.get("email"),
      password: fd.get("password"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back");
    navigate({ to: "/profile" });
  }

  return (
    <AuthShell title="Welcome back" subtitle="Pick up your streak where you left it.">
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2 block">Email</span>
          <input
            name="email" type="email" required placeholder="you@growth.com"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand transition-colors"
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2 block">Password</span>
          <input
            name="password" type="password" required placeholder="••••••••"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand transition-colors"
          />
        </label>
        <button
          disabled={submitting}
          className="w-full px-6 py-4 bg-brand text-black font-extrabold rounded-2xl hover:scale-[1.02] transition-transform disabled:opacity-60"
        >
          {submitting ? "SIGNING IN..." : "SIGN IN"}
        </button>
      </form>
      <p className="text-sm text-white/50 text-center mt-6">
        New here?{" "}
        <Link to="/signup" className="text-brand font-bold">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

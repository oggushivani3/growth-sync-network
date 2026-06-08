import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Join MindSync" },
      { name: "description", content: "Create your MindSync account and start your growth streak." },
    ],
  }),
  component: SignupPage,
});

const schema = z.object({
  displayName: z.string().trim().min(2, "At least 2 characters").max(60),
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "Min 8 characters").max(72),
});

function SignupPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/onboarding" });
  }, [user, loading, navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      displayName: fd.get("displayName"),
      email: fd.get("email"),
      password: fd.get("password"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
        data: { display_name: parsed.data.displayName },
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome to MindSync!");
    navigate({ to: "/onboarding" });
  }

  return (
    <AuthShell title="Start your streak" subtitle="Create your account in 30 seconds.">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field name="displayName" label="Display name" placeholder="Alex Rivers" />
        <Field name="email" label="Email" type="email" placeholder="you@growth.com" />
        <Field name="password" label="Password" type="password" placeholder="Min 8 characters" />
        <button
          disabled={submitting}
          className="w-full px-6 py-4 bg-brand text-black font-extrabold rounded-2xl hover:scale-[1.02] transition-transform disabled:opacity-60"
        >
          {submitting ? "CREATING..." : "CREATE ACCOUNT"}
        </button>
      </form>
      <p className="text-sm text-white/50 text-center mt-6">
        Already have one?{" "}
        <Link to="/login" className="text-brand font-bold">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}

function Field({
  name, label, type = "text", placeholder,
}: { name: string; label: string; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2 block">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand transition-colors text-white placeholder:text-white/30"
      />
    </label>
  );
}

export function AuthShell({
  title, subtitle, children,
}: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-brand text-black">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 bg-black rounded-lg flex items-center justify-center">
            <div className="size-4 bg-brand rounded-sm rotate-45" />
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight">MINDSYNC</span>
        </Link>
        <div>
          <h2 className="font-display text-6xl font-extrabold italic uppercase leading-[0.85]">
            Proof over <br />promises.
          </h2>
          <p className="mt-6 max-w-md text-black/70">
            Join builders shipping every day. No vanity metrics, just streaks that mean something.
          </p>
        </div>
        <p className="text-xs uppercase tracking-[0.3em] opacity-60">All systems operational</p>
      </div>
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-10">
            <div className="size-8 bg-brand rounded-lg flex items-center justify-center">
              <div className="size-4 bg-black rounded-sm rotate-45" />
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight">MINDSYNC</span>
          </Link>
          <h1 className="font-display text-4xl font-extrabold italic uppercase mb-2">{title}</h1>
          {subtitle ? <p className="text-white/50 mb-8">{subtitle}</p> : <div className="mb-8" />}
          {children}
        </div>
      </div>
    </div>
  );
}

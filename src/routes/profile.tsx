import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { SiteNav } from "@/components/site-nav";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [{ title: "Profile — MindSync" }],
  }),
  component: ProfilePage,
});

type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  career_goal: string | null;
  interests: string[];
  skills: string[];
  onboarded: boolean;
};

const STREAK_DEFS = [
  { key: "Coding", color: "var(--streak-coding)" },
  { key: "Reading", color: "var(--streak-reading)" },
  { key: "Startup", color: "var(--streak-startup)" },
  { key: "AI", color: "var(--streak-ai)" },
  { key: "Interview", color: "var(--streak-interview)" },
  { key: "Fitness", color: "var(--streak-fitness)" },
];

function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (error) toast.error(error.message);
      if (data && !data.onboarded) {
        navigate({ to: "/onboarding" });
        return;
      }
      setProfile(data as Profile | null);
      setFetching(false);
    })();
  }, [user, loading, navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-background grid place-items-center text-white/50">Loading…</div>
    );
  }

  if (!profile) return null;
  const initials = (profile.display_name || profile.username || "U").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-10">
          <div className="size-28 rounded-full bg-gradient-to-br from-brand via-streak-interview to-streak-ai grid place-items-center text-3xl font-extrabold text-black">
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-4xl font-extrabold italic uppercase">
              {profile.display_name || profile.username}
            </h1>
            <p className="text-white/40 mt-1">@{profile.username}</p>
            {profile.bio && <p className="mt-4 text-white/70 max-w-xl">{profile.bio}</p>}
            {profile.career_goal && (
              <div className="mt-4 inline-flex items-center gap-2 bg-brand/10 border border-brand/20 px-4 py-2 rounded-full">
                <span className="size-2 rounded-full bg-brand" />
                <span className="text-sm font-semibold text-brand">{profile.career_goal}</span>
              </div>
            )}
          </div>
          <button
            onClick={signOut}
            className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold hover:bg-white/10"
          >
            Sign out
          </button>
        </div>

        {/* Streaks */}
        <section className="mb-12">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-4">
            Your streaks
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {STREAK_DEFS.map((s) => (
              <div
                key={s.key}
                className="p-5 rounded-2xl border border-white/10 flex flex-col items-center gap-3"
                style={{ backgroundColor: `color-mix(in oklab, ${s.color} 8%, transparent)` }}
              >
                <div
                  className="size-10 rounded-xl"
                  style={{ backgroundColor: s.color, boxShadow: `0 0 18px ${s.color}80` }}
                />
                <span className="text-[10px] font-bold tracking-widest uppercase">{s.key}</span>
                <span className="font-display text-2xl font-extrabold">0</span>
              </div>
            ))}
          </div>
        </section>

        {/* Interests */}
        {profile.interests.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-4">
              Mindset
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((i) => (
                <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-semibold">
                  {i}
                </span>
              ))}
            </div>
          </section>
        )}

        {profile.skills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s) => (
                <span key={s} className="px-4 py-2 rounded-full bg-brand/10 border border-brand/20 text-sm font-semibold text-brand">
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        <div className="border border-dashed border-white/10 rounded-3xl p-10 text-center">
          <p className="text-white/40 text-sm uppercase tracking-widest mb-2">Coming next</p>
          <p className="text-xl font-bold">Feed · Stories · Growth Circles · Future Vault</p>
        </div>
      </main>
    </div>
  );
}

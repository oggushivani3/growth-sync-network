import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteNav } from "@/components/site-nav";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/circles/$id")({
  head: () => ({ meta: [{ title: "Circle — MindSync" }] }),
  component: CircleDetailPage,
});

type Circle = {
  id: string;
  name: string;
  description: string | null;
  interest_tag: string;
  owner_id: string;
};

type Member = {
  user_id: string;
  current_streak: number;
  last_checkin_date: string | null;
  profile: { display_name: string | null; username: string | null } | null;
};

type Checkin = {
  id: string;
  user_id: string;
  note: string | null;
  checkin_date: string;
  created_at: string;
  profile: { display_name: string | null; username: string | null } | null;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function CircleDetailPage() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [circle, setCircle] = useState<Circle | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(true);
  const [posting, setPosting] = useState(false);

  const isMember = !!user && members.some((m) => m.user_id === user.id);
  const checkedInToday =
    !!user && checkins.some((c) => c.user_id === user.id && c.checkin_date === today());

  async function load() {
    setBusy(true);
    const [c, m, k] = await Promise.all([
      supabase.from("circles").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("circle_members")
        .select("user_id, current_streak, last_checkin_date, profile:profiles(display_name, username)")
        .eq("circle_id", id),
      supabase
        .from("circle_checkins")
        .select("id, user_id, note, checkin_date, created_at, profile:profiles(display_name, username)")
        .eq("circle_id", id)
        .order("created_at", { ascending: false })
        .limit(30),
    ]);
    setCircle((c.data as Circle | null) ?? null);
    setMembers((m.data as unknown as Member[]) ?? []);
    setCheckins((k.data as unknown as Checkin[]) ?? []);
    setBusy(false);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, id]);

  async function join() {
    if (!user) return;
    const { error } = await supabase.from("circle_members").insert({ circle_id: id, user_id: user.id });
    if (error) toast.error(error.message);
    else load();
  }

  async function checkIn() {
    if (!user) return;
    setPosting(true);
    const t = today();
    const { error } = await supabase
      .from("circle_checkins")
      .insert({ circle_id: id, user_id: user.id, note: note || null, checkin_date: t });
    if (error) {
      toast.error(error.message);
      setPosting(false);
      return;
    }
    // Update streak: if last_checkin_date was yesterday, +1; if today already, no-op; else reset to 1.
    const me = members.find((m) => m.user_id === user.id);
    let newStreak = 1;
    if (me?.last_checkin_date) {
      const last = new Date(me.last_checkin_date);
      const diff = Math.round((new Date(t).getTime() - last.getTime()) / 86400000);
      if (diff === 1) newStreak = (me.current_streak ?? 0) + 1;
      else if (diff === 0) newStreak = me.current_streak ?? 1;
    }
    await supabase
      .from("circle_members")
      .update({ current_streak: newStreak, last_checkin_date: t })
      .eq("circle_id", id)
      .eq("user_id", user.id);
    toast.success(`Streak: ${newStreak} day${newStreak === 1 ? "" : "s"} 🔥`);
    setNote("");
    setPosting(false);
    load();
  }

  if (busy) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNav />
        <main className="max-w-4xl mx-auto px-6 py-12 text-white/40">Loading…</main>
      </div>
    );
  }
  if (!circle) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNav />
        <main className="max-w-4xl mx-auto px-6 py-12">
          <p>Circle not found.</p>
          <Link to="/circles" className="text-brand font-bold">
            Back to circles
          </Link>
        </main>
      </div>
    );
  }

  const totalStreak = members.reduce((a, m) => a + (m.current_streak ?? 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/circles" className="text-xs text-white/40 hover:text-brand uppercase tracking-widest">
          ← All circles
        </Link>
        <header className="mt-4 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-brand/15 text-brand border border-brand/30">
            {circle.interest_tag}
          </span>
          <h1 className="font-display text-5xl font-extrabold italic uppercase leading-[0.9] mt-4">
            {circle.name}
          </h1>
          {circle.description && <p className="text-white/60 mt-3 max-w-xl">{circle.description}</p>}
          <div className="mt-6 flex items-center gap-6 flex-wrap">
            <div>
              <div className="font-display text-3xl font-extrabold text-brand">{totalStreak}</div>
              <div className="text-[10px] uppercase tracking-widest text-white/40">circle streak</div>
            </div>
            <div>
              <div className="font-display text-3xl font-extrabold">{members.length}</div>
              <div className="text-[10px] uppercase tracking-widest text-white/40">members</div>
            </div>
            {!isMember && (
              <button
                onClick={join}
                className="px-5 py-3 bg-brand text-black font-extrabold rounded-2xl hover:scale-[1.02] transition"
              >
                Join circle
              </button>
            )}
          </div>
        </header>

        {isMember && (
          <section className="mb-12 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-3">
              Today's check-in
            </h2>
            {checkedInToday ? (
              <p className="text-brand font-bold">✓ You've checked in today. Keep the streak alive tomorrow.</p>
            ) : (
              <div className="flex gap-3 flex-wrap">
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={140}
                  placeholder="What did you ship today? (optional)"
                  className="flex-1 min-w-[200px] bg-white/5 border border-white/10 rounded-2xl px-5 py-3 focus:outline-none focus:border-brand"
                />
                <button
                  disabled={posting}
                  onClick={checkIn}
                  className="px-6 py-3 bg-brand text-black font-extrabold rounded-2xl disabled:opacity-60"
                >
                  {posting ? "…" : "Check in 🔥"}
                </button>
              </div>
            )}
          </section>
        )}

        <section className="mb-12">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-4">Members</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {members.map((m) => (
              <div
                key={m.user_id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold">{m.profile?.display_name || m.profile?.username || "Builder"}</p>
                  <p className="text-xs text-white/40">@{m.profile?.username ?? "—"}</p>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl font-extrabold text-brand">{m.current_streak}</div>
                  <div className="text-[9px] uppercase tracking-widest text-white/40">streak</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-4">Recent check-ins</h2>
          {checkins.length === 0 ? (
            <p className="text-white/40 text-sm">Nothing yet. Be first to check in.</p>
          ) : (
            <ul className="space-y-2">
              {checkins.map((c) => (
                <li key={c.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between text-xs text-white/40 mb-1">
                    <span className="font-bold text-white/80">
                      {c.profile?.display_name || c.profile?.username || "Builder"}
                    </span>
                    <span>{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  {c.note ? (
                    <p className="text-sm text-white/80">{c.note}</p>
                  ) : (
                    <p className="text-sm text-white/40 italic">Checked in 🔥</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

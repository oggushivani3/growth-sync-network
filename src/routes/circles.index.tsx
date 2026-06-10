import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { SiteNav } from "@/components/site-nav";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { INTERESTS } from "@/lib/interests";

export const Route = createFileRoute("/circles/")({
  head: () => ({ meta: [{ title: "Circles — MindSync" }] }),
  component: CirclesPage,
});

// ── Same theme map as circle detail page ─────────────────────────────────────
type Theme = {
  primary: string;
  glow: string;
  badge: string;
  border: string;
  fire: string; // emoji or symbol
};

const THEME_MAP: Record<string, Theme> = {
  Coding:                 { primary: "#22c55e", glow: "rgba(34,197,94,0.12)",   badge: "rgba(34,197,94,0.15)",   border: "rgba(34,197,94,0.40)",   fire: "🟢" },
  AI:                     { primary: "#6366f1", glow: "rgba(99,102,241,0.12)",  badge: "rgba(99,102,241,0.15)",  border: "rgba(99,102,241,0.40)",  fire: "🟣" },
  "Data Science":         { primary: "#06b6d4", glow: "rgba(6,182,212,0.12)",   badge: "rgba(6,182,212,0.15)",   border: "rgba(6,182,212,0.40)",   fire: "🔵" },
  Startups:               { primary: "#f97316", glow: "rgba(249,115,22,0.12)",  badge: "rgba(249,115,22,0.15)",  border: "rgba(249,115,22,0.40)",  fire: "🟠" },
  Entrepreneurship:       { primary: "#eab308", glow: "rgba(234,179,8,0.12)",   badge: "rgba(234,179,8,0.15)",   border: "rgba(234,179,8,0.40)",   fire: "🟡" },
  Reading:                { primary: "#a855f7", glow: "rgba(168,85,247,0.12)",  badge: "rgba(168,85,247,0.15)",  border: "rgba(168,85,247,0.40)",  fire: "🟣" },
  Fitness:                { primary: "#ef4444", glow: "rgba(239,68,68,0.12)",   badge: "rgba(239,68,68,0.15)",   border: "rgba(239,68,68,0.40)",   fire: "🔴" },
  Design:                 { primary: "#ec4899", glow: "rgba(236,72,153,0.12)",  badge: "rgba(236,72,153,0.15)",  border: "rgba(236,72,153,0.40)",  fire: "🩷" },
  "Public Speaking":      { primary: "#14b8a6", glow: "rgba(20,184,166,0.12)",  badge: "rgba(20,184,166,0.15)",  border: "rgba(20,184,166,0.40)",  fire: "🩵" },
  "Interview Preparation":{ primary: "#3b82f6", glow: "rgba(59,130,246,0.12)",  badge: "rgba(59,130,246,0.15)",  border: "rgba(59,130,246,0.40)",  fire: "🔵" },
  "Personal Growth":      { primary: "#f59e0b", glow: "rgba(245,158,11,0.12)",  badge: "rgba(245,158,11,0.15)",  border: "rgba(245,158,11,0.40)",  fire: "🔥" },
};

const DEFAULT_THEME: Theme = {
  primary: "#84cc16", glow: "rgba(132,204,22,0.12)",
  badge: "rgba(132,204,22,0.15)", border: "rgba(132,204,22,0.35)", fire: "🔥",
};

function getTheme(tag: string): Theme {
  return THEME_MAP[tag] ?? DEFAULT_THEME;
}

// ── Types ─────────────────────────────────────────────────────────────────────
type Circle = {
  id: string;
  name: string;
  description: string | null;
  interest_tag: string;
  owner_id: string;
  member_count: number;
  is_member: boolean;
  top_streak: number;
  total_streak: number;
};

// ── Colored SVG flame ────────────────────────────────────────────────────────
function Flame({ color, size = 28 }: { color: string; size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: `drop-shadow(0 0 6px ${color}90)` }}
    >
      {/* Outer flame */}
      <path
        d="M12 2C12 2 7 8 7 13a5 5 0 0 0 10 0c0-2.5-1.5-4.5-2.5-6C14 9 13 11 12 11c-1 0-2-2-2-2S12 2 12 2z"
        fill={color}
        opacity="0.85"
      />
      {/* Inner highlight */}
      <path
        d="M12 10c0 0-1 2.5-1 3.5a1 1 0 0 0 2 0C13 12.5 12 10 12 10z"
        fill="white"
        opacity="0.45"
      />
    </svg>
  );
}

function CirclesPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [busy, setBusy] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState<string>(INTERESTS[0]);
  const [creating, setCreating] = useState(false);

  async function load() {
    setBusy(true);
    const { data: rows } = await supabase
      .from("circles")
      .select("id, name, description, interest_tag, owner_id, circle_members(user_id, current_streak)")
      .order("created_at", { ascending: false });

    const mapped: Circle[] = (rows ?? []).map((r) => {
      const members = (r.circle_members ?? []) as { user_id: string; current_streak: number }[];
      const streaks = members.map((m) => m.current_streak ?? 0);
      return {
        id: r.id,
        name: r.name,
        description: r.description,
        interest_tag: r.interest_tag,
        owner_id: r.owner_id,
        member_count: members.length,
        is_member: user ? members.some((m) => m.user_id === user.id) : false,
        top_streak: streaks.length > 0 ? Math.max(...streaks) : 0,
        total_streak: streaks.reduce((a, b) => a + b, 0),
      };
    });
    setCircles(mapped);
    setBusy(false);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  async function createCircle(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setCreating(true);
    const { data, error } = await supabase
      .from("circles")
      .insert({ name, description: description || null, interest_tag: tag, owner_id: user.id })
      .select("id")
      .single();
    if (error || !data) {
      toast.error(error?.message ?? "Failed to create circle");
      setCreating(false);
      return;
    }
    await supabase.from("circle_members").insert({ circle_id: data.id, user_id: user.id });
    toast.success("Circle created!");
    setName(""); setDescription(""); setShowForm(false); setCreating(false);
    load();
  }

  async function join(circleId: string) {
    if (!user) return;
    const { error } = await supabase.from("circle_members").insert({ circle_id: circleId, user_id: user.id });
    if (error) toast.error(error.message);
    else { toast.success("Joined circle 🎉"); load(); }
  }

  function openCircle(id: string) {
    navigate({ to: "/circles/$id", params: { id } });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <header className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand mb-3">Growth circles</p>
            <h1 className="font-display text-5xl font-extrabold italic uppercase leading-[0.9]">
              Build with <span className="text-brand">peers.</span>
            </h1>
            <p className="text-white/50 mt-3 max-w-xl">
              Small groups, shared interest, daily check-ins. Each circle glows its own color.
            </p>
          </div>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="px-5 py-3 bg-brand text-black font-extrabold rounded-2xl hover:scale-[1.02] transition"
          >
            {showForm ? "Cancel" : "+ New circle"}
          </button>
        </header>

        {/* Create form */}
        {showForm && (
          <form onSubmit={createCircle}
            className="mb-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
            <input required maxLength={60} value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Circle name (e.g. Daily AI Builders)"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand transition" />
            <textarea maxLength={280} value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this circle commit to? (optional)" rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand transition" />
            <select value={tag} onChange={(e) => setTag(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand">
              {INTERESTS.map((i) => (
                <option key={i} value={i} className="bg-background">{i}</option>
              ))}
            </select>
            {/* Preview of selected tag color */}
            <div className="flex items-center gap-3 px-1">
              <div className="w-3 h-3 rounded-full" style={{ background: getTheme(tag).primary }} />
              <span className="text-xs text-white/40">
                This circle will have a <span className="font-bold" style={{ color: getTheme(tag).primary }}>{tag}</span> color theme
              </span>
            </div>
            <button disabled={creating}
              className="px-6 py-3 bg-brand text-black font-extrabold rounded-2xl disabled:opacity-60">
              {creating ? "Creating…" : "Create circle"}
            </button>
          </form>
        )}

        {/* Circles grid */}
        {busy ? (
          <div className="flex items-center gap-3 text-white/40">
            <span className="w-5 h-5 border-2 border-white/20 border-t-brand rounded-full animate-spin" />
            Loading circles…
          </div>
        ) : circles.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-3xl p-10 text-center">
            <p className="text-3xl mb-2">🌱</p>
            <p className="font-bold text-lg">No circles yet</p>
            <p className="text-white/50 mt-2">Be the first to start one.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {circles.map((c) => {
              const theme = getTheme(c.interest_tag);
              return (
                <div
                  key={c.id}
                  className="rounded-3xl p-6 relative overflow-hidden transition-all duration-300 cursor-pointer group"
                  style={{
                    border: `1px solid ${theme.border}`,
                    background: `linear-gradient(135deg, ${theme.glow}, rgba(0,0,0,0) 70%)`,
                  }}
                  onClick={() => openCircle(c.id)}
                >
                  {/* Background glow blob */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity"
                    style={{ background: theme.glow }} />

                  {/* Top row — badge + members */}
                  <div className="flex items-start justify-between mb-3 relative">
                    <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
                      style={{ background: theme.badge, color: theme.primary, borderColor: `${theme.primary}40` }}>
                      {c.interest_tag}
                    </span>
                    <span className="text-xs text-white/40">
                      {c.member_count} member{c.member_count === 1 ? "" : "s"}
                    </span>
                  </div>

                  {/* Name */}
                  <h2 className="font-display text-2xl font-extrabold italic uppercase mb-1 relative">
                    {c.name}
                  </h2>

                  {/* Description */}
                  {c.description && (
                    <p className="text-white/60 text-sm mb-3 line-clamp-2 relative">{c.description}</p>
                  )}

                  {/* Streak bar */}
                  <div className="flex items-center gap-4 mb-5 relative">
                    {/* Group top streak */}
                    <div className="flex items-center gap-2">
                      <Flame color={theme.primary} size={c.top_streak >= 7 ? 30 : c.top_streak >= 3 ? 26 : 22} />
                      <div>
                        <div className="font-display text-xl font-extrabold leading-none"
                          style={{ color: theme.primary }}>
                          {c.top_streak}
                        </div>
                        <div className="text-[9px] uppercase tracking-widest text-white/30 mt-0.5">top streak</div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-8 bg-white/10" />

                    {/* Combined circle streak */}
                    <div>
                      <div className="font-display text-xl font-extrabold leading-none text-white/70">
                        {c.total_streak}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-white/30 mt-0.5">total days</div>
                    </div>

                    {/* Mini streak bar */}
                    <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden ml-2">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min((c.top_streak / 30) * 100, 100)}%`,
                          background: `linear-gradient(90deg, ${theme.primary}80, ${theme.primary})`,
                        }} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      id={`open-circle-${c.id}`}
                      onClick={() => openCircle(c.id)}
                      className="px-4 py-2 rounded-full text-sm font-bold transition hover:opacity-80"
                      style={{ background: theme.badge, color: theme.primary, border: `1px solid ${theme.primary}40` }}
                    >
                      Open →
                    </button>
                    {!c.is_member && (
                      <button
                        onClick={() => join(c.id)}
                        className="px-4 py-2 rounded-full text-sm font-extrabold text-black hover:scale-[1.02] transition"
                        style={{ background: theme.primary }}
                      >
                        Join
                      </button>
                    )}
                    {c.is_member && (
                      <span className="px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1"
                        style={{ color: theme.primary }}>
                        ✓ Member
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

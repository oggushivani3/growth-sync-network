import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { SiteNav } from "@/components/site-nav";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/circles/$id")({
  head: () => ({ meta: [{ title: "Circle — MindSync" }] }),
  component: CircleDetailPage,
});

// ── Interest → color theme ────────────────────────────────────────────────────
type Theme = {
  primary: string;     // hex for inline styles
  ring: string;        // SVG stroke
  glow: string;        // rgba for glow effects
  badge: string;       // tailwind-compatible inline bg
  label: string;       // readable label color
  timerBg: string;     // timer panel bg
};

const THEME_MAP: Record<string, Theme> = {
  Coding:                 { primary: "#22c55e", ring: "#22c55e", glow: "rgba(34,197,94,0.15)",  badge: "rgba(34,197,94,0.15)",  label: "#22c55e", timerBg: "rgba(34,197,94,0.08)"  },
  AI:                     { primary: "#6366f1", ring: "#6366f1", glow: "rgba(99,102,241,0.15)", badge: "rgba(99,102,241,0.15)", label: "#6366f1", timerBg: "rgba(99,102,241,0.08)" },
  "Data Science":         { primary: "#06b6d4", ring: "#06b6d4", glow: "rgba(6,182,212,0.15)",  badge: "rgba(6,182,212,0.15)",  label: "#06b6d4", timerBg: "rgba(6,182,212,0.08)"  },
  Startups:               { primary: "#f97316", ring: "#f97316", glow: "rgba(249,115,22,0.15)", badge: "rgba(249,115,22,0.15)", label: "#f97316", timerBg: "rgba(249,115,22,0.08)" },
  Entrepreneurship:       { primary: "#eab308", ring: "#eab308", glow: "rgba(234,179,8,0.15)",  badge: "rgba(234,179,8,0.15)",  label: "#eab308", timerBg: "rgba(234,179,8,0.08)"  },
  Reading:                { primary: "#a855f7", ring: "#a855f7", glow: "rgba(168,85,247,0.15)", badge: "rgba(168,85,247,0.15)", label: "#a855f7", timerBg: "rgba(168,85,247,0.08)" },
  Fitness:                { primary: "#ef4444", ring: "#ef4444", glow: "rgba(239,68,68,0.15)",  badge: "rgba(239,68,68,0.15)",  label: "#ef4444", timerBg: "rgba(239,68,68,0.08)"  },
  Design:                 { primary: "#ec4899", ring: "#ec4899", glow: "rgba(236,72,153,0.15)", badge: "rgba(236,72,153,0.15)", label: "#ec4899", timerBg: "rgba(236,72,153,0.08)" },
  "Public Speaking":      { primary: "#14b8a6", ring: "#14b8a6", glow: "rgba(20,184,166,0.15)", badge: "rgba(20,184,166,0.15)", label: "#14b8a6", timerBg: "rgba(20,184,166,0.08)" },
  "Interview Preparation":{ primary: "#3b82f6", ring: "#3b82f6", glow: "rgba(59,130,246,0.15)", badge: "rgba(59,130,246,0.15)", label: "#3b82f6", timerBg: "rgba(59,130,246,0.08)" },
  "Personal Growth":      { primary: "#f59e0b", ring: "#f59e0b", glow: "rgba(245,158,11,0.15)", badge: "rgba(245,158,11,0.15)", label: "#f59e0b", timerBg: "rgba(245,158,11,0.08)" },
};

const DEFAULT_THEME: Theme = {
  primary: "#84cc16", ring: "#84cc16", glow: "rgba(132,204,22,0.15)",
  badge: "rgba(132,204,22,0.15)", label: "#84cc16", timerBg: "rgba(132,204,22,0.08)",
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
  study_hours: number | null;
  snap_url: string | null;
  profile: { display_name: string | null; username: string | null } | null;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function fmtTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getInitials(name: string | null | undefined) {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

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

// ── Streak ring ───────────────────────────────────────────────────────────────
function StreakRing({ streak, size = 64, color }: { streak: number; size?: number; color: string }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(streak / 30, 1);
  const dash = circ * pct;
  const showFlame = size >= 48;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={4} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={4}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      {showFlame ? (
        <div className="flex flex-col items-center justify-center relative select-none">
          <Flame color={color} size={size * 0.38} />
          <span className="font-display font-extrabold leading-none -mt-0.5" style={{ fontSize: size * 0.24, color }}>
            {streak}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-0.5 justify-center relative select-none">
          <Flame color={color} size={11} />
          <span className="font-display font-extrabold leading-none" style={{ fontSize: size * 0.32, color }}>
            {streak}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function CircleDetailPage() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [circle, setCircle] = useState<Circle | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [snapUrls, setSnapUrls] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");
  const [snapFile, setSnapFile] = useState<File | null>(null);
  const [snapPreview, setSnapPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [posting, setPosting] = useState(false);
  const [selectedSnap, setSelectedSnap] = useState<Checkin | null>(null);

  // ── Timer state ──────────────────────────────────────────────────────────
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerLocked, setTimerLocked] = useState(false); // true after stop, before sending
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const isMember = !!user && members.some((m) => m.user_id === user.id);
  const checkedInToday = !!user && checkins.some((c) => c.user_id === user.id && c.checkin_date === today());
  const myMember = members.find((m) => m.user_id === user?.id);
  const theme = circle ? getTheme(circle.interest_tag) : DEFAULT_THEME;

  // ── Timer handlers ───────────────────────────────────────────────────────
  function startTimer() {
    if (timerRunning) return;
    setTimerRunning(true);
    setTimerLocked(false);
    setTimerSeconds(0);
    timerRef.current = setInterval(() => {
      setTimerSeconds((s) => s + 1);
    }, 1000);
  }

  function stopTimer() {
    if (!timerRunning) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setTimerRunning(false);
    setTimerLocked(true);
  }

  function resetTimer() {
    stopTimer();
    setTimerSeconds(0);
    setTimerLocked(false);
  }

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // ── Data load ────────────────────────────────────────────────────────────
  async function load() {
    setBusy(true);
    const [c, m, k] = await Promise.all([
      supabase.from("circles").select("*").eq("id", id).maybeSingle(),
      supabase.from("circle_members").select("user_id, current_streak, last_checkin_date").eq("circle_id", id),
      supabase.from("circle_checkins")
        .select("id, user_id, note, checkin_date, created_at, study_hours, snap_url")
        .eq("circle_id", id).order("created_at", { ascending: false }).limit(30),
    ]);
    setCircle((c.data as Circle | null) ?? null);

    const memberRows = (m.data as Array<{ user_id: string; current_streak: number; last_checkin_date: string | null }>) ?? [];
    const checkinRows = (k.data as Array<Omit<Checkin, "profile">>) ?? [];

    const userIds = Array.from(new Set([...memberRows.map((x) => x.user_id), ...checkinRows.map((x) => x.user_id)]));
    const profileMap: Record<string, { display_name: string | null; username: string | null }> = {};
    if (userIds.length > 0) {
      const { data: profs } = await supabase.from("profiles").select("id, display_name, username").in("id", userIds);
      (profs ?? []).forEach((p) => { profileMap[p.id] = { display_name: p.display_name, username: p.username }; });
    }

    setMembers(memberRows.map((x) => ({ ...x, profile: profileMap[x.user_id] ?? null })));
    const cks: Checkin[] = checkinRows.map((x) => ({ ...x, profile: profileMap[x.user_id] ?? null }));
    setCheckins(cks);

    const paths = cks.map((x) => x.snap_url).filter((x): x is string => !!x);
    if (paths.length > 0) {
      const { data: signed } = await supabase.storage.from("snaps").createSignedUrls(paths, 3600);
      const map: Record<string, string> = {};
      signed?.forEach((s) => { if (s.path && s.signedUrl) map[s.path] = s.signedUrl; });
      setSnapUrls(map);
    } else {
      setSnapUrls({});
    }
    setBusy(false);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, id]);

  async function join() {
    if (!user) return;
    const { error } = await supabase.from("circle_members").insert({ circle_id: id, user_id: user.id });
    if (error) toast.error(error.message);
    else { toast.success("Joined! 🎉"); load(); }
  }

  function onPickSnap(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setSnapFile(f);
    if (snapPreview) URL.revokeObjectURL(snapPreview);
    setSnapPreview(f ? URL.createObjectURL(f) : null);
  }

  async function checkIn() {
    if (!user) return;
    if (!timerLocked && timerSeconds === 0) {
      toast.error("Start the timer first, then stop it when done studying!");
      return;
    }
    if (!snapFile) {
      toast.error("📸 Snap a photo — no snap, no streak!");
      return;
    }
    const h = timerSeconds / 3600;
    if (h < 0.01) {
      toast.error("Session too short! Study at least a minute.");
      return;
    }
    setPosting(true);

    const ext = snapFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/${id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("snaps").upload(path, snapFile, {
      contentType: snapFile.type, upsert: false,
    });
    if (upErr) { toast.error(upErr.message); setPosting(false); return; }

    const t = today();
    const { error } = await supabase.from("circle_checkins").insert({
      circle_id: id, user_id: user.id, note: note || null,
      checkin_date: t, study_hours: parseFloat(h.toFixed(2)), snap_url: path,
    });
    if (error) { toast.error(error.message); setPosting(false); return; }

    const me = members.find((m) => m.user_id === user.id);
    let newStreak = 1;
    if (me?.last_checkin_date) {
      const diff = Math.round((new Date(t).getTime() - new Date(me.last_checkin_date).getTime()) / 86400000);
      if (diff === 1) newStreak = (me.current_streak ?? 0) + 1;
      else if (diff === 0) newStreak = me.current_streak ?? 1;
    }
    await supabase.from("circle_members")
      .update({ current_streak: newStreak, last_checkin_date: t })
      .eq("circle_id", id).eq("user_id", user.id);

    toast.success(`🔥 Streak ${newStreak}! ${(h).toFixed(2)}h logged`);
    setNote(""); setSnapFile(null);
    if (snapPreview) URL.revokeObjectURL(snapPreview);
    setSnapPreview(null);
    if (fileRef.current) fileRef.current.value = "";
    resetTimer();
    setPosting(false);
    load();
  }

  // ── Loading / not found ──────────────────────────────────────────────────
  if (busy) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SiteNav />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: `${DEFAULT_THEME.primary}33`, borderTopColor: "transparent" }} />
          <p className="text-white/40 text-sm">Loading circle…</p>
        </div>
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNav />
        <main className="max-w-4xl mx-auto px-6 py-12 text-center">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-xl font-bold mb-2">Circle not found</p>
          <Link to="/circles" className="text-brand font-bold hover:underline">← Back to circles</Link>
        </main>
      </div>
    );
  }

  const sortedMembers = [...members].sort((a, b) => (b.current_streak ?? 0) - (a.current_streak ?? 0));
  const totalHoursToday = checkins.filter((c) => c.checkin_date === today()).reduce((a, c) => a + (Number(c.study_hours) || 0), 0);
  const totalHoursAll = checkins.reduce((a, c) => a + (Number(c.study_hours) || 0), 0);
  const todayCheckins = checkins.filter((c) => c.checkin_date === today());
  const topStreak = sortedMembers[0]?.current_streak ?? 0;
  const hoursFromTimer = timerSeconds / 3600;

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Snap lightbox */}
      {selectedSnap && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedSnap(null)}>
          <div className="relative max-w-sm w-full rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            {selectedSnap.snap_url && snapUrls[selectedSnap.snap_url] ? (
              <img src={snapUrls[selectedSnap.snap_url]} alt="Snap" className="w-full object-cover" />
            ) : (
              <div className="w-full aspect-square bg-white/10 flex items-center justify-center text-white/30">No snap</div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5">
              <p className="font-bold text-lg">{selectedSnap.profile?.display_name || selectedSnap.profile?.username || "Builder"}</p>
              {selectedSnap.study_hours != null && (
                <p className="font-extrabold text-2xl font-display" style={{ color: theme.primary }}>
                  {Number(selectedSnap.study_hours).toFixed(2)}h studied
                </p>
              )}
              {selectedSnap.note && <p className="text-white/80 text-sm mt-1">{selectedSnap.note}</p>}
              <p className="text-white/40 text-xs mt-2">{new Date(selectedSnap.created_at).toLocaleString()}</p>
            </div>
            <button onClick={() => setSelectedSnap(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white text-sm hover:bg-black/80 transition">
              ✕
            </button>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-6 py-8 pb-24">
        {/* Back */}
        <Link to="/circles"
          className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-white/80 uppercase tracking-widest mb-6 transition">
          ← All circles
        </Link>

        {/* Hero header — themed */}
        <header className="rounded-3xl border p-8 mb-6 relative overflow-hidden"
          style={{ borderColor: `${theme.primary}30`, background: `linear-gradient(135deg, ${theme.glow}, rgba(0,0,0,0))` }}>
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none"
            style={{ background: theme.glow }} />
          {/* Badge */}
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
            style={{ background: theme.badge, color: theme.label, borderColor: `${theme.primary}50` }}>
            {circle.interest_tag}
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold italic uppercase leading-[0.9] mt-3 mb-1">
            {circle.name}
          </h1>
          {circle.description && <p className="text-white/60 text-sm max-w-xl mt-2">{circle.description}</p>}

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2">
              <Flame color={theme.primary} size={32} />
              <div>
                <div className="font-display text-3xl font-extrabold" style={{ color: theme.primary }}>{topStreak}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 mt-0.5">Top streak</div>
              </div>
            </div>
            <div>
              <div className="font-display text-3xl font-extrabold">{members.length}</div>
              <div className="text-[10px] uppercase tracking-widest text-white/40 mt-0.5">Members</div>
            </div>
            <div>
              <div className="font-display text-3xl font-extrabold" style={{ color: theme.primary }}>{totalHoursToday.toFixed(1)}h</div>
              <div className="text-[10px] uppercase tracking-widest text-white/40 mt-0.5">Studied today</div>
            </div>
            <div>
              <div className="font-display text-3xl font-extrabold">{totalHoursAll.toFixed(0)}h</div>
              <div className="text-[10px] uppercase tracking-widest text-white/40 mt-0.5">Total hours</div>
            </div>
          </div>

          {!isMember && (
            <button onClick={join}
              className="mt-6 px-6 py-3 font-extrabold rounded-2xl hover:scale-[1.02] transition text-black"
              style={{ background: theme.primary }}>
              Join circle
            </button>
          )}
        </header>

        <div className="grid md:grid-cols-[1fr_280px] gap-6">
          {/* ── Left column ── */}
          <div className="space-y-6">

            {/* Daily snap check-in */}
            {isMember && (
              <section className="rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden">
                <div className="px-6 pt-6 pb-4 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-lg">Daily Study Snap</h2>
                    <p className="text-xs text-white/40 mt-0.5">
                      {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                    </p>
                  </div>
                  {myMember && (
                    <div className="flex flex-col items-center">
                      <StreakRing streak={myMember.current_streak} size={56} color={theme.ring} />
                      <span className="text-[9px] uppercase tracking-widest text-white/40 mt-1">your streak</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {checkedInToday ? (
                    <div className="flex flex-col items-center py-6 gap-3">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                        style={{ background: theme.badge }}>✅</div>
                      <p className="font-bold text-lg" style={{ color: theme.primary }}>Snap sent today!</p>
                      <p className="text-white/40 text-sm text-center">Come back tomorrow to keep your streak alive 🔥</p>
                    </div>
                  ) : (
                    <div className="space-y-5">

                      {/* ── STUDY TIMER ────────────────────────────────── */}
                      <div className="rounded-2xl p-5 border" style={{ background: theme.timerBg, borderColor: `${theme.primary}25` }}>
                        <p className="text-xs font-bold uppercase tracking-widest mb-3 text-white/50">Study Timer</p>

                        {/* Clock display */}
                        <div className="flex items-center justify-center mb-4">
                          <span className="font-display text-5xl font-extrabold tabular-nums tracking-tight"
                            style={{ color: timerRunning ? theme.primary : timerLocked ? theme.primary : "rgba(255,255,255,0.4)" }}>
                            {fmtTime(timerSeconds)}
                          </span>
                        </div>

                        {/* Timer controls */}
                        <div className="flex gap-3 justify-center">
                          {!timerRunning && !timerLocked && (
                            <button id="start-timer-btn" onClick={startTimer}
                              className="flex-1 py-3 rounded-2xl font-extrabold text-black flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.99] transition"
                              style={{ background: theme.primary }}>
                              ▶ Start Studying
                            </button>
                          )}
                          {timerRunning && (
                            <button id="stop-timer-btn" onClick={stopTimer}
                              className="flex-1 py-3 rounded-2xl font-extrabold bg-white/10 border border-white/20 flex items-center justify-center gap-2 hover:bg-white/15 transition">
                              ⏹ Stop Timer
                            </button>
                          )}
                          {timerLocked && (
                            <>
                              <div className="flex-1 py-3 rounded-2xl text-center font-extrabold" style={{ background: theme.badge, color: theme.primary }}>
                                ✓ {hoursFromTimer.toFixed(2)}h recorded
                              </div>
                              <button onClick={resetTimer}
                                className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition">
                                Reset
                              </button>
                            </>
                          )}
                        </div>

                        {timerRunning && (
                          <p className="text-center text-xs text-white/40 mt-3 animate-pulse">
                            ⏱ Timer running… stop it when you're done
                          </p>
                        )}
                      </div>

                      {/* ── SNAP UPLOAD ───────────────────────────────── */}
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Proof Snap</p>
                        {snapPreview ? (
                          <div className="relative rounded-2xl overflow-hidden aspect-video bg-black">
                            <img src={snapPreview} alt="Snap preview" className="w-full h-full object-cover" />
                            <button
                              onClick={() => { setSnapFile(null); setSnapPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white text-xs hover:bg-black/80 transition">
                              ✕
                            </button>
                            <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg text-xs font-bold"
                              style={{ background: theme.badge, color: theme.primary }}>
                              ✓ Ready to send
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed aspect-video cursor-pointer transition hover:opacity-90"
                            style={{ borderColor: `${theme.primary}40`, background: theme.timerBg }}>
                            <span className="text-4xl">📸</span>
                            <span className="text-sm font-bold" style={{ color: theme.primary }}>Tap to snap a photo</span>
                            <span className="text-xs text-white/30">Your study setup, notes, or screen</span>
                            <input ref={fileRef} type="file" accept="image/*" capture="environment"
                              onChange={onPickSnap} className="hidden" />
                          </label>
                        )}
                      </div>

                      {/* Caption */}
                      <input value={note} onChange={(e) => setNote(e.target.value)}
                        maxLength={140} placeholder="What did you study? (optional)"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 focus:outline-none transition text-sm"
                        style={{ outlineColor: theme.primary }}
                        onFocus={(e) => (e.target.style.borderColor = `${theme.primary}60`)}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")} />

                      {/* Send button */}
                      <button id="send-snap-btn" disabled={posting || !timerLocked || !snapFile} onClick={checkIn}
                        className="w-full py-4 font-extrabold rounded-2xl disabled:opacity-30 hover:scale-[1.01] active:scale-[0.99] transition text-black flex items-center justify-center gap-2"
                        style={{ background: timerLocked && snapFile ? theme.primary : "rgba(255,255,255,0.2)", color: timerLocked && snapFile ? "black" : "rgba(255,255,255,0.4)" }}>
                        {posting ? (
                          <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Sending…</>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Flame color={timerLocked && snapFile ? "black" : "rgba(255,255,255,0.4)"} size={18} />
                            Send Snap · {timerLocked ? `${hoursFromTimer.toFixed(2)}h` : "start timer first"}
                          </span>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Today's snaps */}
            {todayCheckins.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-3">
                  Today · {todayCheckins.length} checked in
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {todayCheckins.map((c) => (
                    <button key={c.id} onClick={() => setSelectedSnap(c)}
                      className="group relative rounded-2xl overflow-hidden aspect-square hover:scale-[1.02] transition cursor-pointer"
                      style={{ background: theme.timerBg, border: `1px solid ${theme.primary}20` }}>
                      {c.snap_url && snapUrls[c.snap_url] ? (
                        <img src={snapUrls[c.snap_url]} alt="Snap" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">📚</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition" />
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-xs font-bold truncate text-white drop-shadow">
                          {c.profile?.display_name || c.profile?.username || "Builder"}
                        </p>
                        {c.study_hours != null && (
                          <p className="text-xs font-extrabold drop-shadow" style={{ color: theme.primary }}>
                            {Number(c.study_hours).toFixed(2)}h
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* All snaps feed */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-3">Snap feed</h2>
              {checkins.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center">
                  <p className="text-3xl mb-2">📭</p>
                  <p className="text-white/40 text-sm">No snaps yet. Be first.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {checkins.map((c) => (
                    <div key={c.id} onClick={() => setSelectedSnap(c)}
                      className="flex gap-4 items-center rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:border-opacity-50 transition cursor-pointer"
                      style={{ borderColor: `${theme.primary}20` }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${theme.primary}50`)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${theme.primary}20`)}>
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-white/5">
                        {c.snap_url && snapUrls[c.snap_url] ? (
                          <img src={snapUrls[c.snap_url]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">📚</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{c.profile?.display_name || c.profile?.username || "Builder"}</p>
                        {c.note && <p className="text-white/50 text-xs truncate mt-0.5">{c.note}</p>}
                        <p className="text-white/30 text-xs mt-1">
                          {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      {c.study_hours != null && (
                        <div className="flex-shrink-0 flex flex-col items-center">
                          <span className="font-display text-xl font-extrabold" style={{ color: theme.primary }}>
                            {Number(c.study_hours).toFixed(1)}
                          </span>
                          <span className="text-[9px] uppercase tracking-widest text-white/30">hrs</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ── Sidebar — leaderboard ── */}
          <aside className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">🏆 Streak board</h2>
            <div className="space-y-2">
              {sortedMembers.length === 0 ? (
                <p className="text-white/30 text-sm">No members yet.</p>
              ) : (
                sortedMembers.map((m, i) => {
                  const name = m.profile?.display_name || m.profile?.username || "Builder";
                  const isMe = m.user_id === user?.id;
                  const checkedToday = checkins.some((c) => c.user_id === m.user_id && c.checkin_date === today());
                  return (
                    <div key={m.user_id}
                      className="flex items-center gap-3 rounded-2xl p-3 border transition"
                      style={{
                        borderColor: isMe ? `${theme.primary}50` : "rgba(255,255,255,0.08)",
                        background: isMe ? theme.badge : "rgba(255,255,255,0.015)",
                      }}>
                      <span className="text-xs font-bold text-white/30 w-5 text-center flex-shrink-0">
                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                      </span>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-black"
                        style={{ background: isMe ? theme.primary : "rgba(255,255,255,0.12)", color: isMe ? "black" : "white" }}>
                        {getInitials(name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">
                          {name} {isMe && <span className="text-[10px]" style={{ color: theme.primary }}>(you)</span>}
                        </p>
                        <p className="text-[10px] text-white/30">
                          {checkedToday ? <span style={{ color: theme.primary }}>✓ snapped today</span> : "not yet"}
                        </p>
                      </div>
                      <StreakRing streak={m.current_streak} size={36} color={theme.ring} />
                    </div>
                  );
                })
              )}
            </div>

            {/* How it works */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-xs text-white/40 space-y-2">
              <p className="font-bold text-white/50 text-xs uppercase tracking-widest">How streaks work</p>
              <p>▶ Start timer when you begin</p>
              <p>⏹ Stop when done — hours auto-recorded</p>
              <p>📸 Snap your setup as proof</p>
              <p>🔥 Check in daily to grow streak</p>
              <p>💀 Miss a day = reset to 1</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

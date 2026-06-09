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

function CircleDetailPage() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [circle, setCircle] = useState<Circle | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [snapUrls, setSnapUrls] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");
  const [hours, setHours] = useState("");
  const [snapFile, setSnapFile] = useState<File | null>(null);
  const [snapPreview, setSnapPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [posting, setPosting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isMember = !!user && members.some((m) => m.user_id === user.id);
  const checkedInToday =
    !!user && checkins.some((c) => c.user_id === user.id && c.checkin_date === today());

  async function load() {
    setBusy(true);
    const [c, m, k] = await Promise.all([
      supabase.from("circles").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("circle_members")
        .select("user_id, current_streak, last_checkin_date")
        .eq("circle_id", id),
      supabase
        .from("circle_checkins")
        .select("id, user_id, note, checkin_date, created_at, study_hours, snap_url")
        .eq("circle_id", id)
        .order("created_at", { ascending: false })
        .limit(30),
    ]);
    setCircle((c.data as Circle | null) ?? null);

    const memberRows = (m.data as Array<{ user_id: string; current_streak: number; last_checkin_date: string | null }>) ?? [];
    const checkinRows = (k.data as Array<Omit<Checkin, "profile">>) ?? [];

    const userIds = Array.from(new Set([...memberRows.map((x) => x.user_id), ...checkinRows.map((x) => x.user_id)]));
    const profileMap: Record<string, { display_name: string | null; username: string | null }> = {};
    if (userIds.length > 0) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, display_name, username")
        .in("id", userIds);
      (profs ?? []).forEach((p) => {
        profileMap[p.id] = { display_name: p.display_name, username: p.username };
      });
    }

    setMembers(memberRows.map((x) => ({ ...x, profile: profileMap[x.user_id] ?? null })));
    const cks: Checkin[] = checkinRows.map((x) => ({ ...x, profile: profileMap[x.user_id] ?? null }));
    setCheckins(cks);


    // Generate signed URLs for snaps (bucket is private)
    const paths = cks.map((x) => x.snap_url).filter((x): x is string => !!x);
    if (paths.length > 0) {
      const { data: signed } = await supabase.storage.from("snaps").createSignedUrls(paths, 3600);
      const map: Record<string, string> = {};
      signed?.forEach((s) => {
        if (s.path && s.signedUrl) map[s.path] = s.signedUrl;
      });
      setSnapUrls(map);
    } else {
      setSnapUrls({});
    }
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

  function onPickSnap(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setSnapFile(f);
    if (snapPreview) URL.revokeObjectURL(snapPreview);
    setSnapPreview(f ? URL.createObjectURL(f) : null);
  }

  async function checkIn() {
    if (!user) return;
    if (!snapFile) {
      toast.error("Snap a photo to prove your session 📸");
      return;
    }
    const h = parseFloat(hours);
    if (!h || h <= 0 || h > 24) {
      toast.error("Enter hours studied (0–24)");
      return;
    }
    setPosting(true);

    const ext = snapFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/${id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("snaps").upload(path, snapFile, {
      contentType: snapFile.type,
      upsert: false,
    });
    if (upErr) {
      toast.error(upErr.message);
      setPosting(false);
      return;
    }

    const t = today();
    const { error } = await supabase.from("circle_checkins").insert({
      circle_id: id,
      user_id: user.id,
      note: note || null,
      checkin_date: t,
      study_hours: h,
      snap_url: path,
    });
    if (error) {
      toast.error(error.message);
      setPosting(false);
      return;
    }

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
    toast.success(`Snap sent · ${h}h logged · Streak ${newStreak}🔥`);
    setNote("");
    setHours("");
    setSnapFile(null);
    if (snapPreview) URL.revokeObjectURL(snapPreview);
    setSnapPreview(null);
    if (fileRef.current) fileRef.current.value = "";
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
  const totalHoursToday = checkins
    .filter((c) => c.checkin_date === today())
    .reduce((a, c) => a + (Number(c.study_hours) || 0), 0);

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
            <div>
              <div className="font-display text-3xl font-extrabold">{totalHoursToday.toFixed(1)}h</div>
              <div className="text-[10px] uppercase tracking-widest text-white/40">studied today</div>
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
              Today's snap check-in
            </h2>
            {checkedInToday ? (
              <p className="text-brand font-bold">✓ Snap sent today. Keep the streak alive tomorrow.</p>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-white/60">
                  Log your study hours and snap a photo of your setup, notes, or screen. No snap, no streak.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <input
                    type="number"
                    min="0.25"
                    max="24"
                    step="0.25"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="Hours studied"
                    className="w-36 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 focus:outline-none focus:border-brand"
                  />
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={140}
                    placeholder="Caption (optional)"
                    className="flex-1 min-w-[200px] bg-white/5 border border-white/10 rounded-2xl px-5 py-3 focus:outline-none focus:border-brand"
                  />
                </div>
                <div className="flex gap-3 items-center flex-wrap">
                  <label className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 font-bold text-sm">
                    📸 {snapFile ? "Retake" : "Snap photo"}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={onPickSnap}
                      className="hidden"
                    />
                  </label>
                  {snapPreview && (
                    <img
                      src={snapPreview}
                      alt="Snap preview"
                      className="h-20 w-20 object-cover rounded-2xl border border-brand/40"
                    />
                  )}
                  <button
                    disabled={posting}
                    onClick={checkIn}
                    className="px-6 py-3 bg-brand text-black font-extrabold rounded-2xl disabled:opacity-60 ml-auto"
                  >
                    {posting ? "Sending…" : "Send snap 🔥"}
                  </button>
                </div>
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
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-4">Snap feed</h2>
          {checkins.length === 0 ? (
            <p className="text-white/40 text-sm">No snaps yet. Be first to send one.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {checkins.map((c) => (
                <div key={c.id} className="rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden">
                  {c.snap_url && snapUrls[c.snap_url] ? (
                    <img
                      src={snapUrls[c.snap_url]}
                      alt="Snap"
                      className="w-full aspect-square object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-white/5 flex items-center justify-center text-white/30 text-sm">
                      No snap
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between text-xs text-white/40 mb-1">
                      <span className="font-bold text-white/80">
                        {c.profile?.display_name || c.profile?.username || "Builder"}
                      </span>
                      <span>{new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                      {c.study_hours != null && (
                        <span className="font-display text-xl font-extrabold text-brand">
                          {Number(c.study_hours).toFixed(2)}h
                        </span>
                      )}
                      <span className="text-[10px] uppercase tracking-widest text-white/40">studied</span>
                    </div>
                    {c.note && <p className="text-sm text-white/80">{c.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

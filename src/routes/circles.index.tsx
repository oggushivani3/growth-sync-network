import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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

type Circle = {
  id: string;
  name: string;
  description: string | null;
  interest_tag: string;
  owner_id: string;
  member_count: number;
  is_member: boolean;
};

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
      .select("id, name, description, interest_tag, owner_id, circle_members(user_id)")
      .order("created_at", { ascending: false });
    const mapped: Circle[] = (rows ?? []).map((r) => {
      const members = (r.circle_members ?? []) as { user_id: string }[];
      return {
        id: r.id,
        name: r.name,
        description: r.description,
        interest_tag: r.interest_tag,
        owner_id: r.owner_id,
        member_count: members.length,
        is_member: user ? members.some((m) => m.user_id === user.id) : false,
      };
    });
    setCircles(mapped);
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
    toast.success("Circle created");
    setName("");
    setDescription("");
    setShowForm(false);
    setCreating(false);
    load();
  }

  async function join(circleId: string) {
    if (!user) return;
    const { error } = await supabase.from("circle_members").insert({ circle_id: circleId, user_id: user.id });
    if (error) toast.error(error.message);
    else {
      toast.success("Joined circle");
      load();
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <header className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand mb-3">Growth circles</p>
            <h1 className="font-display text-5xl font-extrabold italic uppercase leading-[0.9]">
              Build with <span className="text-brand">peers.</span>
            </h1>
            <p className="text-white/50 mt-3 max-w-xl">
              Small groups, shared interest, daily check-ins. Streaks grow when the circle shows up.
            </p>
          </div>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="px-5 py-3 bg-brand text-black font-extrabold rounded-2xl hover:scale-[1.02] transition"
          >
            {showForm ? "Cancel" : "New circle"}
          </button>
        </header>

        {showForm && (
          <form
            onSubmit={createCircle}
            className="mb-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-4"
          >
            <input
              required
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Circle name (e.g. Daily AI Builders)"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand transition"
            />
            <textarea
              maxLength={280}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this circle commit to? (optional)"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand transition"
            />
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand"
            >
              {INTERESTS.map((i) => (
                <option key={i} value={i} className="bg-background">
                  {i}
                </option>
              ))}
            </select>
            <button
              disabled={creating}
              className="px-6 py-3 bg-brand text-black font-extrabold rounded-2xl disabled:opacity-60"
            >
              {creating ? "Creating…" : "Create circle"}
            </button>
          </form>
        )}

        {busy ? (
          <p className="text-white/40">Loading circles…</p>
        ) : circles.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-3xl p-10 text-center">
            <p className="font-bold text-lg">No circles yet</p>
            <p className="text-white/50 mt-2">Be the first to start one.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {circles.map((c) => (
              <div key={c.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 hover:border-brand/40 transition">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-brand/15 text-brand border border-brand/30">
                    {c.interest_tag}
                  </span>
                  <span className="text-xs text-white/40">
                    {c.member_count} member{c.member_count === 1 ? "" : "s"}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-extrabold italic uppercase mb-2">{c.name}</h2>
                {c.description && <p className="text-white/60 text-sm mb-4 line-clamp-2">{c.description}</p>}
                <div className="flex gap-2">
                  <Link
                    to="/circles/$id"
                    params={{ id: c.id }}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold hover:bg-white/10"
                  >
                    Open
                  </Link>
                  {!c.is_member && (
                    <button
                      onClick={() => join(c.id)}
                      className="px-4 py-2 bg-brand text-black rounded-full text-sm font-extrabold hover:scale-[1.02] transition"
                    >
                      Join
                    </button>
                  )}
                  {c.is_member && (
                    <span className="px-4 py-2 rounded-full text-sm font-bold text-brand">✓ Member</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

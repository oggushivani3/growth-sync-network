import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteNav } from "@/components/site-nav";
import { useAuth } from "@/hooks/use-auth";
import { getMindsetMatches, type Match } from "@/lib/match.functions";

export const Route = createFileRoute("/discover")({
  head: () => ({ meta: [{ title: "Discover — MindSync" }] }),
  component: DiscoverPage,
});

function DiscoverPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const fetchMatches = useServerFn(getMindsetMatches);
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    fetchMatches({})
      .then((data) => setMatches(data))
      .catch((e) => {
        console.error(e);
        toast.error("Couldn't load matches");
      })
      .finally(() => setBusy(false));
  }, [user, loading, navigate, fetchMatches]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand mb-3">AI mindset matching</p>
          <h1 className="font-display text-5xl font-extrabold italic uppercase leading-[0.9]">
            Find your <span className="text-brand">tribe.</span>
          </h1>
          <p className="text-white/50 mt-3 max-w-xl">
            Ranked by interest overlap + bio similarity. Each match comes with an AI-generated reason to connect.
          </p>
        </header>

        {busy && <p className="text-white/40">Scanning the network…</p>}

        {!busy && matches && matches.length === 0 && (
          <div className="border border-dashed border-white/10 rounded-3xl p-10 text-center">
            <p className="font-bold text-lg">No matches yet</p>
            <p className="text-white/50 mt-2">Be the first to invite ambitious builders. Share MindSync.</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {matches?.map((m) => (
            <article
              key={m.id}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 hover:border-brand/40 transition"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="font-display text-2xl font-extrabold italic uppercase">
                    {m.display_name || m.username}
                  </h2>
                  <p className="text-white/40 text-sm">@{m.username}</p>
                </div>
                <div className="text-right">
                  <div className="font-display text-3xl font-extrabold text-brand">{m.score}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40">match</div>
                </div>
              </div>
              <p className="text-sm text-brand/90 italic mb-3">"{m.reason}"</p>
              {m.bio && <p className="text-sm text-white/60 mb-4 line-clamp-3">{m.bio}</p>}
              <div className="flex flex-wrap gap-1.5">
                {m.interests.slice(0, 5).map((i) => (
                  <span
                    key={i}
                    className={`text-xs px-3 py-1 rounded-full border ${
                      m.overlap.includes(i)
                        ? "bg-brand/15 border-brand/30 text-brand font-bold"
                        : "bg-white/5 border-white/10 text-white/60"
                    }`}
                  >
                    {i}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import heroGlow from "@/assets/hero-glow.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MindSync — Growth is addictive" },
      {
        name: "description",
        content:
          "The social network for ambitious builders. Track growth streaks, share proof of work, find your mindset match.",
      },
    ],
  }),
  component: Landing,
});

const streaks = [
  { name: "Coding", color: "var(--streak-coding)" },
  { name: "Reading", color: "var(--streak-reading)" },
  { name: "Startup", color: "var(--streak-startup)" },
  { name: "AI / Data", color: "var(--streak-ai)" },
  { name: "Interview", color: "var(--streak-interview)" },
  { name: "Fitness", color: "var(--streak-fitness)" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand selection:text-black">
      <SiteNav />

      {/* HERO */}
      <header className="relative overflow-hidden pt-20 pb-24 px-6 max-w-6xl mx-auto text-center">
        <img
          src={heroGlow}
          alt=""
          width={1536}
          height={1024}
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto w-full max-w-5xl opacity-40 mix-blend-screen"
        />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
          <span className="size-2 rounded-full bg-brand animate-pulse" />
          <span className="text-xs font-semibold tracking-wide uppercase opacity-70">
            The new social for builders
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.9] tracking-tighter mb-8 italic">
          GROWTH IS <br />
          <span className="text-brand">ADDICTIVE.</span>
        </h1>
        <p className="max-w-xl mx-auto text-lg text-white/60 mb-10">
          Stop scrolling, start shipping. The first social network built on proof-based progress,
          deep accountability, and mindset matching.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-brand text-black font-extrabold rounded-2xl hover:scale-105 transition-transform"
          >
            START YOUR STREAK
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-colors"
          >
            I HAVE AN ACCOUNT
          </Link>
        </div>
      </header>

      {/* STREAKS GRID */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2 uppercase italic tracking-tight">
            6 Dimensions of Growth
          </h2>
          <p className="text-white/40">Categorize your daily wins and build multi-dimensional momentum.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {streaks.map((s) => (
            <div
              key={s.name}
              className="p-6 rounded-3xl border border-white/10 flex flex-col items-center gap-4 transition hover:-translate-y-1"
              style={{ backgroundColor: `color-mix(in oklab, ${s.color} 10%, transparent)` }}
            >
              <div
                className="size-12 rounded-2xl"
                style={{ backgroundColor: s.color, boxShadow: `0 0 24px ${s.color}80` }}
              />
              <span className="font-bold text-sm tracking-widest uppercase">{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* MINDSET MATCH + PROFILE GLIMPSE */}
      <section className="px-6 py-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white/5 rounded-[40px] p-10 border border-white/10 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-4xl font-extrabold italic mb-4 uppercase">Mindset Matching</h3>
            <p className="text-white/60 text-lg max-w-md">
              Our algorithm doesn't track interests. It tracks intensity. Match with people operating
              at your same frequency.
            </p>
            <div className="mt-8 flex -space-x-4">
              <div className="size-14 rounded-full border-4 border-background bg-zinc-800" />
              <div className="size-14 rounded-full border-4 border-background bg-zinc-700" />
              <div className="size-14 rounded-full border-4 border-background bg-zinc-600" />
              <div className="size-14 rounded-full border-4 border-background bg-brand/80 grid place-items-center text-black font-bold text-xs">
                +400
              </div>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none">
            <div className="w-96 h-96 bg-brand/20 blur-[100px] rounded-full" />
          </div>
        </div>

        <div className="lg:col-span-4 bg-card rounded-[40px] overflow-hidden border border-white/10 flex flex-col">
          <div className="w-full aspect-[3/4] bg-gradient-to-br from-brand/30 via-streak-ai/20 to-streak-interview/30 grid place-items-center">
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/40">
              Creator Story
            </span>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-xl font-bold">Alex Rivers</h4>
                <p className="text-xs text-white/40 uppercase tracking-widest">Serial Founder • SF</p>
              </div>
              <div className="px-3 py-1 bg-brand rounded-full text-black font-extrabold text-xs">
                42 DAY STREAK
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-1 flex-1 rounded-full" style={{ background: "var(--brand)" }} />
              <div className="h-1 flex-1 rounded-full" style={{ background: "var(--streak-coding)" }} />
              <div className="h-1 flex-1 rounded-full" style={{ background: "var(--streak-fitness)" }} />
              <div className="h-1 flex-1 bg-white/20 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* PROOF OVER PROMISES */}
      <section className="px-6 py-20 bg-brand text-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <h2 className="text-5xl md:text-7xl font-extrabold italic uppercase leading-[0.8] mb-8">
              PROOF OVER <br />PROMISES.
            </h2>
            <div className="space-y-6">
              <FeatureRow title="Proof-Based Posts" body="Every status update requires a tangible artifact of progress — a commit, a screenshot, a certificate." />
              <FeatureRow title="Future Vault" body="Lock messages for your future self. Only unlocks when you hit your milestones." />
              <FeatureRow title="Accountability Partners" body="Pair with someone chasing the same goal. Weekly check-ins, real momentum." />
              <FeatureRow title="Startup Idea Drops" body="Post an idea. Find collaborators. Get voted into reality." />
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="w-full aspect-square bg-black rounded-3xl p-10 flex flex-col justify-between text-brand">
              <div className="text-xs uppercase tracking-[0.3em] opacity-60">Vault.unlock</div>
              <div>
                <div className="font-display text-7xl font-extrabold italic">2027</div>
                <div className="mt-2 text-white/50 text-sm">"Did you ship the thing?"</div>
              </div>
              <div className="flex gap-2">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-1 flex-1 rounded-full bg-brand/30" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-32 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold italic uppercase mb-6">
            Ready to upgrade your social circle?
          </h2>
          <p className="text-white/60 mb-10 text-lg">
            Join the ambitious tracking their journey to the top.
          </p>
          <Link
            to="/signup"
            className="inline-block px-10 py-4 bg-brand text-black font-extrabold rounded-2xl hover:scale-105 transition-transform"
          >
            CLAIM YOUR HANDLE
          </Link>
        </div>
      </section>

      <footer className="px-6 py-12 border-t border-white/10 text-center">
        <p className="text-xs text-white/30 uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} MINDSYNC PLATFORM • ALL SYSTEMS OPERATIONAL
        </p>
      </footer>
    </div>
  );
}

function FeatureRow({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex gap-4">
      <div className="size-6 mt-1 flex-shrink-0 bg-black rounded-full" />
      <div>
        <p className="font-bold text-xl uppercase">{title}</p>
        <p className="opacity-70">{body}</p>
      </div>
    </div>
  );
}

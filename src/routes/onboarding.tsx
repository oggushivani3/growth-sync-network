import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { INTERESTS } from "@/lib/interests";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [{ title: "Onboarding — MindSync" }],
  }),
  component: Onboarding,
});

function Onboarding() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [goal, setGoal] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [skills, setSkills] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  function toggleInterest(i: string) {
    setInterests((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]));
  }

  async function finish() {
    if (!user) return;
    if (username.trim().length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    if (interests.length < 2) {
      toast.error("Pick at least 2 interests for mindset matching");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      username: username.trim().toLowerCase(),
      bio: bio.trim() || null,
      career_goal: goal.trim() || null,
      interests,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      onboarded: true,
    }).eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile ready. Time to ship.");
    navigate({ to: "/profile" });
  }

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-12">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition ${i <= step ? "bg-brand" : "bg-white/10"}`}
            />
          ))}
        </div>

        {step === 0 && (
          <Section
            title="Claim your handle"
            subtitle="Your unique identifier on MindSync."
            onNext={() => {
              if (username.trim().length < 3) return toast.error("Min 3 characters");
              setStep(1);
            }}
          >
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2 block">
                Username
              </span>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus-within:border-brand">
                <span className="text-white/40 mr-1">@</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-z0-9_]/gi, ""))}
                  placeholder="alex_ships"
                  maxLength={30}
                  className="flex-1 bg-transparent focus:outline-none"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2 block">
                Bio (optional)
              </span>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 160))}
                placeholder="Building in public. Coffee, code, repeat."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand resize-none"
              />
              <span className="text-xs text-white/30 mt-1 block text-right">{bio.length}/160</span>
            </label>
          </Section>
        )}

        {step === 1 && (
          <Section
            title="Mindset Matching"
            subtitle="Pick what you're chasing. We'll match you with people moving at your frequency."
            onBack={() => setStep(0)}
            onNext={() => {
              if (interests.length < 2) return toast.error("Pick at least 2");
              setStep(2);
            }}
          >
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((i) => {
                const on = interests.includes(i);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleInterest(i)}
                    className={`px-4 py-2 rounded-full border text-sm font-semibold transition ${
                      on
                        ? "bg-brand text-black border-brand"
                        : "bg-white/5 border-white/10 hover:border-white/30"
                    }`}
                  >
                    {i}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-white/40 mt-4">{interests.length} selected</p>
          </Section>
        )}

        {step === 2 && (
          <Section
            title="What are you building toward?"
            subtitle="Set the north star. You can change it anytime."
            onBack={() => setStep(1)}
            onNext={finish}
            nextLabel={saving ? "SAVING..." : "ENTER MINDSYNC"}
            disabled={saving}
          >
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2 block">
                Career goal
              </span>
              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value.slice(0, 120))}
                placeholder="Land my first FAANG offer by Dec 2026"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand"
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2 block">
                Skills (comma separated)
              </span>
              <input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Python, System Design"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-brand"
              />
            </label>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({
  title, subtitle, children, onBack, onNext, nextLabel = "CONTINUE", disabled,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <h1 className="font-display text-4xl md:text-5xl font-extrabold italic uppercase mb-3">{title}</h1>
      <p className="text-white/50 mb-8">{subtitle}</p>
      <div className="space-y-5">{children}</div>
      <div className="mt-10 flex gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10"
          >
            BACK
          </button>
        )}
        <button
          onClick={onNext}
          disabled={disabled}
          className="flex-1 px-6 py-3.5 bg-brand text-black font-extrabold rounded-2xl hover:scale-[1.02] transition-transform disabled:opacity-60"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

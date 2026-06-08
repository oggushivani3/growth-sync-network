import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Match = {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  interests: string[];
  career_goal: string | null;
  overlap: string[];
  score: number;
  reason: string;
};

export const getMindsetMatches = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Match[]> => {
    const { supabase, userId } = context;

    const { data: me } = await supabase
      .from("profiles")
      .select("id, bio, interests, career_goal")
      .eq("id", userId)
      .maybeSingle();

    if (!me) return [];
    const myInterests = (me.interests ?? []) as string[];

    const { data: candidates } = await supabase
      .from("profiles")
      .select("id, username, display_name, bio, interests, career_goal")
      .neq("id", userId)
      .eq("onboarded", true)
      .limit(50);

    if (!candidates || candidates.length === 0) return [];

    // Score by interest overlap + bio cosine-ish (simple keyword overlap as fallback)
    const scored = candidates.map((c) => {
      const cInterests = (c.interests ?? []) as string[];
      const overlap = cInterests.filter((i) => myInterests.includes(i));
      const interestScore = overlap.length / Math.max(myInterests.length, 1);
      const bioScore = bioSimilarity(me.bio ?? "", c.bio ?? "");
      const score = Math.round((interestScore * 0.5 + bioScore * 0.5) * 100);
      return { ...c, overlap, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, 8);

    // Ask Lovable AI for a 1-line "why match" for each top candidate.
    const apiKey = process.env.LOVABLE_API_KEY;
    let reasons: Record<string, string> = {};
    if (apiKey && top.length > 0) {
      try {
        const prompt = buildPrompt(me.bio ?? "", myInterests, me.career_goal ?? "", top);
        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": apiKey,
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              {
                role: "system",
                content:
                  "You match ambitious builders by mindset. For each candidate, return one short punchy reason (max 14 words) why these two should connect, grounded in their bios and interests. Respond as compact JSON {\"reasons\":[{\"id\":\"<id>\",\"reason\":\"...\"}]}. No prose.",
              },
              { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
          }),
        });
        if (res.ok) {
          const json = await res.json();
          const content = json?.choices?.[0]?.message?.content;
          if (typeof content === "string") {
            const parsed = JSON.parse(content);
            for (const r of parsed.reasons ?? []) {
              if (r?.id && r?.reason) reasons[r.id] = String(r.reason);
            }
          }
        }
      } catch (e) {
        console.error("ai match reasons failed", e);
      }
    }

    return top.map((c) => ({
      id: c.id,
      username: c.username,
      display_name: c.display_name,
      bio: c.bio,
      interests: (c.interests ?? []) as string[],
      career_goal: c.career_goal,
      overlap: c.overlap,
      score: c.score,
      reason:
        reasons[c.id] ??
        (c.overlap.length > 0
          ? `Shared focus on ${c.overlap.slice(0, 2).join(" & ")}.`
          : "Complementary builder energy."),
    }));
  });

function bioSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  const tok = (s: string) =>
    new Set(
      s
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3),
    );
  const A = tok(a);
  const B = tok(b);
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  return inter / Math.sqrt(A.size * B.size);
}

function buildPrompt(
  myBio: string,
  myInterests: string[],
  myGoal: string,
  candidates: Array<{ id: string; bio: string | null; interests: unknown; career_goal: string | null; display_name: string | null }>,
) {
  return JSON.stringify({
    me: { bio: myBio, interests: myInterests, goal: myGoal },
    candidates: candidates.map((c) => ({
      id: c.id,
      name: c.display_name,
      bio: c.bio,
      interests: c.interests,
      goal: c.career_goal,
    })),
  });
}

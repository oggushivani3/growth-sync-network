import { T as TSS_SERVER_FUNCTION, a as createServerFn } from "./server-CH1Jykwh.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-LE0CZ32P.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const getMindsetMatches_createServerFn_handler = createServerRpc({
  id: "51a7de1f6b4128453bcca3bb79867bc7d069c18708ab3e5f046094858802554e",
  name: "getMindsetMatches",
  filename: "src/lib/match.functions.ts"
}, (opts) => getMindsetMatches.__executeServer(opts));
const getMindsetMatches = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(getMindsetMatches_createServerFn_handler, async ({
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: me
  } = await supabase.from("profiles").select("id, bio, interests, career_goal").eq("id", userId).maybeSingle();
  if (!me) return [];
  const myInterests = me.interests ?? [];
  const {
    data: candidates
  } = await supabase.from("profiles").select("id, username, display_name, bio, interests, career_goal").neq("id", userId).eq("onboarded", true).limit(50);
  if (!candidates || candidates.length === 0) return [];
  const scored = candidates.map((c) => {
    const cInterests = c.interests ?? [];
    const overlap = cInterests.filter((i) => myInterests.includes(i));
    const interestScore = overlap.length / Math.max(myInterests.length, 1);
    const bioScore = bioSimilarity(me.bio ?? "", c.bio ?? "");
    const score = Math.round((interestScore * 0.5 + bioScore * 0.5) * 100);
    return {
      ...c,
      overlap,
      score
    };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 8);
  const apiKey = process.env.LOVABLE_API_KEY;
  let reasons = {};
  if (apiKey && top.length > 0) {
    try {
      const prompt = buildPrompt(me.bio ?? "", myInterests, me.career_goal ?? "", top);
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": apiKey
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{
            role: "system",
            content: 'You match ambitious builders by mindset. For each candidate, return one short punchy reason (max 14 words) why these two should connect, grounded in their bios and interests. Respond as compact JSON {"reasons":[{"id":"<id>","reason":"..."}]}. No prose.'
          }, {
            role: "user",
            content: prompt
          }],
          response_format: {
            type: "json_object"
          }
        })
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
    interests: c.interests ?? [],
    career_goal: c.career_goal,
    overlap: c.overlap,
    score: c.score,
    reason: reasons[c.id] ?? (c.overlap.length > 0 ? `Shared focus on ${c.overlap.slice(0, 2).join(" & ")}.` : "Complementary builder energy.")
  }));
});
function bioSimilarity(a, b) {
  if (!a || !b) return 0;
  const tok = (s) => new Set(s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 3));
  const A = tok(a);
  const B = tok(b);
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  return inter / Math.sqrt(A.size * B.size);
}
function buildPrompt(myBio, myInterests, myGoal, candidates) {
  return JSON.stringify({
    me: {
      bio: myBio,
      interests: myInterests,
      goal: myGoal
    },
    candidates: candidates.map((c) => ({
      id: c.id,
      name: c.display_name,
      bio: c.bio,
      interests: c.interests,
      goal: c.career_goal
    }))
  });
}
export {
  getMindsetMatches_createServerFn_handler
};

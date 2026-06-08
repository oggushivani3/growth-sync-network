export const INTERESTS = [
  "Coding",
  "AI",
  "Data Science",
  "Startups",
  "Entrepreneurship",
  "Reading",
  "Fitness",
  "Design",
  "Public Speaking",
  "Interview Preparation",
  "Personal Growth",
] as const;

export type Interest = (typeof INTERESTS)[number];

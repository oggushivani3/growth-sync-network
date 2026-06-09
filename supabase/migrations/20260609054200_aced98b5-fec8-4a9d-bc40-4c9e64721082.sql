
ALTER TABLE public.circle_checkins
  ADD COLUMN IF NOT EXISTS study_hours numeric(5,2),
  ADD COLUMN IF NOT EXISTS snap_url text;

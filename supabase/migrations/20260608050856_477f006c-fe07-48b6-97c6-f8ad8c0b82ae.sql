
-- CIRCLES
CREATE TABLE public.circles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  interest_tag TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.circles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.circles TO authenticated;
GRANT ALL ON public.circles TO service_role;
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Circles are viewable by everyone" ON public.circles FOR SELECT USING (true);
CREATE POLICY "Authenticated can create circles" ON public.circles FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner can update circle" ON public.circles FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner can delete circle" ON public.circles FOR DELETE TO authenticated USING (auth.uid() = owner_id);
CREATE TRIGGER update_circles_updated_at BEFORE UPDATE ON public.circles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CIRCLE MEMBERS
CREATE TABLE public.circle_members (
  circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INT NOT NULL DEFAULT 0,
  last_checkin_date DATE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (circle_id, user_id)
);
GRANT SELECT ON public.circle_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.circle_members TO authenticated;
GRANT ALL ON public.circle_members TO service_role;
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members are viewable by everyone" ON public.circle_members FOR SELECT USING (true);
CREATE POLICY "Users can join circles" ON public.circle_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own membership" ON public.circle_members FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave circles" ON public.circle_members FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- CHECK-INS
CREATE TABLE public.circle_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_id UUID NOT NULL REFERENCES public.circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note TEXT,
  checkin_date DATE NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')::date,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (circle_id, user_id, checkin_date)
);
GRANT SELECT ON public.circle_checkins TO anon;
GRANT SELECT, INSERT, DELETE ON public.circle_checkins TO authenticated;
GRANT ALL ON public.circle_checkins TO service_role;
ALTER TABLE public.circle_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Check-ins are viewable by everyone" ON public.circle_checkins FOR SELECT USING (true);
CREATE POLICY "Members can check in" ON public.circle_checkins FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.circle_members m WHERE m.circle_id = circle_checkins.circle_id AND m.user_id = auth.uid()));
CREATE POLICY "Users can delete own check-ins" ON public.circle_checkins FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX circles_interest_tag_idx ON public.circles (interest_tag);
CREATE INDEX circle_members_user_idx ON public.circle_members (user_id);
CREATE INDEX circle_checkins_circle_date_idx ON public.circle_checkins (circle_id, checkin_date DESC);

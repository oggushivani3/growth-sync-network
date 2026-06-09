
-- Restrict SELECT on profiles, circle_members, circle_checkins to authenticated users only

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles viewable by authenticated users"
  ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Members are viewable by everyone" ON public.circle_members;
CREATE POLICY "Circle members viewable by authenticated users"
  ON public.circle_members FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Check-ins are viewable by everyone" ON public.circle_checkins;
CREATE POLICY "Check-ins viewable by authenticated users"
  ON public.circle_checkins FOR SELECT TO authenticated USING (true);

-- Revoke anon SELECT grants (authenticated retains via existing grant)
REVOKE SELECT ON public.profiles FROM anon;
REVOKE SELECT ON public.circle_members FROM anon;
REVOKE SELECT ON public.circle_checkins FROM anon;

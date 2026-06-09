
CREATE POLICY "Authenticated can view snaps"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'snaps');

CREATE POLICY "Users upload own snaps"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'snaps' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users delete own snaps"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'snaps' AND (storage.foldername(name))[1] = auth.uid()::text);

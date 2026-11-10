-- Private bucket: 5 MB per file, images only
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('images', 'images', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Each user may only use their own folder: images/{user_id}/...
create policy "Images: owner can read"
  on storage.objects for select to authenticated
  using (bucket_id = 'images' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Images: owner can upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'images' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Images: owner can update"
  on storage.objects for update to authenticated
  using (bucket_id = 'images' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'images' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Images: owner can delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'images' and (storage.foldername(name))[1] = (select auth.uid())::text);

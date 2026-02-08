-- Create avatars storage bucket
-- Run this in Supabase SQL Editor

-- Enable storage extension if not already enabled
-- CREATE EXTENSION IF NOT EXISTS storage;

-- Create the avatars bucket (do this in Supabase Dashboard > Storage or via SQL)
-- Note: This may need to be done in the Supabase Dashboard UI:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create a new bucket called "avatars"
-- 3. Make the bucket PUBLIC for public URL access

-- If the bucket exists, set the bucket to public
UPDATE storage.buckets
SET public = true
WHERE id = 'avatars';

-- Create policy to allow authenticated users to upload
CREATE POLICY "Users can upload their own avatars"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
);

-- Create policy to allow anyone to read avatars
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- Create policy to allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects
FOR DELETE
USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
);

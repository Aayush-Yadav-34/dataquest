-- Add 'locked' column to topics table for draft/published status
-- Run this migration in Supabase SQL Editor

ALTER TABLE topics ADD COLUMN IF NOT EXISTS locked BOOLEAN DEFAULT FALSE;

-- Comment: When locked = true, topic is in 'draft' status
-- When locked = false, topic is 'published'

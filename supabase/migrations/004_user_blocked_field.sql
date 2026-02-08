-- Add blocked field to users table
-- This allows admins to block users from accessing the platform

ALTER TABLE users ADD COLUMN IF NOT EXISTS blocked BOOLEAN DEFAULT FALSE;

-- Add index for querying blocked users
CREATE INDEX IF NOT EXISTS idx_users_blocked ON users(blocked);

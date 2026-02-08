-- Add weekly_xp field to users table for weekly leaderboard tracking
-- The weekly_xp field tracks XP earned this week and resets weekly

-- Add weekly_xp column
ALTER TABLE users ADD COLUMN IF NOT EXISTS weekly_xp INTEGER DEFAULT 0;

-- Add last_weekly_reset to track when XP was last reset
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_weekly_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for weekly leaderboard queries
CREATE INDEX IF NOT EXISTS idx_users_weekly_xp ON users(weekly_xp DESC);

-- Create weekly_reset_history table to archive weekly winners
CREATE TABLE IF NOT EXISTS weekly_reset_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reset_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    top_users JSONB NOT NULL, -- Array of top 10 users with their weekly XP
    total_participants INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

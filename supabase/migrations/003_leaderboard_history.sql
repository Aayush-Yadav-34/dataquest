-- Leaderboard History Migration
-- Tracks daily XP snapshots for calculating rank changes

-- Create leaderboard_history table
CREATE TABLE IF NOT EXISTS leaderboard_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    xp INTEGER NOT NULL,
    rank INTEGER NOT NULL,
    recorded_at DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, recorded_at)
);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_leaderboard_history_user_date 
    ON leaderboard_history(user_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_leaderboard_history_date 
    ON leaderboard_history(recorded_at DESC);

-- Enable RLS
ALTER TABLE leaderboard_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read leaderboard history (public data)
CREATE POLICY "Anyone can read leaderboard history" ON leaderboard_history
    FOR SELECT USING (true);

-- Only allow inserts from service role (scheduled jobs)
-- No user-level write access

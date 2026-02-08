-- Session Time Tracking
-- Tracks user sessions for time spent on platform

-- Create session_logs table
CREATE TABLE IF NOT EXISTS session_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_session_logs_user ON session_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_session_logs_start ON session_logs(session_start DESC);

-- Add total_time_spent column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_time_spent INTEGER DEFAULT 0;

-- Enable RLS
ALTER TABLE session_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running migration)
DROP POLICY IF EXISTS "Users can manage own sessions" ON session_logs;
DROP POLICY IF EXISTS "Admins can read all sessions" ON session_logs;

-- Users can manage their own session logs
CREATE POLICY "Users can manage own sessions" ON session_logs
    FOR ALL USING (auth.uid() = user_id);

-- Admins can read all sessions
CREATE POLICY "Admins can read all sessions" ON session_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Function to increment user's total time spent
CREATE OR REPLACE FUNCTION increment_time_spent(user_id_param UUID, seconds_param INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET total_time_spent = COALESCE(total_time_spent, 0) + seconds_param
    WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

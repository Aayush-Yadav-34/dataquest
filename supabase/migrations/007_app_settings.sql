-- App Settings table for storing application configuration
-- Uses key-value structure for flexibility

CREATE TABLE IF NOT EXISTS app_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

-- Insert default settings
INSERT INTO app_settings (key, value, description) VALUES
    ('maintenance_mode', 'false', 'When enabled, only admins can access the platform'),
    ('allow_registration', 'true', 'Allow new user registrations'),
    ('session_time_tracking', 'true', 'Track user session duration'),
    ('auto_weekly_reset', 'false', 'Automatically reset weekly leaderboard'),
    ('weekly_reset_day', '"monday"', 'Day of week to reset weekly leaderboard'),
    ('email_notifications', 'false', 'Send weekly summary emails to users')
ON CONFLICT (key) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(key);

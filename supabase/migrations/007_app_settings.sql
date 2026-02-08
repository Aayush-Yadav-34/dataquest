-- App Settings table for storing platform configuration
-- Settings are stored as key-value pairs for flexibility

CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

-- Insert default settings
INSERT INTO app_settings (key, value, description) VALUES
    ('maintenance_mode', 'false', 'Enable maintenance mode to block non-admin access'),
    ('allow_registration', 'true', 'Allow new user registrations'),
    ('session_time_tracking', 'true', 'Track time users spend on the platform'),
    ('auto_weekly_reset', 'false', 'Automatically reset weekly leaderboard'),
    ('weekly_reset_day', 'monday', 'Day of week to reset leaderboard (sunday, monday, saturday)'),
    ('email_notifications', 'false', 'Send weekly summary emails to users')
ON CONFLICT (key) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(key);

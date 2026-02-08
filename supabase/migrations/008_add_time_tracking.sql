-- Add total_time_spent column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_time_spent INTEGER DEFAULT 0; -- in seconds

-- Add comment
COMMENT ON COLUMN users.total_time_spent IS 'Total time spent by the user on the platform in seconds';

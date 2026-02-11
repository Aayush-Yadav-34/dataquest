-- Seed predefined badges
-- Badge criteria_type: 'xp', 'topics', 'quizzes', 'streak'
-- criteria_value: the threshold to earn the badge

INSERT INTO badges (name, description, icon, criteria_type, criteria_value) VALUES
  ('First Steps', 'Earn your first 100 XP', '🎯', 'xp', 100),
  ('Rising Star', 'Reach 500 XP', '⭐', 'xp', 500),
  ('Knowledge Seeker', 'Reach 1,000 XP', '🧠', 'xp', 1000),
  ('XP Master', 'Reach 5,000 XP', '💎', 'xp', 5000),
  ('Quiz Rookie', 'Complete your first quiz', '📝', 'quizzes', 1),
  ('Quiz Pro', 'Complete 5 quizzes', '🏅', 'quizzes', 5),
  ('Quiz Legend', 'Complete 20 quizzes', '👑', 'quizzes', 20),
  ('Topic Explorer', 'Complete your first topic', '📚', 'topics', 1),
  ('Scholar', 'Complete 3 topics', '🎓', 'topics', 3),
  ('Master Scholar', 'Complete all topics', '🏆', 'topics', 6),
  ('On Fire', 'Maintain a 3-day streak', '🔥', 'streak', 3),
  ('Dedicated', 'Maintain a 7-day streak', '💪', 'streak', 7),
  ('Unstoppable', 'Maintain a 30-day streak', '⚡', 'streak', 30)
ON CONFLICT (name) DO NOTHING;

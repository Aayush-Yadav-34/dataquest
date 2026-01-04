import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
  locked: boolean;
}

export interface Activity {
  id: string;
  type: 'quiz' | 'theory' | 'upload' | 'achievement';
  title: string;
  description: string;
  xpEarned: number;
  timestamp: Date;
}

export interface TopicProgress {
  topicId: string;
  completed: boolean;
  progress: number;
  lastAccessed?: Date;
}

export interface UserStats {
  topicsCompleted: number;
  totalTopics: number;
  quizAccuracy: number;
  totalQuizzes: number;
  correctAnswers: number;
  totalQuestions: number;
  rank: number;
  totalUsers: number;
  timeSpent: number; // in minutes
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  joinedAt: Date;
  college?: string;
}

interface UserState {
  profile: UserProfile | null;
  stats: UserStats;
  badges: Badge[];
  activities: Activity[];
  topicProgress: TopicProgress[];
  isLoading: boolean;
  
  // Actions
  setProfile: (profile: UserProfile) => void;
  updateXP: (amount: number) => void;
  updateStreak: () => void;
  addBadge: (badge: Badge) => void;
  addActivity: (activity: Activity) => void;
  updateTopicProgress: (topicId: string, progress: number, completed?: boolean) => void;
  updateStats: (stats: Partial<UserStats>) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

const calculateLevel = (xp: number): number => {
  // Level formula: level = floor(sqrt(xp / 100))
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

const initialStats: UserStats = {
  topicsCompleted: 12,
  totalTopics: 24,
  quizAccuracy: 78,
  totalQuizzes: 23,
  correctAnswers: 156,
  totalQuestions: 200,
  rank: 42,
  totalUsers: 1250,
  timeSpent: 1840,
};

const initialBadges: Badge[] = [
  { id: '1', name: 'First Steps', description: 'Complete your first topic', icon: '🎯', locked: false, earnedAt: new Date('2024-01-15') },
  { id: '2', name: 'Quiz Master', description: 'Score 100% on any quiz', icon: '🏆', locked: false, earnedAt: new Date('2024-01-20') },
  { id: '3', name: 'Data Explorer', description: 'Upload your first dataset', icon: '📊', locked: false, earnedAt: new Date('2024-02-01') },
  { id: '4', name: 'Week Warrior', description: '7-day learning streak', icon: '🔥', locked: false, earnedAt: new Date('2024-02-10') },
  { id: '5', name: 'Rising Star', description: 'Reach Level 10', icon: '⭐', locked: false, earnedAt: new Date('2024-03-01') },
  { id: '6', name: 'Algorithm Ace', description: 'Complete all ML algorithms', icon: '🤖', locked: true },
  { id: '7', name: 'Visualization Pro', description: 'Create 50 visualizations', icon: '📈', locked: true },
  { id: '8', name: 'Community Champion', description: 'Reach top 10 on leaderboard', icon: '👑', locked: true },
];

const initialActivities: Activity[] = [
  { id: '1', type: 'theory', title: 'Completed Linear Regression', description: 'Mastered the basics of linear regression', xpEarned: 50, timestamp: new Date('2024-03-20T10:30:00') },
  { id: '2', type: 'quiz', title: 'ML Fundamentals Quiz', description: 'Scored 90% on the quiz', xpEarned: 100, timestamp: new Date('2024-03-19T15:45:00') },
  { id: '3', type: 'upload', title: 'Dataset Analysis', description: 'Analyzed Iris dataset', xpEarned: 30, timestamp: new Date('2024-03-18T09:00:00') },
  { id: '4', type: 'achievement', title: 'Badge Earned!', description: 'Earned "Rising Star" badge', xpEarned: 200, timestamp: new Date('2024-03-15T12:00:00') },
];

const mockProfile: UserProfile = {
  id: 'user-1',
  username: 'DataWizard',
  email: 'datawizard@example.com',
  avatar: '/avatars/default.png',
  xp: 2450,
  level: 15,
  streak: 7,
  lastActiveDate: new Date().toISOString().split('T')[0],
  joinedAt: new Date('2024-01-01'),
  college: 'MIT',
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: mockProfile,
      stats: initialStats,
      badges: initialBadges,
      activities: initialActivities,
      topicProgress: [],
      isLoading: false,

      setProfile: (profile) => set({ profile }),

      updateXP: (amount) => set((state) => {
        if (!state.profile) return state;
        const newXP = state.profile.xp + amount;
        const newLevel = calculateLevel(newXP);
        return {
          profile: {
            ...state.profile,
            xp: newXP,
            level: newLevel,
          },
        };
      }),

      updateStreak: () => set((state) => {
        if (!state.profile) return state;
        const today = new Date().toISOString().split('T')[0];
        const lastActive = state.profile.lastActiveDate;
        
        if (lastActive === today) return state;
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        const newStreak = lastActive === yesterdayStr ? state.profile.streak + 1 : 1;
        
        return {
          profile: {
            ...state.profile,
            streak: newStreak,
            lastActiveDate: today,
          },
        };
      }),

      addBadge: (badge) => set((state) => ({
        badges: [...state.badges, badge],
      })),

      addActivity: (activity) => set((state) => ({
        activities: [activity, ...state.activities].slice(0, 50), // Keep last 50 activities
      })),

      updateTopicProgress: (topicId, progress, completed = false) => set((state) => {
        const existingIndex = state.topicProgress.findIndex(t => t.topicId === topicId);
        const newProgress: TopicProgress = {
          topicId,
          progress,
          completed,
          lastAccessed: new Date(),
        };
        
        if (existingIndex >= 0) {
          const updated = [...state.topicProgress];
          updated[existingIndex] = newProgress;
          return { topicProgress: updated };
        }
        
        return { topicProgress: [...state.topicProgress, newProgress] };
      }),

      updateStats: (newStats) => set((state) => ({
        stats: { ...state.stats, ...newStats },
      })),

      setLoading: (loading) => set({ isLoading: loading }),

      logout: () => set({
        profile: null,
        stats: initialStats,
        badges: [],
        activities: [],
        topicProgress: [],
      }),
    }),
    {
      name: 'dataquest-user-storage',
    }
  )
);

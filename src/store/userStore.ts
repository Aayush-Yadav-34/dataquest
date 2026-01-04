'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  xp: number;
  level: number;
  streak: number;
  role: 'user' | 'admin';
  joinedDate: string;
}

export interface UserStats {
  topicsCompleted: number;
  totalTopics: number;
  quizAccuracy: number;
  correctAnswers: number;
  totalQuestions: number;
  rank: number;
  totalUsers: number;
  timeSpent: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate?: string;
  locked: boolean;
}

export interface Activity {
  id: string;
  type: 'quiz' | 'theory' | 'upload' | 'achievement';
  title: string;
  description: string;
  xpEarned: number;
  timestamp: string;
}

export interface TopicProgress {
  topicId: string;
  progress: number;
  completed: boolean;
  lastAccessed: string;
}

interface UserState {
  // State
  profile: UserProfile | null;
  stats: UserStats;
  badges: Badge[];
  activities: Activity[];
  topicProgress: TopicProgress[];
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setProfile: (profile: UserProfile | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateStats: (stats: Partial<UserStats>) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  updateTopicProgress: (topicId: string, progress: number) => void;
  addXP: (amount: number) => void;
  fetchUserData: () => Promise<void>;
}

// Default stats for new users
const defaultStats: UserStats = {
  topicsCompleted: 0,
  totalTopics: 12,
  quizAccuracy: 0,
  correctAnswers: 0,
  totalQuestions: 0,
  rank: 0,
  totalUsers: 1000,
  timeSpent: 0,
};

// Default badges
const defaultBadges: Badge[] = [
  { id: '1', name: 'First Steps', description: 'Complete your first topic', icon: '🎯', locked: true },
  { id: '2', name: 'Quiz Master', description: 'Score 100% on any quiz', icon: '🏆', locked: true },
  { id: '3', name: 'Data Explorer', description: 'Upload your first dataset', icon: '📊', locked: true },
  { id: '4', name: 'Week Warrior', description: '7-day learning streak', icon: '🔥', locked: true },
  { id: '5', name: 'Rising Star', description: 'Reach Level 10', icon: '⭐', locked: true },
  { id: '6', name: 'Algorithm Ace', description: 'Complete all ML algorithms', icon: '🤖', locked: true },
];

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: null,
      stats: defaultStats,
      badges: defaultBadges,
      activities: [],
      topicProgress: [],
      isAuthenticated: false,
      isLoading: false,

      // Set profile
      setProfile: (profile) => set({ profile, isAuthenticated: !!profile }),

      // Set authenticated
      setAuthenticated: (value) => set({ isAuthenticated: value }),

      // Set loading
      setLoading: (value) => set({ isLoading: value }),

      // Login with email/password (uses mock for now, can connect to API)
      login: async (email: string, password: string) => {
        set({ isLoading: true });

        try {
          // Mock users for demo purposes
          const mockUsers = [
            {
              id: 'admin-1',
              email: 'admin@dataquest.com',
              password: 'admin123',
              username: 'Admin',
              role: 'admin' as const,
              xp: 5000,
              level: 8,
              streak: 30,
            },
            {
              id: 'user-1',
              email: 'user@example.com',
              password: 'user123',
              username: 'DataWizard',
              role: 'user' as const,
              xp: 1250,
              level: 5,
              streak: 7,
            },
          ];

          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));

          const user = mockUsers.find(u => u.email === email && u.password === password);

          if (user) {
            const profile: UserProfile = {
              id: user.id,
              email: user.email,
              username: user.username,
              avatar: undefined,
              xp: user.xp,
              level: user.level,
              streak: user.streak,
              role: user.role,
              joinedDate: new Date().toISOString(),
            };

            set({
              profile,
              isAuthenticated: true,
              isLoading: false,
              stats: {
                ...defaultStats,
                topicsCompleted: user.role === 'admin' ? 8 : 3,
                quizAccuracy: user.role === 'admin' ? 92 : 78,
                correctAnswers: user.role === 'admin' ? 45 : 15,
                totalQuestions: user.role === 'admin' ? 49 : 19,
                rank: user.role === 'admin' ? 5 : 42,
              },
              badges: defaultBadges.map((b, i) => ({
                ...b,
                locked: i > (user.role === 'admin' ? 4 : 2),
                earnedDate: i <= (user.role === 'admin' ? 4 : 2) ? new Date().toISOString() : undefined,
              })),
            });

            return { success: true };
          }

          set({ isLoading: false });
          return { success: false, error: 'Invalid email or password' };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'Login failed. Please try again.' };
        }
      },

      // Logout
      logout: () => {
        set({
          profile: null,
          isAuthenticated: false,
          stats: defaultStats,
          badges: defaultBadges,
          activities: [],
          topicProgress: [],
        });
      },

      // Fetch user data from API
      fetchUserData: async () => {
        const { profile } = get();
        if (!profile) return;

        try {
          // Fetch user stats, badges, activities from API
          const response = await fetch('/api/users');
          if (response.ok) {
            const data = await response.json();
            if (data.user) {
              set({
                profile: {
                  ...profile,
                  xp: data.user.xp,
                  level: data.user.level,
                  streak: data.user.streak,
                },
              });
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      },

      // Update stats
      updateStats: (newStats) => {
        set((state) => ({
          stats: { ...state.stats, ...newStats },
        }));
      },

      // Add activity
      addActivity: (activity) => {
        const newActivity: Activity = {
          ...activity,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          activities: [newActivity, ...state.activities].slice(0, 50),
        }));
      },

      // Update topic progress
      updateTopicProgress: (topicId, progress) => {
        set((state) => {
          const existing = state.topicProgress.find(tp => tp.topicId === topicId);
          if (existing) {
            return {
              topicProgress: state.topicProgress.map(tp =>
                tp.topicId === topicId
                  ? { ...tp, progress, completed: progress >= 100, lastAccessed: new Date().toISOString() }
                  : tp
              ),
            };
          }
          return {
            topicProgress: [
              ...state.topicProgress,
              { topicId, progress, completed: progress >= 100, lastAccessed: new Date().toISOString() },
            ],
          };
        });
      },

      // Add XP
      addXP: (amount) => {
        set((state) => {
          if (!state.profile) return state;
          const newXP = state.profile.xp + amount;
          const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
          return {
            profile: {
              ...state.profile,
              xp: newXP,
              level: newLevel,
            },
          };
        });
      },
    }),
    {
      name: 'dataquest-user-storage',
      partialize: (state) => ({
        profile: state.profile,
        stats: state.stats,
        badges: state.badges,
        activities: state.activities,
        topicProgress: state.topicProgress,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

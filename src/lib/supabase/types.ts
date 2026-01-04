// Database types for Supabase
// These match the schema defined in the implementation plan

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    username: string;
                    avatar_url: string | null;
                    xp: number;
                    level: number;
                    streak: number;
                    last_active: string | null;
                    role: 'user' | 'admin';
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    email: string;
                    username: string;
                    avatar_url?: string | null;
                    xp?: number;
                    level?: number;
                    streak?: number;
                    last_active?: string | null;
                    role?: 'user' | 'admin';
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    username?: string;
                    avatar_url?: string | null;
                    xp?: number;
                    level?: number;
                    streak?: number;
                    last_active?: string | null;
                    role?: 'user' | 'admin';
                    created_at?: string;
                };
            };
            topics: {
                Row: {
                    id: string;
                    title: string;
                    description: string;
                    category: string;
                    difficulty: 'beginner' | 'intermediate' | 'advanced';
                    icon: string;
                    xp_reward: number;
                    estimated_time: number;
                    content: Json;
                    order_index: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    description: string;
                    category: string;
                    difficulty: 'beginner' | 'intermediate' | 'advanced';
                    icon?: string;
                    xp_reward?: number;
                    estimated_time?: number;
                    content?: Json;
                    order_index?: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    description?: string;
                    category?: string;
                    difficulty?: 'beginner' | 'intermediate' | 'advanced';
                    icon?: string;
                    xp_reward?: number;
                    estimated_time?: number;
                    content?: Json;
                    order_index?: number;
                    created_at?: string;
                };
            };
            user_progress: {
                Row: {
                    id: string;
                    user_id: string;
                    topic_id: string;
                    progress: number;
                    completed: boolean;
                    last_accessed: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    topic_id: string;
                    progress?: number;
                    completed?: boolean;
                    last_accessed?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    topic_id?: string;
                    progress?: number;
                    completed?: boolean;
                    last_accessed?: string;
                };
            };
            badges: {
                Row: {
                    id: string;
                    name: string;
                    description: string;
                    icon: string;
                    criteria_type: string;
                    criteria_value: number;
                };
                Insert: {
                    id?: string;
                    name: string;
                    description: string;
                    icon?: string;
                    criteria_type: string;
                    criteria_value: number;
                };
                Update: {
                    id?: string;
                    name?: string;
                    description?: string;
                    icon?: string;
                    criteria_type?: string;
                    criteria_value?: number;
                };
            };
            user_badges: {
                Row: {
                    id: string;
                    user_id: string;
                    badge_id: string;
                    earned_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    badge_id: string;
                    earned_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    badge_id?: string;
                    earned_at?: string;
                };
            };
            quizzes: {
                Row: {
                    id: string;
                    topic_id: string;
                    title: string;
                    time_limit: number;
                    xp_reward: number;
                };
                Insert: {
                    id?: string;
                    topic_id: string;
                    title: string;
                    time_limit?: number;
                    xp_reward?: number;
                };
                Update: {
                    id?: string;
                    topic_id?: string;
                    title?: string;
                    time_limit?: number;
                    xp_reward?: number;
                };
            };
            quiz_questions: {
                Row: {
                    id: string;
                    quiz_id: string;
                    question: string;
                    options: Json;
                    correct_answer: number;
                    explanation: string | null;
                };
                Insert: {
                    id?: string;
                    quiz_id: string;
                    question: string;
                    options: Json;
                    correct_answer: number;
                    explanation?: string | null;
                };
                Update: {
                    id?: string;
                    quiz_id?: string;
                    question?: string;
                    options?: Json;
                    correct_answer?: number;
                    explanation?: string | null;
                };
            };
            quiz_attempts: {
                Row: {
                    id: string;
                    user_id: string;
                    quiz_id: string;
                    score: number;
                    total_questions: number;
                    time_taken: number;
                    completed_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    quiz_id: string;
                    score: number;
                    total_questions: number;
                    time_taken: number;
                    completed_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    quiz_id?: string;
                    score?: number;
                    total_questions?: number;
                    time_taken?: number;
                    completed_at?: string;
                };
            };
            activities: {
                Row: {
                    id: string;
                    user_id: string;
                    type: 'quiz' | 'theory' | 'upload' | 'achievement';
                    title: string;
                    description: string;
                    xp_earned: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    type: 'quiz' | 'theory' | 'upload' | 'achievement';
                    title: string;
                    description: string;
                    xp_earned?: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    type?: 'quiz' | 'theory' | 'upload' | 'achievement';
                    title?: string;
                    description?: string;
                    xp_earned?: number;
                    created_at?: string;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
    };
}

// Convenience types
export type User = Database['public']['Tables']['users']['Row'];
export type Topic = Database['public']['Tables']['topics']['Row'];
export type UserProgress = Database['public']['Tables']['user_progress']['Row'];
export type Badge = Database['public']['Tables']['badges']['Row'];
export type UserBadge = Database['public']['Tables']['user_badges']['Row'];
export type Quiz = Database['public']['Tables']['quizzes']['Row'];
export type QuizQuestion = Database['public']['Tables']['quiz_questions']['Row'];
export type QuizAttempt = Database['public']['Tables']['quiz_attempts']['Row'];
export type Activity = Database['public']['Tables']['activities']['Row'];

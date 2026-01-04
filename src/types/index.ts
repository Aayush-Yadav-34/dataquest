// User Types
export interface User {
    id: string;
    username: string;
    email: string;
    avatar: string;
    xp: number;
    level: number;
    streak: number;
    college?: string;
    rank?: number;
}

// Topic Types
export interface Topic {
    id: string;
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    xpReward: number;
    estimatedTime: number; // in minutes
    locked: boolean;
    completed: boolean;
    progress: number;
    icon: string;
    prerequisites?: string[];
}

// Quiz Types
export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface Quiz {
    id: string;
    topicId: string;
    title: string;
    description: string;
    questions: QuizQuestion[];
    timeLimit: number; // in seconds
    xpReward: number;
    passingScore: number; // percentage
}

export interface QuizResult {
    quizId: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    timeTaken: number;
    xpEarned: number;
    passed: boolean;
}

// Leaderboard Types
export interface LeaderboardEntry {
    rank: number;
    userId: string;
    username: string;
    avatar: string;
    xp: number;
    level: number;
    college?: string;
    isCurrentUser?: boolean;
    change?: number; // rank change from previous period
}

// Dataset Types
export interface DatasetColumn {
    name: string;
    type: 'number' | 'string' | 'date' | 'boolean';
    nullCount: number;
    uniqueCount: number;
    mean?: number;
    median?: number;
    min?: number;
    max?: number;
    std?: number;
}

export interface DatasetSummary {
    rowCount: number;
    columnCount: number;
    columns: DatasetColumn[];
    missingValues: number;
    duplicateRows: number;
}

// Chart Types
export type ChartType = 'histogram' | 'boxplot' | 'scatter' | 'line' | 'bar' | 'heatmap' | 'pie';

export interface ChartConfig {
    type: ChartType;
    title: string;
    xAxis?: string;
    yAxis?: string;
    data: Record<string, unknown>[];
}

// Theory Content Types
export interface TheorySection {
    id: string;
    title: string;
    content: string; // Markdown content
    visualizations?: ChartConfig[];
}

export interface TheoryModule {
    topicId: string;
    sections: TheorySection[];
}

// Admin Types
export interface AdminTopic {
    id: string;
    title: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    status: 'published' | 'draft';
    questionsCount: number;
    studentsCompleted: number;
    createdAt: Date;
    updatedAt: Date;
}

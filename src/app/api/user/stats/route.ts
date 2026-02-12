import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/user/stats - Get user statistics for progress charts
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        // Fetch all topics for skill data
        const { data: topics } = await supabase
            .from('topics')
            .select('id, title, icon')
            .order('order_index', { ascending: true });

        // Fetch user progress on topics
        const { data: topicProgress } = await supabase
            .from('user_progress')
            .select('topic_id, progress, completed')
            .eq('user_id', userId);

        // Fetch quiz attempts with dates for trend data
        const { data: quizAttempts } = await supabase
            .from('quiz_attempts')
            .select(`
                id,
                quiz_id,
                score,
                total_questions,
                completed_at,
                quizzes (
                    topic_id
                )
            `)
            .eq('user_id', userId)
            .order('completed_at', { ascending: true });

        // Build skill data (topic mastery)
        const skillsData = topics?.map(topic => {
            const progress = topicProgress?.find(p => p.topic_id === topic.id);
            // Calculate skill based on topic progress and quiz performance
            const topicQuizzes = quizAttempts?.filter(
                (a: any) => a.quizzes?.topic_id === topic.id
            ) || [];

            let skillScore = progress?.progress || 0;

            // Boost skill score based on quiz performance
            // Note: score in quiz_attempts is already a percentage (0-100)
            if (topicQuizzes.length > 0) {
                const avgQuizScore = topicQuizzes.reduce((sum: number, a: any) =>
                    sum + a.score, 0
                ) / topicQuizzes.length;
                skillScore = Math.round((skillScore + avgQuizScore) / 2);
            }

            return {
                topic: topic.title,
                icon: topic.icon,
                score: Math.min(skillScore, 100),
            };
        }) || [];

        // Build accuracy trend data (last 7 days/attempts)
        const accuracyTrend: { date: string; accuracy: number }[] = [];
        if (quizAttempts && quizAttempts.length > 0) {
            // Group by date
            const attemptsByDate = new Map<string, { total: number; correct: number }>();

            quizAttempts.forEach((attempt: any) => {
                const date = new Date(attempt.completed_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                });

                if (!attemptsByDate.has(date)) {
                    attemptsByDate.set(date, { total: 0, correct: 0 });
                }

                const current = attemptsByDate.get(date)!;
                // score is already a percentage, just accumulate for averaging
                current.total += 1;
                current.correct += attempt.score;
            });

            // Convert to array (last 7 entries)
            const entries = Array.from(attemptsByDate.entries()).slice(-7);
            entries.forEach(([date, data]) => {
                accuracyTrend.push({
                    date,
                    // correct is sum of scores, total is count of attempts
                    accuracy: Math.round(data.correct / data.total),
                });
            });
        }

        // If no data, provide sample dates with 0%
        if (accuracyTrend.length === 0) {
            const today = new Date();
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                accuracyTrend.push({
                    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    accuracy: 0,
                });
            }
        }

        // Build time spent data (simulated based on quiz attempts and topic progress)
        const timeSpentData = topics?.map(topic => {
            const progress = topicProgress?.find(p => p.topic_id === topic.id);
            const topicQuizzes = quizAttempts?.filter(
                (a: any) => a.quizzes?.topic_id === topic.id
            ) || [];

            // Estimate time: 10 min per topic completion percentage point + 5 min per quiz
            const readingTime = (progress?.progress || 0) * 0.1;
            const quizTime = topicQuizzes.length * 5;

            return {
                topic: topic.title,
                hours: Math.round((readingTime + quizTime) / 60 * 10) / 10, // Round to 1 decimal
            };
        }) || [];

        // Build weekly activity data (last 7 days)
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // Fetch session logs for the last 7 days
        const { data: sessionLogs } = await supabase
            .from('session_logs' as any)
            .select('session_start, duration_seconds')
            .eq('user_id', userId)
            .gte('session_start', sevenDaysAgo.toISOString())
            .not('duration_seconds', 'is', null);

        // Build a map of day -> { minutes, xp }
        const weekMap = new Map<string, { minutes: number; xp: number }>();

        // Initialize all 7 days
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dayKey = d.toISOString().split('T')[0]; // YYYY-MM-DD
            weekMap.set(dayKey, { minutes: 0, xp: 0 });
        }

        // Add session durations
        if (sessionLogs && Array.isArray(sessionLogs)) {
            (sessionLogs as any[]).forEach((log: any) => {
                const dayKey = new Date(log.session_start).toISOString().split('T')[0];
                if (weekMap.has(dayKey)) {
                    const entry = weekMap.get(dayKey)!;
                    entry.minutes += Math.round((log.duration_seconds || 0) / 60);
                }
            });
        }

        // Add quiz XP for each day
        if (quizAttempts) {
            (quizAttempts as any[]).forEach((attempt: any) => {
                if (!attempt.completed_at) return;
                const dayKey = new Date(attempt.completed_at).toISOString().split('T')[0];
                if (weekMap.has(dayKey)) {
                    const entry = weekMap.get(dayKey)!;
                    // Estimate XP: score percentage applied to base quiz XP (50)
                    entry.xp += Math.round((attempt.score / 100) * 50);
                    // If no session data, estimate 5 min per quiz attempt
                    if (entry.minutes === 0) {
                        entry.minutes += 5;
                    }
                }
            });
        }

        // Convert to array, ordered Mon-Sun starting from 7 days ago
        const weeklyActivity = Array.from(weekMap.entries()).map(([dateStr, data]) => {
            const d = new Date(dateStr + 'T00:00:00');
            return {
                day: dayNames[d.getDay()],
                minutes: data.minutes,
                xp: data.xp,
            };
        });

        // Calculate summary stats
        const completedTopics = topicProgress?.filter(p => p.completed).length || 0;
        const totalQuizzes = quizAttempts?.length || 0;
        // Score is already a percentage (0-100), so just average the scores
        const averageAccuracy = quizAttempts && quizAttempts.length > 0
            ? Math.round(quizAttempts.reduce((sum: number, a: any) =>
                sum + a.score, 0
            ) / quizAttempts.length)
            : 0;

        return NextResponse.json({
            skillsData,
            accuracyTrend,
            timeSpentData,
            weeklyActivity,
            summary: {
                completedTopics,
                totalTopics: topics?.length || 0,
                totalQuizzes,
                averageAccuracy,
                totalHours: timeSpentData.reduce((sum, t) => sum + t.hours, 0),
            }
        });
    } catch (error) {
        console.error('Error in user stats API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

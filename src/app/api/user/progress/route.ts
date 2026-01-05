import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/user/progress - Get user's progress data
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

        // Fetch user progress on topics
        const { data: topicProgress, error: topicError } = await supabase
            .from('user_progress')
            .select(`
                id,
                topic_id,
                completed,
                progress,
                last_accessed,
                topics (
                    id,
                    title,
                    icon
                )
            `)
            .eq('user_id', userId);

        if (topicError) {
            console.error('Error fetching topic progress:', topicError);
        }

        // Fetch quiz attempts
        const { data: quizAttempts, error: attemptError } = await supabase
            .from('quiz_attempts')
            .select(`
                id,
                quiz_id,
                score,
                total_questions,
                completed_at,
                quizzes (
                    id,
                    title,
                    topic_id
                )
            `)
            .eq('user_id', userId)
            .order('completed_at', { ascending: false });

        if (attemptError) {
            console.error('Error fetching quiz attempts:', attemptError);
        }

        // Get total topics count
        const { count: totalTopics } = await supabase
            .from('topics')
            .select('*', { count: 'exact', head: true });

        // Get total quizzes count
        const { count: totalQuizzes } = await supabase
            .from('quizzes')
            .select('*', { count: 'exact', head: true });

        // Calculate stats
        const completedTopics = topicProgress?.filter(p => p.completed).length || 0;
        const totalQuizAttempts = quizAttempts?.length || 0;
        const passedQuizzes = quizAttempts?.filter(a => (a.score / a.total_questions) >= 0.7).length || 0;

        // Calculate average accuracy
        let averageAccuracy = 0;
        if (quizAttempts && quizAttempts.length > 0) {
            const totalAccuracy = quizAttempts.reduce((sum, attempt) => {
                return sum + (attempt.score / attempt.total_questions) * 100;
            }, 0);
            averageAccuracy = totalAccuracy / quizAttempts.length;
        }

        return NextResponse.json({
            progress: {
                topics: topicProgress || [],
                quizAttempts: quizAttempts || [],
            },
            stats: {
                completedTopics,
                totalTopics: totalTopics || 0,
                passedQuizzes,
                totalQuizzes: totalQuizzes || 0,
                totalQuizAttempts,
                averageAccuracy: Math.round(averageAccuracy),
            }
        });
    } catch (error) {
        console.error('Error in user progress API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/user/progress - Update topic progress
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const body = await request.json();
        const { topicId, progressPercent, completed } = body;

        if (!topicId) {
            return NextResponse.json(
                { error: 'topicId is required' },
                { status: 400 }
            );
        }

        // Check if progress record exists
        const { data: existing } = await supabase
            .from('user_progress')
            .select('id')
            .eq('user_id', userId)
            .eq('topic_id', topicId)
            .single();

        if (existing) {
            // Update existing record
            const { data, error } = await supabase
                .from('user_progress')
                .update({
                    progress: progressPercent ?? 0,
                    completed: completed ?? false,
                    last_accessed: new Date().toISOString(),
                })
                .eq('id', existing.id)
                .select()
                .single();

            if (error) {
                console.error('Error updating progress:', error);
                return NextResponse.json(
                    { error: 'Failed to update progress' },
                    { status: 500 }
                );
            }

            return NextResponse.json({ progress: data });
        } else {
            // Create new record
            const { data, error } = await supabase
                .from('user_progress')
                .insert({
                    user_id: userId,
                    topic_id: topicId,
                    progress: progressPercent ?? 0,
                    completed: completed ?? false,
                    last_accessed: new Date().toISOString(),
                })
                .select()
                .single();

            if (error) {
                console.error('Error creating progress:', error);
                return NextResponse.json(
                    { error: 'Failed to create progress' },
                    { status: 500 }
                );
            }

            return NextResponse.json({ progress: data });
        }
    } catch (error) {
        console.error('Error in user progress POST:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

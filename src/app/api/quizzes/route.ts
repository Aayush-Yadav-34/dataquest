import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET /api/quizzes - List all quizzes
export async function GET(request: NextRequest) {
    try {
        // Create direct supabase client for simpler queries
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { searchParams } = new URL(request.url);
        const topicId = searchParams.get('topicId');

        // Simple query first - just get quizzes
        let query = supabase
            .from('quizzes')
            .select('id, title, time_limit, xp_reward, topic_id')
            .order('title', { ascending: true });

        // Filter by topic if provided
        if (topicId) {
            query = query.eq('topic_id', topicId);
        }

        const { data: quizzes, error } = await query;

        if (error) {
            console.error('Error fetching quizzes:', error);
            return NextResponse.json(
                { error: 'Failed to fetch quizzes', details: error.message },
                { status: 500 }
            );
        }

        // Get topics for enrichment
        const { data: topics } = await supabase
            .from('topics')
            .select('id, title, icon, category, difficulty');

        // Get question counts per quiz
        const { data: questionCounts } = await supabase
            .from('quiz_questions')
            .select('quiz_id');

        // Create maps for quick lookup
        const topicsMap = new Map(topics?.map(t => [t.id, t]) || []);
        const questionCountMap = new Map<string, number>();
        questionCounts?.forEach(q => {
            const count = questionCountMap.get(q.quiz_id) || 0;
            questionCountMap.set(q.quiz_id, count + 1);
        });

        // Transform to include question count and topic
        const transformedQuizzes = quizzes?.map((quiz) => ({
            id: quiz.id,
            title: quiz.title,
            timeLimit: quiz.time_limit,
            xpReward: quiz.xp_reward,
            topicId: quiz.topic_id,
            topic: topicsMap.get(quiz.topic_id) || null,
            questionCount: questionCountMap.get(quiz.id) || 0,
            passingScore: 70,
        })) || [];

        return NextResponse.json({ quizzes: transformedQuizzes });
    } catch (error) {
        console.error('Error in quizzes API:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}

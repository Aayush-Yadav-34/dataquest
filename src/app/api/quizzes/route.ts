import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';

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

// POST /api/quizzes - Create new quiz (admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Check if user is admin
        const { data: user } = await supabase
            .from('users')
            .select('role')
            .eq('email', session.user.email)
            .single();

        if (user?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Forbidden: Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { title, topic_id, time_limit, xp_reward, questions } = body;

        if (!title || !topic_id) {
            return NextResponse.json(
                { error: 'Title and topic_id are required' },
                { status: 400 }
            );
        }

        // Create the quiz first
        const { data: newQuiz, error: quizError } = await supabase
            .from('quizzes')
            .insert({
                title,
                topic_id,
                time_limit: time_limit || 10,
                xp_reward: xp_reward || 50,
            })
            .select()
            .single();

        if (quizError) {
            console.error('Error creating quiz:', quizError);
            return NextResponse.json(
                { error: 'Failed to create quiz' },
                { status: 500 }
            );
        }

        // Add questions if provided
        if (questions && Array.isArray(questions) && questions.length > 0) {
            const questionsToInsert = questions.map((q: any) => ({
                quiz_id: newQuiz.id,
                question: q.question,
                options: q.options,
                correct_answer: q.correctAnswer || q.correct_answer,
                explanation: q.explanation || '',
            }));

            const { error: questionsError } = await supabase
                .from('quiz_questions')
                .insert(questionsToInsert);

            if (questionsError) {
                console.error('Error creating questions:', questionsError);
                // Quiz was created but questions failed - still return success but with warning
                return NextResponse.json({
                    quiz: newQuiz,
                    warning: 'Quiz created but some questions failed to save',
                }, { status: 201 });
            }
        }

        return NextResponse.json({ quiz: newQuiz }, { status: 201 });
    } catch (error) {
        console.error('Error creating quiz:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}


import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';

// GET /api/quizzes/[id] - Get quiz with questions
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = createServiceRoleClient();

        // Get quiz with questions
        const { data: quiz, error } = await supabase
            .from('quizzes')
            .select(`
                id,
                title,
                time_limit,
                xp_reward,
                topic_id,
                topics (
                    id,
                    title,
                    icon,
                    category,
                    difficulty
                ),
                quiz_questions (
                    id,
                    question,
                    options,
                    correct_answer,
                    explanation
                )
            `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching quiz:', error);
            return NextResponse.json(
                { error: 'Quiz not found' },
                { status: 404 }
            );
        }

        // Transform to frontend format
        const transformedQuiz = {
            id: quiz.id,
            title: quiz.title,
            timeLimit: quiz.time_limit,
            xpReward: quiz.xp_reward,
            topicId: quiz.topic_id,
            topic: quiz.topics,
            passingScore: 70,
            questions: quiz.quiz_questions?.map((q: any) => ({
                id: q.id,
                question: q.question,
                options: q.options,
                correctAnswer: q.correct_answer,
                explanation: q.explanation,
                difficulty: 'medium', // Default, can be added to schema
            })) || [],
        };

        return NextResponse.json({ quiz: transformedQuiz });
    } catch (error) {
        console.error('Error in quiz detail API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

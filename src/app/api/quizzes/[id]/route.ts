import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createServiceRoleClient } from '@/lib/supabase/server';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/quizzes/[id] - Get quiz with questions
export async function GET(
    request: NextRequest,
    { params }: RouteParams
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

// PATCH /api/quizzes/[id] - Update quiz (admin only)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const supabase = createServiceRoleClient();

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

        // Update quiz fields
        const updateData: Record<string, unknown> = {};
        if (title !== undefined) updateData.title = title;
        if (topic_id !== undefined) updateData.topic_id = topic_id;
        if (time_limit !== undefined) updateData.time_limit = time_limit;
        if (xp_reward !== undefined) updateData.xp_reward = xp_reward;

        const { data: updatedQuiz, error: quizError } = await supabase
            .from('quizzes')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (quizError) {
            console.error('Error updating quiz:', quizError);
            return NextResponse.json(
                { error: 'Failed to update quiz' },
                { status: 500 }
            );
        }

        // Update questions if provided (replace all)
        if (questions && Array.isArray(questions)) {
            // Delete existing questions
            await supabase
                .from('quiz_questions')
                .delete()
                .eq('quiz_id', id);

            // Insert new questions
            if (questions.length > 0) {
                const questionsToInsert = questions.map((q: any) => ({
                    quiz_id: id,
                    question: q.question,
                    options: q.options,
                    correct_answer: q.correctAnswer || q.correct_answer,
                    explanation: q.explanation || '',
                }));

                const { error: questionsError } = await supabase
                    .from('quiz_questions')
                    .insert(questionsToInsert);

                if (questionsError) {
                    console.error('Error updating questions:', questionsError);
                    return NextResponse.json({
                        quiz: updatedQuiz,
                        warning: 'Quiz updated but questions failed to save',
                    });
                }
            }
        }

        return NextResponse.json({ quiz: updatedQuiz });
    } catch (error) {
        console.error('Error updating quiz:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/quizzes/[id] - Delete quiz (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const supabase = createServiceRoleClient();

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

        // Delete questions first (foreign key constraint)
        await supabase
            .from('quiz_questions')
            .delete()
            .eq('quiz_id', id);

        // Delete quiz attempts for this quiz
        await supabase
            .from('quiz_attempts')
            .delete()
            .eq('quiz_id', id);

        // Delete the quiz
        const { error } = await supabase
            .from('quizzes')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting quiz:', error);
            return NextResponse.json(
                { error: 'Failed to delete quiz' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}


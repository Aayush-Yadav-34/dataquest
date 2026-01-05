import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// POST /api/quizzes/[id]/submit - Submit quiz answers
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: quizId } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const { answers, timeTaken } = await request.json();

        if (!Array.isArray(answers)) {
            return NextResponse.json(
                { error: 'Answers array required' },
                { status: 400 }
            );
        }

        const supabase = createServiceRoleClient();

        // Get user
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, xp, level')
            .eq('email', session.user.email)
            .single();

        if (userError || !user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Get quiz with questions
        const { data: quiz, error: quizError } = await supabase
            .from('quizzes')
            .select(`
                id,
                title,
                xp_reward,
                quiz_questions (
                    id,
                    correct_answer
                )
            `)
            .eq('id', quizId)
            .single();

        if (quizError || !quiz) {
            return NextResponse.json(
                { error: 'Quiz not found' },
                { status: 404 }
            );
        }

        // Calculate score
        const questions = quiz.quiz_questions || [];
        let correctCount = 0;

        questions.forEach((q: any, index: number) => {
            if (answers[index] === q.correct_answer) {
                correctCount++;
            }
        });

        const totalQuestions = questions.length;
        const score = Math.round((correctCount / totalQuestions) * 100);
        const passed = score >= 70;
        const xpEarned = passed ? quiz.xp_reward : Math.floor(quiz.xp_reward * 0.3);

        // Record quiz attempt
        const { error: attemptError } = await supabase
            .from('quiz_attempts')
            .insert({
                user_id: user.id,
                quiz_id: quizId,
                score: score,
                total_questions: totalQuestions,
                time_taken: timeTaken || 0,
            });

        if (attemptError) {
            console.error('Error recording attempt:', attemptError);
        }

        // Update user XP
        const newXP = user.xp + xpEarned;
        const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;

        const { error: xpError } = await supabase
            .from('users')
            .update({ xp: newXP, level: newLevel })
            .eq('id', user.id);

        if (xpError) {
            console.error('Error updating XP:', xpError);
        }

        // Log activity
        await supabase.from('activities').insert({
            user_id: user.id,
            type: 'quiz',
            title: `${passed ? 'Passed' : 'Completed'} ${quiz.title}`,
            description: `Scored ${score}% (${correctCount}/${totalQuestions})`,
            xp_earned: xpEarned,
        });

        return NextResponse.json({
            success: true,
            score,
            correctCount,
            totalQuestions,
            passed,
            xpEarned,
            newXP,
            newLevel,
        });
    } catch (error) {
        console.error('Error submitting quiz:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

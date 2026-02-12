import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createServiceRoleClient } from '@/lib/supabase/server';

// POST /api/quiz-questions - Create new question for a quiz
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const supabase = createServiceRoleClient();

        // Check if user is admin
        const { data: user } = await supabase
            .from('users')
            .select('role')
            .eq('email', session.user.email)
            .single() as any;

        if (user?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Forbidden: Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { quiz_id, question, options, correct_answer, explanation } = body;

        if (!quiz_id || !question || !options || correct_answer === undefined) {
            return NextResponse.json(
                { error: 'quiz_id, question, options, and correct_answer are required' },
                { status: 400 }
            );
        }

        const { data: newQuestion, error } = await (supabase
            .from('quiz_questions') as any)
            .insert({
                quiz_id,
                question,
                options,
                correct_answer,
                explanation: explanation || null,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating question:', error);
            return NextResponse.json(
                { error: 'Failed to create question' },
                { status: 500 }
            );
        }

        return NextResponse.json({ question: newQuestion }, { status: 201 });
    } catch (error) {
        console.error('Error creating question:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET /api/quiz-questions?quiz_id=xxx - Get questions for a quiz
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const supabase = createServiceRoleClient();

        const { searchParams } = new URL(request.url);
        const quizId = searchParams.get('quiz_id');

        if (!quizId) {
            return NextResponse.json(
                { error: 'quiz_id is required' },
                { status: 400 }
            );
        }

        const { data: questions, error } = await supabase
            .from('quiz_questions')
            .select('*')
            .eq('quiz_id', quizId);

        if (error) {
            console.error('Error fetching questions:', error);
            return NextResponse.json(
                { error: 'Failed to fetch questions' },
                { status: 500 }
            );
        }

        return NextResponse.json({ questions });
    } catch (error) {
        console.error('Error fetching questions:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

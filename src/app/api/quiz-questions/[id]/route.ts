import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createServiceRoleClient } from '@/lib/supabase/server';

// PATCH /api/quiz-questions/[id] - Update a question
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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
            .single();

        if (user?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Forbidden: Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { question, options, correct_answer, explanation } = body;

        const updateData: Record<string, unknown> = {};
        if (question !== undefined) updateData.question = question;
        if (options !== undefined) updateData.options = options;
        if (correct_answer !== undefined) updateData.correct_answer = correct_answer;
        if (explanation !== undefined) updateData.explanation = explanation;

        const { data: updatedQuestion, error } = await supabase
            .from('quiz_questions')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating question:', error);
            return NextResponse.json(
                { error: 'Failed to update question' },
                { status: 500 }
            );
        }

        return NextResponse.json({ question: updatedQuestion });
    } catch (error) {
        console.error('Error updating question:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/quiz-questions/[id] - Delete a question
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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
            .single();

        if (user?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Forbidden: Admin access required' },
                { status: 403 }
            );
        }

        const { error } = await supabase
            .from('quiz_questions')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting question:', error);
            return NextResponse.json(
                { error: 'Failed to delete question' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting question:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

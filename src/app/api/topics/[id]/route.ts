import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createServiceRoleClient } from '@/lib/supabase/server';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/topics/[id] - Get single topic
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const supabase = createServiceRoleClient();

        const { data: topic, error } = await supabase
            .from('topics')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !topic) {
            return NextResponse.json(
                { error: 'Topic not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ topic });
    } catch (error) {
        console.error('Error fetching topic:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH /api/topics/[id] - Update topic (admin only)
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
        const { title, description, category, difficulty, icon, xp_reward, estimated_time, content, order_index } = body;

        const updateData: Record<string, unknown> = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (category !== undefined) updateData.category = category;
        if (difficulty !== undefined) updateData.difficulty = difficulty;
        if (icon !== undefined) updateData.icon = icon;
        if (xp_reward !== undefined) updateData.xp_reward = xp_reward;
        if (estimated_time !== undefined) updateData.estimated_time = estimated_time;
        if (content !== undefined) updateData.content = content;
        if (order_index !== undefined) updateData.order_index = order_index;

        const { data: updatedTopic, error } = await supabase
            .from('topics')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating topic:', error);
            return NextResponse.json(
                { error: 'Failed to update topic' },
                { status: 500 }
            );
        }

        return NextResponse.json({ topic: updatedTopic });
    } catch (error) {
        console.error('Error updating topic:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/topics/[id] - Delete topic (admin only)
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

        const { error } = await supabase
            .from('topics')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting topic:', error);
            return NextResponse.json(
                { error: 'Failed to delete topic' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting topic:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

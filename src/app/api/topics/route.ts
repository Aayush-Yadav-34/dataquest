import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/topics - Get all topics (with optional user progress)
export async function GET(request: NextRequest) {
    try {
        const supabase = createServiceRoleClient();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const difficulty = searchParams.get('difficulty');

        let query = supabase
            .from('topics')
            .select('*')
            .order('order_index', { ascending: true });

        if (category) {
            query = query.eq('category', category);
        }
        if (difficulty) {
            query = query.eq('difficulty', difficulty);
        }

        const { data: topics, error } = await query;

        if (error) {
            return NextResponse.json(
                { error: 'Failed to fetch topics' },
                { status: 500 }
            );
        }

        // Try to get user progress if authenticated
        let progressMap = new Map<string, { progress: number; completed: boolean }>();
        try {
            const session = await getServerSession(authOptions);
            if (session?.user?.id) {
                const { data: userProgress } = await supabase
                    .from('user_progress')
                    .select('topic_id, progress, completed')
                    .eq('user_id', session.user.id);

                if (userProgress) {
                    (userProgress as any[]).forEach((p: any) => {
                        progressMap.set(p.topic_id, {
                            progress: p.progress || 0,
                            completed: p.completed || false,
                        });
                    });
                }
            }
        } catch {
            // Silently ignore auth errors — just return topics without progress
        }

        // Enrich topics with user progress
        const enrichedTopics = (topics || []).map((topic: any) => ({
            ...topic,
            progress: progressMap.get(topic.id)?.progress || 0,
            completed: progressMap.get(topic.id)?.completed || false,
        }));

        return NextResponse.json({ topics: enrichedTopics });
    } catch (error) {
        console.error('Error fetching topics:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/topics - Create new topic (admin only)
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
            .single();

        if ((user as any)?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Forbidden: Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { title, description, category, difficulty, icon, xp_reward, estimated_time, content } = body;

        if (!title || !category || !difficulty) {
            return NextResponse.json(
                { error: 'Title, category, and difficulty are required' },
                { status: 400 }
            );
        }

        // Get the highest order_index
        const { data: lastTopic } = await supabase
            .from('topics')
            .select('order_index')
            .order('order_index', { ascending: false })
            .limit(1)
            .single();

        const newOrderIndex = ((lastTopic as any)?.order_index ?? 0) + 1;

        const { data: newTopic, error } = await supabase
            .from('topics' as any)
            .insert({
                title,
                description: description || '',
                category,
                difficulty,
                icon: icon || '📚',
                xp_reward: xp_reward || 100,
                estimated_time: estimated_time || 30,
                content: content || [],
                order_index: newOrderIndex,
            } as any)
            .select()
            .single();

        if (error) {
            console.error('Error creating topic:', error);
            return NextResponse.json(
                { error: 'Failed to create topic' },
                { status: 500 }
            );
        }

        return NextResponse.json({ topic: newTopic }, { status: 201 });
    } catch (error) {
        console.error('Error creating topic:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

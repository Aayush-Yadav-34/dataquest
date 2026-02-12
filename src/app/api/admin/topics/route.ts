import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createServiceRoleClient } from '@/lib/supabase/server';

// GET /api/admin/topics - Get all topics with question counts and completion stats
export async function GET() {
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

        // Get all topics
        const { data: topics, error: topicsError } = await supabase
            .from('topics')
            .select('*')
            .order('order_index', { ascending: true }) as any;

        if (topicsError) {
            console.error('Error fetching topics:', topicsError);
            return NextResponse.json(
                { error: 'Failed to fetch topics' },
                { status: 500 }
            );
        }

        // Get question counts per topic (via quizzes)
        const { data: quizzes } = await supabase
            .from('quizzes')
            .select('id, topic_id') as any;

        const { data: questions } = await supabase
            .from('quiz_questions')
            .select('quiz_id') as any;

        // Count questions per topic
        const questionCountByTopic: Record<string, number> = {};
        if (quizzes && questions) {
            const quizToTopic: Record<string, string> = {};
            quizzes.forEach((q: any) => {
                quizToTopic[q.id] = q.topic_id;
            });
            questions.forEach((q: any) => {
                const topicId = quizToTopic[q.quiz_id];
                if (topicId) {
                    questionCountByTopic[topicId] = (questionCountByTopic[topicId] || 0) + 1;
                }
            });
        }

        // Get completed students count per topic
        const { data: completions } = await supabase
            .from('user_progress')
            .select('topic_id')
            .eq('completed', true) as any;

        const completedCountByTopic: Record<string, number> = {};
        if (completions) {
            completions.forEach((c: any) => {
                completedCountByTopic[c.topic_id] = (completedCountByTopic[c.topic_id] || 0) + 1;
            });
        }

        // Enrich topics with counts
        const enrichedTopics = (topics || []).map((topic: any) => ({
            ...topic,
            questionsCount: questionCountByTopic[topic.id] || 0,
            studentsCompleted: completedCountByTopic[topic.id] || 0,
        }));

        return NextResponse.json({ topics: enrichedTopics });
    } catch (error) {
        console.error('Error fetching admin topics:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

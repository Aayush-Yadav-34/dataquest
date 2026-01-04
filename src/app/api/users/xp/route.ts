import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Update user XP
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const { amount, action } = await request.json();

        if (typeof amount !== 'number' || amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid XP amount' },
                { status: 400 }
            );
        }

        const supabase = createServiceRoleClient();

        // Get current user data
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('id, xp, level, streak')
            .eq('email', session.user.email)
            .single();

        if (fetchError || !user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Calculate new XP and level
        const newXP = user.xp + amount;
        const newLevel = calculateLevel(newXP);

        // Update user in database
        const { error: updateError } = await supabase
            .from('users')
            .update({
                xp: newXP,
                level: newLevel,
            })
            .eq('id', user.id);

        if (updateError) {
            console.error('Error updating XP:', updateError);
            return NextResponse.json(
                { error: 'Failed to update XP' },
                { status: 500 }
            );
        }

        // Check for level up
        const leveledUp = newLevel > user.level;

        // Log activity if action is provided
        if (action) {
            await supabase.from('activities').insert({
                user_id: user.id,
                type: action.type || 'xp',
                title: action.title || 'XP Earned',
                description: action.description || `Earned ${amount} XP`,
                xp_earned: amount,
            });
        }

        return NextResponse.json({
            success: true,
            xp: newXP,
            level: newLevel,
            leveledUp,
            xpEarned: amount,
        });
    } catch (error) {
        console.error('XP update error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Get user's current XP and level
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const supabase = createServiceRoleClient();

        const { data: user, error } = await supabase
            .from('users')
            .select('xp, level, streak')
            .eq('email', session.user.email)
            .single();

        if (error || !user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Calculate XP progress
        const currentLevelXP = calculateXPForLevel(user.level - 1);
        const nextLevelXP = calculateXPForLevel(user.level);
        const xpProgress = ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
        const xpToNextLevel = nextLevelXP - user.xp;

        return NextResponse.json({
            xp: user.xp,
            level: user.level,
            streak: user.streak,
            xpProgress: Math.min(100, Math.max(0, xpProgress)),
            xpToNextLevel,
            currentLevelXP,
            nextLevelXP,
        });
    } catch (error) {
        console.error('XP fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Helper: Calculate level from total XP
// Level formula: level = floor(sqrt(xp / 100)) + 1
// This means:
// - Level 1: 0-99 XP
// - Level 2: 100-399 XP 
// - Level 3: 400-899 XP
// - Level 4: 900-1599 XP
// etc.
function calculateLevel(xp: number): number {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
}

// Helper: Calculate XP required for a given level
// Inverse of level formula
function calculateXPForLevel(level: number): number {
    if (level <= 0) return 0;
    return Math.pow(level, 2) * 100;
}

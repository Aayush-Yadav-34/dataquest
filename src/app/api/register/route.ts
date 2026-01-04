import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const { username, email, password } = await request.json();

        // Validate input
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: 'Username, email, and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        const supabase = createServiceRoleClient();

        // Check if email already exists
        const { data: existingEmail } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingEmail) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 409 }
            );
        }

        // Check if username already exists
        const { data: existingUsername } = await supabase
            .from('users')
            .select('id')
            .eq('username', username)
            .single();

        if (existingUsername) {
            return NextResponse.json(
                { error: 'Username already taken' },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user
        const { data: newUser, error } = await supabase
            .from('users')
            .insert({
                email,
                username,
                password_hash: passwordHash,
                role: 'user',
                xp: 0,
                level: 1,
                streak: 0,
            })
            .select('id, email, username, role')
            .single();

        if (error) {
            console.error('Error creating user:', error);
            return NextResponse.json(
                { error: 'Failed to create user' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                user: newUser,
                message: 'Registration successful! Please login.'
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createServiceRoleClient } from '@/lib/supabase/server';

// POST /api/upload/avatar - Upload user avatar
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.' },
                { status: 400 }
            );
        }

        // Validate file size (max 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 2MB.' },
                { status: 400 }
            );
        }

        const supabase = createServiceRoleClient();

        // Get current user
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, avatar_url')
            .eq('email', session.user.email)
            .single();

        if (userError || !userData) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop() || 'png';
        const fileName = `${userData.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true,
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return NextResponse.json(
                { error: 'Failed to upload file' },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        // Update user's avatar_url
        const { error: updateError } = await supabase
            .from('users')
            .update({ avatar_url: publicUrl })
            .eq('id', userData.id);

        if (updateError) {
            console.error('Update error:', updateError);
            return NextResponse.json(
                { error: 'Failed to update profile' },
                { status: 500 }
            );
        }

        // Delete old avatar if it exists and is from our storage
        if (userData.avatar_url && userData.avatar_url.includes('/avatars/')) {
            const oldPath = userData.avatar_url.split('/avatars/').pop();
            if (oldPath) {
                await supabase.storage.from('avatars').remove([`avatars/${oldPath}`]);
            }
        }

        return NextResponse.json({
            success: true,
            avatar_url: publicUrl
        });
    } catch (error) {
        console.error('Avatar upload error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

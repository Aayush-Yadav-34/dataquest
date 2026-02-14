import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { createServiceRoleClient } from '@/lib/supabase/server';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password required');
                }

                const supabase = createServiceRoleClient();

                const { data: user, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', credentials.email)
                    .single() as any;

                if (error || !user) {
                    throw new Error('Invalid email or password');
                }

                if (!user.password_hash) {
                    throw new Error('Please use Google to sign in');
                }

                const isValid = await bcrypt.compare(credentials.password, user.password_hash);

                if (!isValid) {
                    throw new Error('Invalid email or password');
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.username,
                    image: user.avatar_url,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            const supabase = createServiceRoleClient();

            if (account?.provider === 'google') {
                // Check if user exists
                const { data: existingUser } = await supabase
                    .from('users')
                    .select('id')
                    .eq('email', user.email!)
                    .single() as any;

                if (!existingUser) {
                    // Create new user
                    const username = user.email!.split('@')[0] + '_' + Math.random().toString(36).slice(2, 6);

                    const { error } = await (supabase.from('users') as any).insert({
                        email: user.email!,
                        username,
                        avatar_url: user.image,
                        role: 'user',
                    });

                    if (error) {
                        console.error('Error creating user:', error);
                        return false;
                    }
                }
            }

            // Check if user is blocked
            if (user.email) {
                const { data: userData } = await supabase
                    .from('users')
                    .select('blocked')
                    .eq('email', user.email)
                    .single() as any;

                if (userData?.blocked) {
                    console.log('Blocked user attempted login:', user.email);
                    if (account?.provider === 'google') {
                        // OAuth: redirect to login page with blocked param
                        return '/login?blocked=true';
                    }
                    // Credentials: return false → client catches as AccessDenied
                    return false;
                }
            }

            // Update last_active for all users on every login
            if (user.email) {
                await (supabase
                    .from('users') as any)
                    .update({ last_active: new Date().toISOString() })
                    .eq('email', user.email);
            }

            return true;
        },
        async jwt({ token, user, trigger, session }) {
            // Handle session update
            if (trigger === "update" && session) {
                // Update token with new session data
                return { ...token, ...session.user };
            }

            if (user) {
                const supabase = createServiceRoleClient();
                const { data: dbUser } = await supabase
                    .from('users')
                    .select('id, role, username, xp, level, streak')
                    .eq('email', user.email!)
                    .single() as any;

                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                    token.username = dbUser.username;
                    token.xp = dbUser.xp;
                    token.level = dbUser.level;
                    token.streak = dbUser.streak;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.username = token.username as string;
                session.user.xp = token.xp as number;
                session.user.level = token.level as number;
                session.user.streak = token.streak as number;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            // Always redirect to dashboard after login
            if (url.startsWith(baseUrl)) {
                return `${baseUrl}/dashboard`;
            }
            // Allows relative callback URLs
            if (url.startsWith('/')) {
                return `${baseUrl}${url}`;
            }
            return `${baseUrl}/dashboard`;
        },
    },
    pages: {
        signIn: '/login',
        newUser: '/dashboard',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

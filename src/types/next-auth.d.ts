import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            image?: string;
            role: string;
            username: string;
            xp: number;
            level: number;
            streak: number;
        };
    }

    interface User {
        id: string;
        email: string;
        name: string;
        image?: string;
        role?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: string;
        username: string;
        xp: number;
        level: number;
        streak: number;
    }
}

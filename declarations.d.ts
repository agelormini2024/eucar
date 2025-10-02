declare module "xlsx-populate";

// Extender tipos de NextAuth
declare module "next-auth" {
    interface User {
        id: string;
        email: string;
        name: string;
        confirmado?: boolean;
        rol?: string;
    }

    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            confirmado?: boolean;
            rol?: string;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        confirmado?: boolean;
        rol?: string;
    }
}
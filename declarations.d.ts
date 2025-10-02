declare module "xlsx-populate";

// Extender tipos de NextAuth
declare module "next-auth" {
    interface User {
        id: string;
        email: string;
        name: string;
        confirmado?: boolean;
    }

    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            confirmado?: boolean;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        confirmado?: boolean;
    }
}
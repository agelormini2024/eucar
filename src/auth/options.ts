import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password", placeholder: "*******" },
            },
            async authorize(credentials) {

                if (!credentials?.email || !credentials?.password) {
                    throw new Error("El email y el password son requiridos");
                }
                const user = await prisma.usuario.findFirst({
                    where: {
                        email: credentials.email,
                        //confirmado: true // Asegurarse de que el usuario esté confirmado
                    }
                });
                if (!user) {
                    throw new Error("No se encontró un usuario con este email");
                }

                const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                if (!isValidPassword) {
                    throw new Error("Password Inválido");
                }
                return {
                    id: String(user.id),
                    email: user.email,
                    nombre: user.nombre,
                    confirmado: user.confirmado
                }
            }
        })
    ],
    pages: {
        signIn: "/auth/login",
        error: "/auth/login", // Error page
    }
}
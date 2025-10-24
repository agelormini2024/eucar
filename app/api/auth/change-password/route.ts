import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/src/lib/prisma";
import { CambiarPasswordSchema } from "@/src/schema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/auth/options";

export async function POST(request: Request) {
    try {
        // Verificar que el usuario esté autenticado
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
            return NextResponse.json({ 
                error: "Debes estar autenticado para cambiar tu contraseña" 
            }, { status: 401 });
        }

        const data = await request.json();
        const { currentPassword, newPassword, confirmPassword } = data;

        // Validar que todos los campos estén presentes
        if (!currentPassword || !newPassword || !confirmPassword) {
            return NextResponse.json({ 
                error: "Todos los campos son obligatorios" 
            }, { status: 400 });
        }

        // Validar con Zod
        const result = CambiarPasswordSchema.safeParse(data);
        if (!result.success) {
            return NextResponse.json({ 
                error: result.error.issues.map(issue => issue.message).join(", ") 
            }, { status: 400 });
        }

        // Buscar al usuario en la base de datos
        const usuario = await prisma.usuario.findUnique({
            where: {
                email: session.user.email
            }
        });

        if (!usuario) {
            return NextResponse.json({ 
                error: "Usuario no encontrado" 
            }, { status: 404 });
        }

        // Verificar la contraseña actual
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, usuario.password);
        
        if (!isCurrentPasswordValid) {
            return NextResponse.json({ 
                error: "La contraseña actual es incorrecta" 
            }, { status: 400 });
        }

        // Verificar que la nueva contraseña sea diferente a la actual
        const isSamePassword = await bcrypt.compare(newPassword, usuario.password);
        
        if (isSamePassword) {
            return NextResponse.json({ 
                error: "La nueva contraseña debe ser diferente a la actual" 
            }, { status: 400 });
        }

        // Hashear la nueva contraseña
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        // Actualizar la contraseña en la base de datos
        await prisma.usuario.update({
            where: {
                email: session.user.email
            },
            data: {
                password: hashedNewPassword
            }
        });

        return NextResponse.json({ 
            message: "Contraseña cambiada exitosamente" 
        }, { status: 200 });

    } catch (error) {
        console.error("Error al cambiar contraseña:", error);
        return NextResponse.json({ 
            error: "Error interno del servidor" 
        }, { status: 500 });
    }
}
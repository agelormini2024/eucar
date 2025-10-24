import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/src/lib/prisma";
import { ResetPasswordSchema } from "@/src/schema";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { token, newPassword, confirmPassword } = data;

        // Validar que todos los campos estén presentes
        if (!token || !newPassword || !confirmPassword) {
            return NextResponse.json({ 
                error: "Todos los campos son obligatorios" 
            }, { status: 400 });
        }

        // Validar con Zod
        const result = ResetPasswordSchema.safeParse(data);
        if (!result.success) {
            return NextResponse.json({ 
                error: result.error.issues.map(issue => issue.message).join(", ") 
            }, { status: 400 });
        }

        // Buscar el token en la base de datos
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: {
                token: token
            }
        });

        if (!resetToken) {
            return NextResponse.json({ 
                error: "Token inválido o expirado" 
            }, { status: 400 });
        }

        // Verificar que el token no haya sido usado
        if (resetToken.usado) {
            return NextResponse.json({ 
                error: "Este token ya ha sido utilizado" 
            }, { status: 400 });
        }

        // Verificar que el token no haya expirado
        if (resetToken.expiresAt < new Date()) {
            return NextResponse.json({ 
                error: "El token ha expirado. Solicita un nuevo enlace de recuperación" 
            }, { status: 400 });
        }

        // Buscar al usuario
        const usuario = await prisma.usuario.findUnique({
            where: {
                email: resetToken.email
            }
        });

        if (!usuario) {
            return NextResponse.json({ 
                error: "Usuario no encontrado" 
            }, { status: 404 });
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

        // Actualizar la contraseña del usuario y marcar el token como usado
        await prisma.$transaction([
            // Actualizar contraseña
            prisma.usuario.update({
                where: {
                    email: resetToken.email
                },
                data: {
                    password: hashedNewPassword
                }
            }),
            // Marcar token como usado
            prisma.passwordResetToken.update({
                where: {
                    token: token
                },
                data: {
                    usado: true
                }
            })
        ]);

        return NextResponse.json({ 
            message: "Contraseña restablecida exitosamente. Puedes iniciar sesión con tu nueva contraseña" 
        }, { status: 200 });

    } catch (error) {
        console.error("Error en reset-password:", error);
        return NextResponse.json({ 
            error: "Error interno del servidor" 
        }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { ForgotPasswordSchema } from "@/src/schema";
import { randomUUID } from "crypto";
import { sendPasswordResetEmail, checkResendConfig } from "@/src/lib/resendService";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { email } = data;

        // Validar que el email esté presente
        if (!email) {
            return NextResponse.json({ 
                error: "El email es obligatorio" 
            }, { status: 400 });
        }

        // Validar con Zod
        const result = ForgotPasswordSchema.safeParse(data);
        if (!result.success) {
            return NextResponse.json({ 
                error: result.error.issues.map(issue => issue.message).join(", ") 
            }, { status: 400 });
        }

        // Buscar al usuario en la base de datos
        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email
            }
        });

        // IMPORTANTE: No revelar si el email existe o no por seguridad
        // Siempre retornamos el mismo mensaje
        const message = "Si el email existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña";

        if (usuario) {
            // Generar token único
            const token = randomUUID();
            
            // Definir expiración (1 hora desde ahora)
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 1);

            // Eliminar tokens anteriores no usados para este email
            await prisma.passwordResetToken.deleteMany({
                where: {
                    email: email,
                    usado: false
                }
            });

            // Crear nuevo token
            await prisma.passwordResetToken.create({
                data: {
                    email: email,
                    token: token,
                    expiresAt: expiresAt,
                    usado: false
                }
            });

            // Verificar configuración de Resend
            const resendConfig = checkResendConfig();
            
            if (resendConfig.configured) {
                // Enviar email real con Resend
                const emailResult = await sendPasswordResetEmail(email, token, expiresAt);
                
                if (!emailResult.success) {
                    console.error('❌ Error enviando email:', emailResult.error);
                    // Fallback a consola si falla el email
                    console.log(`\n🔐 FALLBACK - TOKEN DE RECUPERACIÓN PARA ${email}:`);
                    console.log(`🔗 Link: http://localhost:3000/auth/reset-password?token=${token}`);
                    console.log(`⏰ Expira: ${expiresAt.toLocaleString()}`);
                    console.log(`\n`);
                }
            } else {
                // Fallback a consola si Resend no está configurado
                console.log(`\n🔐 TOKEN DE RECUPERACIÓN PARA ${email} (Resend no configurado):`);
                console.log(`🔗 Link: http://localhost:3000/auth/reset-password?token=${token}`);
                console.log(`⏰ Expira: ${expiresAt.toLocaleString()}`);
                console.log(`💡 Para envío real, configura RESEND_API_KEY en .env`);
                console.log(`\n`);
            }
        }

        // Siempre retornar el mismo mensaje (sin revelar si el email existe)
        return NextResponse.json({ 
            message: message 
        }, { status: 200 });

    } catch (error) {
        console.error("Error en forgot-password:", error);
        return NextResponse.json({ 
            error: "Error interno del servidor" 
        }, { status: 500 });
    }
}
import { Resend } from 'resend';
import { resetPasswordEmailTemplate, resetPasswordEmailText } from './emailTemplates';

// Función para crear instancia de Resend solo cuando se necesite
function getResendClient(): Resend | null {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
        return null;
    }
    
    return new Resend(apiKey);
}

export async function sendPasswordResetEmail(
    email: string, 
    resetToken: string, 
    expiresAt: Date
): Promise<{ success: boolean; error?: string }> {
    try {
        // Obtener cliente de Resend
        const resend = getResendClient();
        
        if (!resend) {
            return { 
                success: false, 
                error: 'RESEND_API_KEY no configurada' 
            };
        }
        
        // Construir el link de reset
        const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
        
        // Configurar el email
        const emailData = {
            from: process.env.RESEND_FROM_EMAIL || 'Soares Parente <noreply@soares-parente.com>',
            to: email,
            subject: '🔐 Recuperación de Contraseña - Soares Parente Propiedades',
            html: resetPasswordEmailTemplate(resetLink, expiresAt),
            text: resetPasswordEmailText(resetLink, expiresAt),
        };

        // Enviar el email
        const result = await resend.emails.send(emailData);

        if (result.error) {
            console.error('Error enviando email con Resend:', result.error);
            return { 
                success: false, 
                error: `Error de Resend: ${result.error.message || 'Error desconocido'}` 
            };
        }

        console.log(`✅ Email de recuperación enviado exitosamente a ${email}`);
        console.log(`📧 ID del email: ${result.data?.id}`);
        
        return { success: true };

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        console.error('Error en sendPasswordResetEmail:', error);
        return { 
            success: false, 
            error: `Error interno: ${errorMessage}` 
        };
    }
}

// Función para verificar configuración de Resend
export function checkResendConfig(): { configured: boolean; missingVars: string[] } {
    const requiredVars = ['RESEND_API_KEY'];
    const optionalVars = ['RESEND_FROM_EMAIL', 'NEXTAUTH_URL'];
    
    const missingRequired = requiredVars.filter(varName => !process.env[varName]);
    const missingOptional = optionalVars.filter(varName => !process.env[varName]);
    
    if (missingRequired.length > 0) {
        console.warn('❌ Variables de entorno requeridas faltantes para Resend:', missingRequired);
        return { configured: false, missingVars: missingRequired };
    }
    
    if (missingOptional.length > 0) {
        console.warn('⚠️ Variables de entorno opcionales faltantes para Resend:', missingOptional);
        console.warn('💡 Se usarán valores por defecto');
    }
    
    console.log('✅ Configuración de Resend completa');
    return { configured: true, missingVars: [] };
}
// Plantilla de email para recuperación de contraseña
export const resetPasswordEmailTemplate = (resetLink: string, expiresAt: Date) => {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperar Contraseña - Soares Parente Propiedades</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #dc2626;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #dc2626;
                margin-bottom: 10px;
            }
            .content {
                margin-bottom: 30px;
            }
            .reset-button {
                display: inline-block;
                background-color: #3333;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
                text-align: center;
            }
            .reset-button:hover {
                background-color: #4444;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #666;
                text-align: center;
            }
            .warning {
                background-color: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
            }
            .expiry {
                color: #dc2626;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🏠 Soares Parente Propiedades</div>
                <p>Solicitud de Recuperación de Contraseña</p>
            </div>
            
            <div class="content">
                <h2>¡Hola!</h2>
                
                <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Soares Parente Propiedades.</p>
                
                <p>Si fuiste tú quien solicitó este cambio, haz clic en el siguiente botón para crear una nueva contraseña:</p>
                
                <div style="text-align: center;">
                    <a href="${resetLink}" class="reset-button">
                        🔐 Restablecer Mi Contraseña
                    </a>
                </div>
                
                <p>O copia y pega este enlace en tu navegador:</p>
                <p style="word-break: break-all; background: #f9f9f9; padding: 10px; border-radius: 5px;">
                    ${resetLink}
                </p>
                
                <div class="warning">
                    <p><strong>⚠️ Información importante:</strong></p>
                    <ul>
                        <li>Este enlace <span class="expiry">expira el ${expiresAt.toLocaleDateString('es-ES')} a las ${expiresAt.toLocaleTimeString('es-ES')}</span></li>
                        <li>Solo puede ser utilizado una vez</li>
                        <li>Si no solicitaste este cambio, puedes ignorar este email</li>
                    </ul>
                </div>
                
                <p>Si tienes problemas con el enlace, contacta a nuestro equipo de soporte.</p>
                
                <p>Saludos cordiales,<br>
                <strong>Equipo de Soares Parente Propiedades</strong></p>
            </div>
            
            <div class="footer">
                <p>Este es un email automático, por favor no respondas a este mensaje.</p>
                <p>© ${new Date().getFullYear()} Soares Parente Propiedades. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

export const resetPasswordEmailText = (resetLink: string, expiresAt: Date) => {
    return `
Soares Parente Propiedades - Recuperación de Contraseña

¡Hola!

Recibimos una solicitud para restablecer la contraseña de tu cuenta.

Para crear una nueva contraseña, visita el siguiente enlace:
${resetLink}

IMPORTANTE:
- Este enlace expira el ${expiresAt.toLocaleDateString('es-ES')} a las ${expiresAt.toLocaleTimeString('es-ES')}
- Solo puede ser utilizado una vez
- Si no solicitaste este cambio, puedes ignorar este email

Saludos cordiales,
Equipo de Soares Parente Propiedades

--
Este es un email automático, por favor no respondas a este mensaje.
© ${new Date().getFullYear()} Soares Parente Propiedades. Todos los derechos reservados.
    `;
};
export const emailTemplates = {
    welcome: (name: string) => ({
        subject: "¡Bienvenido a Remembo! 🎉",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #4338CA; margin: 0;">¡Bienvenido a Remembo!</h1>
                    <p style="color: #666; font-size: 18px;">¡Hola, ${name}! 👋</p>
                </div>

                <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="color: #444; font-size: 16px; line-height: 1.6;">
                        Estamos emocionados de tenerte con nosotros. Con Remembo, podrás:
                    </p>
                    <ul style="color: #444; font-size: 16px; line-height: 1.6;">
                        <li>📚 Organizar tu conocimiento de manera inteligente</li>
                        <li>🔍 Encontrar información rápidamente</li>
                        <li>🧠 Potenciar tu aprendizaje con IA</li>
                        <li>📱 Acceder a tus notas desde cualquier dispositivo</li>
                    </ul>
                </div>

                <div style="text-align: center; margin: 20px 0;">
                    <a href="${process.env.NEXTAUTH_URL}/home"
                        style="background-color: #4338CA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 16px; display: inline-block;">
                        Comenzar Ahora
                    </a>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
                    <p style="color: #666; font-size: 14px;">
                        ¿Necesitas ayuda? Contáctanos en
                        <a href="mailto:${process.env.SUPPORT_EMAIL}" style="color: #4338CA; text-decoration: none;">
                            ${process.env.SUPPORT_EMAIL}
                        </a>
                    </p>
                    <p style="color: #888; font-size: 12px;">
                        © ${new Date().getFullYear()} Remembo. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        `
    }),

    verifyEmail: (name: string, verifyLink: string) => ({
        subject: "Verifica tu correo en Remembo ✉️",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #4338CA; margin: 0;">Verifica tu correo</h1>
                    <p style="color: #666; font-size: 18px;">¡Hola, ${name}! 👋</p>
                </div>

                <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="color: #444; font-size: 16px; line-height: 1.6;">
                        Gracias por registrarte en <strong>Remembo</strong>. Para completar tu registro y comenzar a usar todas nuestras funcionalidades, necesitamos verificar tu dirección de correo.
                    </p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verifyLink}"
                            style="background-color: #4338CA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 16px; display: inline-block;">
                            Verificar Email
                        </a>
                    </div>

                    <p style="color: #666; font-size: 14px; text-align: center;">
                        El enlace expirará en 24 horas por seguridad.
                    </p>
                </div>

                <div style="background-color: #f5f3ff; padding: 15px; border-radius: 6px; margin-top: 20px;">
                    <p style="color: #4c1d95; margin: 0; font-size: 14px;">
                        🔒 Si no realizaste este registro, puedes ignorar este mensaje. Tu dirección de correo no será utilizada.
                    </p>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
                    <p style="color: #666; font-size: 14px;">
                        ¿Necesitas ayuda? Contáctanos en
                        <a href="mailto:${process.env.SUPPORT_EMAIL}" style="color: #4338CA; text-decoration: none;">
                            ${process.env.SUPPORT_EMAIL}
                        </a>
                    </p>
                    <p style="color: #888; font-size: 12px;">
                        © ${new Date().getFullYear()} Remembo. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        `
    }),

    passwordReset: (name: string, resetLink: string) => ({
        subject: "Restablece tu contraseña en Remembo 🔐",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #4338CA; margin: 0;">Restablece tu contraseña</h1>
                    <p style="color: #666; font-size: 18px;">¡Hola, ${name}! 👋</p>
                </div>

                <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="color: #444; font-size: 16px; line-height: 1.6;">
                        Hemos recibido una solicitud para restablecer tu contraseña en <strong>Remembo</strong>.
                        Si fuiste tú, haz clic en el siguiente botón para crear una nueva contraseña:
                    </p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" 
                            style="background-color: #4338CA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 16px; display: inline-block;">
                            Restablecer Contraseña
                        </a>
                    </div>

                    <p style="color: #666; font-size: 14px; text-align: center;">
                        El enlace expirará en 1 hora por seguridad.
                    </p>
                </div>

                <div style="background-color: #f5f3ff; padding: 15px; border-radius: 6px; margin-top: 20px;">
                    <p style="color: #4c1d95; margin: 0; font-size: 14px;">
                        🔒 Si no solicitaste esto, puedes ignorar este correo. Tu contraseña actual seguirá siendo la misma.
                    </p>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
                    <p style="color: #666; font-size: 14px;">
                        ¿Necesitas ayuda? Contáctanos en 
                        <a href="mailto:${process.env.SUPPORT_EMAIL}" style="color: #4338CA; text-decoration: none;">
                            ${process.env.SUPPORT_EMAIL}
                        </a>
                    </p>
                    <p style="color: #888; font-size: 12px;">
                        © ${new Date().getFullYear()} Remembo. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        `
    })
};

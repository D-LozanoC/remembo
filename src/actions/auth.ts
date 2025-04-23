'use server'

import { prisma } from "@/config/prisma"
import { emailTemplates } from "@/utils/emailTemplates";
import { sendEmail } from "@/utils/sendEmail";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export async function loginUser(user: { email: string, password: string }) {
    const { email, password } = user
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email as string,
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                emailVerified: true,
                role: true,
                image: true
            }
        })

        // Si el usuario no existe o no tiene contraseña
        if (!user || !user.password) {
            throw new Error('INVALID_CREDENTIALS')
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password as string, user.password)
        if (!isMatch) {
            throw new Error('INVALID_CREDENTIALS')
        }

        // Si el email no está verificado, enviamos un nuevo correo de verificación
        if (!user.emailVerified) {
            // Generar token de verificación
            const verificationToken = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.AUTH_SECRET as string,
                { expiresIn: '24h' }
            )

            // Crear enlace de verificación
            const verifyLink = `${process.env.NEXTAUTH_URL}/auth/verify?token=${verificationToken}`

            // Enviar email de verificación
            const verifyEmail = emailTemplates.verifyEmail(user.name || 'Usuario', verifyLink)
            await sendEmail(user.email, verifyEmail.subject, verifyEmail.html)

            throw new Error('EMAIL_NOT_VERIFIED')
        }

        // No devolver el password en la respuesta
        const { password: _, ...userWithoutPassword } = user
        return userWithoutPassword
    } catch (error) {
        console.error('Error logging in user:', error)
        if (error instanceof Error) {
            throw error // Propagar el error para manejarlo en el provider
        }
        throw new Error('UNKNOWN_ERROR')
    }
}

export async function registerUser(user: { fullname: string, email: string, password: string }) {
    const { fullname, email, password } = user
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            const createdAccounts = await prisma.account.findMany({
                where: {
                    userId: existingUser.id
                }, select: {
                    provider: true
                }
            })

            if (createdAccounts.some(account => account.provider === "credentials")) {
                return { success: false, message: 'El email ya está en uso' }
            }

            await prisma.account.create({
                data: {
                    userId: existingUser.id,
                    provider: "credentials",
                    type: "credentials",
                    providerAccountId: existingUser.id
                }
            })

            await prisma.user.update({
                where: {
                    id: existingUser.id
                },
                data: {
                    password: await bcrypt.hash(password, 10)
                }
            })

            // Enviar email de bienvenida si el usuario ya está verificado
            if (existingUser.emailVerified) {
                const welcomeEmail = emailTemplates.welcome(fullname)
                await sendEmail(email, welcomeEmail.subject, welcomeEmail.html)
            }

            return { success: true, message: 'Cuenta de usuario registrada correctamente' }
        }

        // Crear nuevo usuario
        const newUser = await prisma.user.create({
            data: {
                name: fullname,
                email,
                password: await bcrypt.hash(password, 10),
                emailVerified: null
            }
        })

        // Generar token de verificación
        const verificationToken = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            process.env.AUTH_SECRET as string,
            { expiresIn: '24h' }
        )

        // Crear enlace de verificación
        const verifyLink = `${process.env.NEXTAUTH_URL}/auth/verify?token=${verificationToken}`

        // Enviar email de verificación
        const verifyEmail = emailTemplates.verifyEmail(fullname, verifyLink)
        await sendEmail(email, verifyEmail.subject, verifyEmail.html)

        return { success: true, message: 'Usuario registrado correctamente. Por favor, verifica tu correo electrónico.' }
    } catch (error) {
        console.error('Error registrando usuario:', error)
        return { success: false, message: 'Problema creando al usuario' }
    }
}

export async function verifyEmail(token: string) {
    try {
        // Verificar y decodificar el token
        const { userId, email } = jwt.verify(token, process.env.AUTH_SECRET as string) as { userId: string, email: string }

        // Actualizar usuario como verificado
        const user = await prisma.user.update({
            where: { id: userId },
            data: { emailVerified: new Date() }
        })

        // Crear cuenta de credenciales si no existe
        const existingAccount = await prisma.account.findFirst({
            where: {
                userId: user.id,
                provider: "credentials"
            }
        })

        if (!existingAccount) {
            await prisma.account.create({
                data: {
                    userId: user.id,
                    type: "credentials",
                    provider: "credentials",
                    providerAccountId: user.id
                }
            })
        }

        // Enviar email de bienvenida
        const welcomeEmail = emailTemplates.welcome(user.name || 'Usuario')
        await sendEmail(email, welcomeEmail.subject, welcomeEmail.html)

        return { success: true, message: 'Email verificado correctamente' }
    } catch (error) {
        console.error('Error verificando email:', error)
        return { success: false, message: 'Error al verificar el email' }
    }
}

export async function forgotPassword(email: string) {
    try {
        const user = await prisma.user.findUnique({ where: { email }, select: { email: true, password: true, name: true, } })
        if (!user) return { success: false, message: 'No se encontró al usuario' }
        if (!user.password) return { success: false, message: 'El usuario no tiene contraseña' }

        const userValues = { email: user.email, name: user.name }
        const resetToken = jwt.sign(userValues, process.env.AUTH_SECRET as string, { expiresIn: 60 * 3 })

        const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-pass?token=${resetToken}`
        const emailData = emailTemplates.passwordReset(user.name ?? 'Usuario', resetLink)
        await sendEmail(user.email, emailData.subject, emailData.html)
        return { success: true, message: 'Se ha enviado un email con instrucciones para resetear tu contraseña' }
    } catch (error) {
        console.error('Error sending forgot password email:', error)
        return { success: false, message: 'Problema al enviar el email' }
    }
}

export async function resetPassword(token: string, newPassword: string) {
    try {
        const { email, name } = jwt.verify(token, process.env.AUTH_SECRET as string) as { email: string, name?: string }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        })

        return {
            success: true,
            message: name ? `${name}, tu contraseña fue correctamente actualizada` : 'Tu contraseña fue correctamente actualizada'
        };
    } catch (error) {
        console.error('Error resetting password:', error)
        return { success: false, message: 'Problema al actualizar la contraseña' }
    }
}

'use server'

import { signIn, signOut } from "@/auth"
import { prisma } from "@/config/prisma"

export async function doSocialLogin(formData: FormData) {
    const action = formData.get('action') as string | undefined
    if (action) {
        await signIn(action, { redirectTo: "/home" })
    } else {
        throw new Error("Action is null or undefined")
    }
}

export async function doMagicLinkLogin(formData: { email: string }) {
    const { email } = formData
    if (!email) return { success: false, message: 'Email is required' }
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return { success: false, message: 'Email not found' }
    const response = await signIn('nodemailer', {
        redirectTo: '/home',
        email
    })
    if (!response) return { success: false, message: 'Login failed' }
    return { success: true, message: 'Login successful' }
}

export async function doCredentialsLogin(formData: { email: string, password: string, rememberMe: boolean, captchaToken: string }) {
    // 1️⃣ Validar reCAPTCHA con Google
    const recaptchaRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            secret: process.env.RECAPTCHA_SECRET_KEY!,
            response: formData.captchaToken,
        }),
    });

    const recaptchaData = await recaptchaRes.json();
    if (!recaptchaData.success) return {error: 'Captcha inválido. Por favor, inténtalo de nuevo.'}; // ⛔ Bloquea si reCAPTCHA falla

    try {
        const response = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            rememberMe: formData.rememberMe,
            redirect: false
        });

        return response;
    } catch (error) {
        return { error: "Credenciales incorrectas" };
    }
}


export async function doLogout() {
    await signOut({ redirectTo: "/home" })
}
'use server'

import { prisma } from "@/config/prisma"
import bcrypt from 'bcrypt'

export async function loginUser(user: { email: string, password: string }) {
    const { email, password } = user
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email as string,
            },
        });

        if (!user || !user.password) return null;

        const isMatch = await bcrypt.compare(password as string, user.password);
        if (!isMatch) return null;

        return user;
    } catch (error) {
        return null;
    }
}

export async function registerUser(user: { fullname: string, email: string, password: string }) {
    const { fullname, email, password } = user
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return { success: false, message: 'El email ya está en uso' }
        }

        await prisma.user.create({
            data: {
                name: fullname,
                email,
                password: await bcrypt.hash(password, 10),
                emailVerified: null
            }
        })
        return { success: true, message: 'Usuario registrado correctamente' }
    } catch (error) {
        return { success: false, message: 'Problema creando al user' }
    }
}


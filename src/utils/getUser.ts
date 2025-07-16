import { auth } from "@/auth"
import { prisma } from "@/config/prisma"

export async function getUser() {
    try {
        const session = await auth()
        if (!session) return null
        const user = session.user
        if (!user) return null
        const userDB = await prisma.user.findUnique({ where: { email: user.email as string }, omit: { password: true, id: true } })
        return userDB
    } catch (error) {
        console.error("Error fetching user:", error)
        return null
    }
}
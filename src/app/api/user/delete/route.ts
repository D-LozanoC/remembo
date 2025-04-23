// app/api/user/delete-account/route.ts

import { auth, signOut } from "@/auth"
import { prisma } from "@/config/prisma"
import { compare } from "bcrypt"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    
    // Verificar autenticación
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Debes iniciar sesión para realizar esta acción" },
        { status: 401 }
      )
    }

    const { password } = await req.json()
    
    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    // Verificar contraseña
    const isValidPassword = await compare(password, user.password as string)
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Contraseña incorrecta" },
        { status: 403 }
      )
    }

    // Eliminar usuario y datos relacionados (depende de tu modelo de datos)
    await prisma.user.delete({
      where: { id: user.id },
    })

    await signOut({redirect: false})

    return NextResponse.json(
      { message: "Cuenta eliminada exitosamente" },
      { status: 200 }
    )

  } catch (error) {
    console.error("Error eliminando cuenta:", error)
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
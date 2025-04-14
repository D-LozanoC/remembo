'use client'

// Components
import Link from "next/link"
import { Button } from "@/shared/components/Button"
import { AuthForm } from "@/shared/sections/auth/AuthForm"
import { InputField } from "@/shared/components/InputField"
import SuccessAlert from "@/shared/components/SuccessAlert"
import FormErrorMessage from "@/shared/components/FormErrorMessage"
import { Text } from "@/shared/atoms/Text"

// Hooks
import { useState } from "react"
import { useForm } from "react-hook-form"

// Schemas and Utils
import { zodResolver } from "@hookform/resolvers/zod"
import { SignUpFormData, signUpSchema } from "@/utils/schemas"

// Actions
import { registerUser } from "@/actions/auth"

export default function Register() {
  const { register, formState: { errors }, handleSubmit } = useForm<SignUpFormData>({ resolver: zodResolver(signUpSchema) })
  const [message, setMessage] = useState<string | null>(null)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    const { fullname, email, password } = data
    try {
      const response = await registerUser({
        fullname,
        email,
        password
      })

      if (!response?.success) {
        setMessage(response?.message as string)
        return
      }

      setMessage(response?.message as string)

      setShowSuccessAlert(true)
    } catch (_error) {
      console.error("Error during registration:", _error)
      setMessage('Hubo un error registrando al usuario')
    }
  })

  return (
    <AuthForm title="Crea tu cuenta" subtitle="Regístrate para comenzar">
      <form className="mt-8 space-y-6 bg-blue_100" onSubmit={onSubmit}>
        <div className="space-y-2 bg-blue_100">
          <InputField
            {...register('fullname')}
            type="text"
            label="Nombre completo"
          />
          {errors.fullname && <FormErrorMessage>{errors.fullname.message as string}</FormErrorMessage>}
        </div>
        <div className="space-y-2">
          <InputField
            {...register('email')}
            type="email"
            label="Correo electrónico"
          />
          {errors.email && <FormErrorMessage>{errors.email.message as string}</FormErrorMessage>}
        </div>
        <div className="space-y-2">
          <InputField
            {...register('password')}
            type="password"
            label="Contraseña"
          />
          {errors.password && <FormErrorMessage>{errors.password.message as string}</FormErrorMessage>}
        </div>
        <div className="space-y-2">
          <InputField
            {...register('confirmPassword')}
            type="password"
            label="Confirmar contraseña"
          />
          {errors.confirmPassword && <FormErrorMessage>{errors.confirmPassword.message as string}</FormErrorMessage>}
        </div>
        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 mr-2 rounded border-gray-300 text-black focus:ring-black"
          />
          <Text size="small">
            Acepto los{" "}
            <Link href="/terms" className="font-medium text-white underline hover:opacity-100 ease-in-out transition-all opacity-90">
              términos y condiciones
            </Link>
          </Text>
        </div>
        {message && <FormErrorMessage>{message}</FormErrorMessage>}
        <Button type="submit">Registrarse</Button>
      </form>
      <Text size="small" className="mt-4 text-center">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/auth/login" className="font-medium text-white underline hover:opacity-100 ease-in-out transition-all opacity-90">
          Inicia sesión
        </Link>
      </Text>
      <SuccessAlert
        show={showSuccessAlert}
        title='¡Registro exitoso!'
        description={message ?? "Usuario registrado correctamente."}
        buttonText='Continuar al login'
        url='/auth/login'
      />
    </AuthForm>
  )
}


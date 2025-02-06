'use client'

// Components
import Link from "next/link"
import { Button } from "@/components/Button"
import { AuthForm } from "@/components/AuthForm"
import { InputField } from "@/components/InputField"
import SuccessAlert from "@/components/SuccessAlert"
import FormErrorMessage from "@/components/FormErrorMessage"

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

      setShowSuccessAlert(true)
    } catch (_error) {
      setMessage('Hubo un error registrando al usuario')
    }
  })

  return (
    <AuthForm title="Crea tu cuenta" subtitle="Regístrate para comenzar">
      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        <div className="space-y-2">
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
            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            Acepto los{" "}
            <Link href="/terms" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
              términos y condiciones
            </Link>
          </label>
        </div>
        {message && <FormErrorMessage>{message}</FormErrorMessage>}
        <Button type="submit">Registrarse</Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
          Inicia sesión
        </Link>
      </p>
      <SuccessAlert
        show={showSuccessAlert}
        title='¡Registro exitoso!'
        description='Usuario registrado correctamente'
        buttonText='Continuar al login'
        url='/auth/login'
      />
    </AuthForm>
  )
}


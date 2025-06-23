'use client'

// Components
import { Button } from "@/components/Button"
import { AuthForm } from "@/components/AuthForm"
import { InputField } from "@/components/InputField"
import SuccessAlert from "@/components/SuccessAlert"
import FormErrorMessage from "@/components/FormErrorMessage"
import { DecoratedLink } from "@/shared/atoms/DecoratedLink"

// Hooks
import { useState } from "react"
import { useForm } from "react-hook-form"

// Schemas and Utils
import { zodResolver } from "@hookform/resolvers/zod"
import { SignUpFormData, signUpSchema } from "@/schemas/auth"

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
    } catch (error) {
      setMessage('Hubo un error registrando al usuario')
      console.error('Error registering user:', error)
    }
  })

  return (
    <AuthForm title="Crea tu cuenta" subtitle="Regístrate para comenzar">
      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        <InputField
          {...register('fullname')}
          type="text"
          label="Nombre completo"
          error={errors.fullname}
        />
        <InputField
          {...register('email')}
          type="email"
          label="Correo electrónico"
          error={errors.email}
        />
        <InputField
          {...register('password')}
          type="password"
          label="Contraseña"
          error={errors.password}
        />
        <InputField
          {...register('confirmPassword')}
          type="password"
          label="Confirmar contraseña"
          error={errors.confirmPassword}
        />
        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-black">
            Acepto los{" "}
            <DecoratedLink href="/terms">
              términos y condiciones
            </DecoratedLink>
          </label>
        </div>
        {message && <FormErrorMessage>{message}</FormErrorMessage>}
        <Button type="submit">Registrarse</Button>
      </form>
      <p className="mt-4 text-center text-sm text-black">
        ¿Ya tienes una cuenta?{" "}
        <DecoratedLink href="/auth/login">
          Inicia sesión
        </DecoratedLink>
      </p>
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


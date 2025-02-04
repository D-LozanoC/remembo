'use client'

import Link from "next/link"
import { AuthForm } from "@/components/AuthForm"
import { InputField } from "@/components/InputField"
import { Button } from "@/components/Button"
import { useForm } from "react-hook-form"
import FormErrorMessage from "@/components/FormErrorMessage"

export default function Register() {
  const { register, formState: { errors }, handleSubmit } = useForm()

  const onSubmit = handleSubmit(data => {
    console.log(data)
  })

  return (
    <AuthForm title="Crea tu cuenta" subtitle="Regístrate para comenzar">
      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        <div className="space-y-2">
          <InputField
            {...register('fullname', { required: { message: 'El nombre completo es requerido', value: true } })}
            label="Nombre completo"
          />
          {errors.fullname && <FormErrorMessage>{errors.fullname.message as string}</FormErrorMessage>}
        </div>
        <div className="space-y-2">
          <InputField
            {...register('email', { required: { message: 'El correo electrónico es requerido', value: true } })}
            label="Correo electrónico"
          />
          {errors.email && <FormErrorMessage>{errors.email.message as string}</FormErrorMessage>}
        </div>
        <div className="space-y-2">
          <InputField
            {...register('password', { required: { message: 'La contraseña es requerida', value: true } })}
            label="Contraseña"
          />
          {errors.password && <FormErrorMessage>{errors.password.message as string}</FormErrorMessage>}
        </div>
        <div className="space-y-2">
          <InputField
            {...register('confirmPassword', { required: { message: 'La confirmación de la contraseña es requerida', value: true } })}
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
        <Button type="submit">Registrarse</Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </AuthForm>
  )
}


import { z } from 'zod'

export const signUpSchema = z.object({
    fullname: z.string().min(1, { message: "El nombre completo es obligatorio." }),
    email: z.string().email({ message: "Debe ingresar un correo electrónico válido." })
        .min(1, { message: "El email es obligatorio." }),
    password: z.string()
        .min(1, { message: "La contraseña es obligatoria." })
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
        .max(255, { message: "La contraseña no puede exceder los 255 caracteres." })
        .regex(/[a-zA-Z]/, { message: "La contraseña debe contener al menos una letra." })
        .regex(/[0-9]/, { message: "La contraseña debe contener al menos un número." }),
    confirmPassword: z.string()
        .min(1, { message: "La confirmación de la contraseña es obligatoria." })
        .min(8, { message: "La confirmación de contraseña debe tener al menos 8 caracteres." })
        .max(255, { message: "La confirmación de contraseña no puede exceder los 255 caracteres." }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
});



export type SignUpFormData = z.infer<typeof signUpSchema>

export const signInSchema = z.object({
    email: z.string().min(1, { message: "El email es obligatorio." })
        .email({ message: "Debe ingresar un correo electrónico válido." }),
    password: z.string()
        .min(1, { message: "La contraseña es obligatoria." })
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
        .max(255, { message: "La contraseña no puede exceder los 255 caracteres." })
        .regex(/[a-zA-Z]/, { message: "La contraseña debe contener al menos una letra." })
        .regex(/[0-9]/, { message: "La contraseña debe contener al menos un número." }),
    rememberMe: z.boolean().optional(),
}).required()

export type SignInFormData = z.infer<typeof signInSchema>

export const forgotSchema = z.object({
    email: z.string().min(1, { message: "El email es obligatorio." })
        .email({ message: "Debe ingresar un correo electrónico válido." })
})

export type ForgotFormData = z.infer<typeof forgotSchema>

export const resetSchema = z.object({
    password: z.string()
        .min(1, { message: "La contraseña es obligatoria." })
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
        .max(255, { message: "La contraseña no puede exceder los 255 caracteres." })
        .regex(/[a-zA-Z]/, { message: "La contraseña debe contener al menos una letra." })
        .regex(/[0-9]/, { message: "La contraseña debe contener al menos un número." }),
    confirmPassword: z.string()
        .min(1, { message: "La confirmación de la contraseña es obligatoria." })
        .min(8, { message: "La confirmación de contraseña debe tener al menos 8 caracteres." })
        .max(255, { message: "La confirmación de contraseña no puede exceder los 255 caracteres." }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
});

export type ResetFormData = z.infer<typeof resetSchema>

export const updateProfileSchema = z.object({
    fullname: z.string().min(1, { message: "El nombre completo es obligatorio." }),
    image: z.instanceof(File).optional(),
})

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(6, 'La contraseña actual es requerida').optional(),
    newPassword: z
        .string()
        .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
        .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
        .regex(/\d/, 'Debe contener al menos un número'),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden',
})

export type ChangePasswordForm = z.infer<typeof changePasswordSchema>

export const deleteAccountSchema = z.object({
    password: z.string().min(6, 'La contraseña es requerida'),
})

export type DeleteAccountForm = z.infer<typeof deleteAccountSchema>

'use server'

import { signIn, signOut } from "@/auth"

export async function doSocialLogin(formData: FormData) {
    const action = formData.get('action') as string | undefined
    if (action) {
        await signIn(action, { redirectTo: "/home" })
    } else {
        throw new Error("Action is null or undefined")
    }
}

export async function doLogout() {
    await signOut({ redirectTo: "/" })
}

export async function doCredentialsLogin(formData: { email: string, password: string }) {
    try {
        const response = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false
        });

        return response;
    } catch (error) {
        console.error("Error during credentials login:", error);
        return { error: "Credenciales incorrectas" };
    }
}
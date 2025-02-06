// Components
import { Button } from "./Button";

// Actions
import { doLogout } from "@/actions";

export function LogoutButton() {
    return (
        <form action={doLogout}>
            <Button type="submit">
                Cerrar sesión
            </Button>
        </form>
    )
}

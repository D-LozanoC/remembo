// Components
import { Button } from "./Button";

// Actions
import { doLogout } from "@/actions";

export function LogoutButton({ className }: { className: string }) {
    return (
        <form action={doLogout}>
            <Button className={className} type="submit">
                Cerrar sesión
            </Button>
        </form>
    )
}

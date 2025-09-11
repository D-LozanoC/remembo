// Components
import { Button } from "../../../atoms/Button";

// Actions
import { doLogout } from "@/actions";

export function LogoutButton({ className = "" }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <form action={doLogout}>
            <Button className={className} variant="logout" type="submit">
                Cerrar sesión
            </Button>
        </form>
    )
}

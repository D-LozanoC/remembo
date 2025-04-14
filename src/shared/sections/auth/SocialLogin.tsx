// Components
import { Button } from "../../components/Button"
import { FcGoogle } from "react-icons/fc";
import { DiGithubBadge } from "react-icons/di"

// Actions
import { doSocialLogin } from "@/actions";

export function SocialLogin() {
  return (
    <form action={doSocialLogin}>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button type="submit" name="action" value="google" variant="secondary" className="flex items-center justify-center">
          <FcGoogle className="mr-2 h-5 w-5" />
          <span>Google</span>
        </Button>
        <Button type="submit" name="action" value="github" variant="secondary" className="flex items-center justify-center">
          <DiGithubBadge className="mr-2 h-5 w-5" />
          <span>Github</span>
        </Button>
      </div>
    </form>
  )
}

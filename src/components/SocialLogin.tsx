import { Button } from "./Button"
import { DiGithubBadge } from "react-icons/di"
import { FcGoogle } from "react-icons/fc";

export function SocialLogin() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      <Button variant="secondary" className="flex items-center justify-center">
        <FcGoogle className="mr-2 h-5 w-5" />
        <span>Google</span>
      </Button>
      <Button variant="secondary" className="flex items-center justify-center">
        <DiGithubBadge className="mr-2 h-5 w-5" />
        <span className="">Github</span>
      </Button>
    </div>
  )
}

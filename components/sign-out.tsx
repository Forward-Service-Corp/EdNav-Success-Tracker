import { signOut } from "next-auth/react"

export function SignOutButton() {
  return <button
    className={`bg-info/40 hover:bg-errorborder-1 border-accent cursor-pointer text-accent-content py-1.5 rounded-lg`}
    onClick={() => signOut()}>Sign Out</button>;
}
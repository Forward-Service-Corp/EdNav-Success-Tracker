import { signIn } from "next-auth/react"

const SignInButton = () => <button
  className={`mt-8 py-2 px-10 bg-primary/50 hover:bg-successborder-1 rounded-lg border-success text-success-content`}
  onClick={() => signIn()}>Sign in</button>;
export default SignInButton;
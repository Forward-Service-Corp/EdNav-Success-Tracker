import { signIn } from 'next-auth/react';

const SignInButton = () => <button
  className={`mt-8 py-2 px-10 bg-primary/50 hover:bg-primary rounded text-primary-content cursor-pointer`}
  onClick={() => signIn()}>Sign in</button>;
export default SignInButton;
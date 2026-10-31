import { SignIn } from "@clerk/react";

export function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <SignIn />
    </div>
  )
}
import { SignUp } from "@clerk/react";

export function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <SignUp />
    </div>
  )
}
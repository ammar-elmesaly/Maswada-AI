import { useAuth } from "@clerk/react";
import { Navigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Loader2Icon } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="flex items-center gap-2">
          <Loader2Icon className="size-4 text-muted-foreground animate-spin" />
          <span><FormattedMessage id="loading" /></span>
        </div>
      </div>
    )
  }
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}
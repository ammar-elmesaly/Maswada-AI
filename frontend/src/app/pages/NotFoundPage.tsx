import { Link } from "react-router-dom"

import { GlassCard } from "@/components/common/GlassCard"

export function NotFoundPage() {
  return (
    <GlassCard className="px-6 py-12 text-center sm:px-10">
      <h1 className="text-2xl font-semibold text-foreground">
        This page drifted away
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        The route you are looking for does not exist yet.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:text-muted-foreground"
      >
        Back to home
      </Link>
    </GlassCard>
  )
}

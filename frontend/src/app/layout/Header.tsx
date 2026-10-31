import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"
import { Link } from "react-router-dom"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto w-full max-w-360 px-4 pt-4 sm:px-6 lg:px-8">
        {/* Using glass class directly - header doesn't need rounded-2xl from glass-card */}
        <div className="glass-card flex items-center justify-between gap-4 rounded-2xl px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-sm font-semibold tracking-wide"
            >
              Maswada AI
            </Link>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              Smart Notes with AI
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button className="cursor-pointer" variant="outline">
              <Languages />
              العربية
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

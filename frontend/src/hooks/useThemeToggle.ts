import { useTheme } from "next-themes"
import type { RefObject } from "react"

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => void
}

export function useThemeToggle(toggleRef: RefObject<HTMLElement | null>) {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark"
    const element = toggleRef.current
    const transitionDocument = document as ViewTransitionDocument

    if (!element || !transitionDocument.startViewTransition) {
      setTheme(nextTheme)
      return
    }

    const { top, left, width, height } = element.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    document.documentElement.style.setProperty("--theme-transition-x", `${x}px`)
    document.documentElement.style.setProperty("--theme-transition-y", `${y}px`)
    document.documentElement.style.setProperty("--theme-transition-radius", `${maxRadius}px`)

    transitionDocument.startViewTransition(() => setTheme(nextTheme))
  }

  return { isDark: resolvedTheme === "dark", toggleTheme }
}

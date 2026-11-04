import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/useLanguage";
import { UserButton } from "@clerk/react";
import { Languages } from "lucide-react"
import { Moon, Sun } from "lucide-react"
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom"
import { useRef } from "react";
import { useThemeToggle } from "@/hooks/useThemeToggle";

export function Header() {
  const { locale, toggleLanguage } = useLanguage();
  const themeToggleRef = useRef<HTMLButtonElement>(null)
  const { isDark, toggleTheme } = useThemeToggle(themeToggleRef);
  const { formatMessage } = useIntl();
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
              <FormattedMessage id="title" />
            </Link>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              <FormattedMessage id="smartNotesWithAI" />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              ref={themeToggleRef}
              className="cursor-pointer"
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label={formatMessage({ id: isDark ? "switchToLightMode" : "switchToDarkMode" })}
              title={formatMessage({ id: isDark ? "switchToLightMode" : "switchToDarkMode" })}
            >
              <span className="transition-transform duration-300 ease-out motion-reduce:transition-none" style={{ transform: isDark ? "rotate(-12deg) scale(1.05)" : "rotate(0deg) scale(1)" }}>
                {isDark ? <Sun /> : <Moon />}
              </span>
            </Button>
            <Button className="cursor-pointer" variant="outline" onClick={toggleLanguage}>
              <Languages />
              <span className="sm:hidden">
                <FormattedMessage id={locale === "ar" ? "shortArabic" : "shortEnglish"} />
              </span>
              <span className="hidden sm:inline">
                <FormattedMessage id={locale === "ar" ? "arabic" : "english"} />
              </span>
            </Button>
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  )
}

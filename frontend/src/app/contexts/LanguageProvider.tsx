import { defaultLocale, type Locale } from "@/i18n";
import { useEffect, useState } from "react";
import { LanguageContext } from "./LanguageContext";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const isRTL = locale === "ar";

  const toggleLanguage = () => {
    setLocale((prevLocale) => (prevLocale === "en" ? "ar" : "en"));
  }

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [locale, isRTL]);
  
  return (
    <LanguageContext.Provider value={{ locale, setLocale, isRTL, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}


import { useLanguage } from "@/hooks/useLanguage";
import { IntlProvider } from "react-intl";
import { resources } from "@/i18n";

export function IntlWrapper({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguage();
  return <IntlProvider locale={locale} messages={resources[locale]}>
    {children}
  </IntlProvider>
}
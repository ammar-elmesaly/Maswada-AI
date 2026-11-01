import en from "./en.json";
import ar from "./ar.json";

export const resources = { en, ar };

export const defaultLocale = "en";
export const supportedLocales = ["en", "ar"];

export type Locale = keyof typeof resources;
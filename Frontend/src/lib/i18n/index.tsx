import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from "react";

import { en } from "./translations/en";
import { ta } from "./translations/ta";
import { hi } from "./translations/hi";
import { te } from "./translations/te";

import { common as commonEn } from "./translations/common/en";
import { common as commonTa } from "./translations/common/ta";
import { common as commonHi } from "./translations/common/hi";
import { common as commonTe } from "./translations/common/te";

export type Language = "en" | "ta" | "hi" | "te";
export type Lang = Language;

export const LANGS: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ta", label: "தமிழ்" },
  { code: "hi", label: "हिंदी" },
  { code: "te", label: "తెలుగు" },
];

export const translations = {
  en: { ...commonEn, ...en },
  ta: { ...commonTa, ...ta },
  hi: { ...commonHi, ...hi },
  te: { ...commonTe, ...te },
} as const;

export const T = translations;

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = keyof typeof translations.en;

interface LanguageCtx {
  language: Language;
  setLanguage: (language: Language) => void;
  lang: Language;
  setLang: (language: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const getInitialLanguage = (): Language => {
    if (typeof window === "undefined") return "en";
    const stored = localStorage.getItem("sense_lang") as Language | null;
    if (stored && LANGS.some((l) => l.code === stored)) return stored;
    const browserLang = navigator.language.slice(0, 2) as Language;
    return LANGS.some((l) => l.code === browserLang) ? browserLang : "en";
  };

  const [language, setLanguage] = useState<Language>(getInitialLanguage());

  const persistLanguage = (lang: Language) => {
    localStorage.setItem("sense_lang", lang);
    document.documentElement.lang = lang;
  };

  const value = useMemo<LanguageCtx>(() => {
    const t = (key: TranslationKey, params?: Record<string, string | number>) => {
      const raw = translations[language]?.[key] ?? translations.en[key] ?? String(key);
      if (!params) return raw;
      return Object.entries(params).reduce(
        (str, [k, v]) => str.replace(new RegExp(`{${k}}`, "g"), String(v)),
        raw,
      );
    };

    return {
      language,
      setLanguage: (lang) => {
        setLanguage(lang);
        persistLanguage(lang);
      },
      lang: language,
      setLang: (lang) => {
        setLanguage(lang);
        persistLanguage(lang);
      },
      t,
    };
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, []);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function useLang() {
  return useLanguage();
}

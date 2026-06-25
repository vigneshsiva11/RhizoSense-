import { Globe } from "lucide-react";
import { LANGS, useLanguage } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-1 shadow-sm">
      <Globe className="ml-1 h-4 w-4 text-muted-foreground" aria-hidden />
      <div className="flex items-center gap-0.5">
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLanguage(l.code)}
            aria-pressed={language === l.code}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
              language === l.code
                ? "bg-navy text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}

import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", label: "English", shortLabel: "EN" },
  { code: "hi", label: "Hindi", shortLabel: "HI" },
  { code: "ta", label: "Tamil", shortLabel: "TA" },
];

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language?.split("-")[0] || "en";

  return (
    <div
      className="inline-flex flex-wrap items-center gap-2 rounded-full bg-white/80 p-2 shadow-sm ring-1 ring-brand-100 backdrop-blur-sm"
      role="group"
      aria-label="Language switcher"
    >
      {languages.map((language) => {
        const isActive = currentLanguage === language.code;

        return (
          <button
            key={language.code}
            type="button"
            onClick={() => i18n.changeLanguage(language.code)}
            aria-pressed={isActive}
            className={[
              "inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-200",
              "focus:outline-none focus:ring-4 focus:ring-brand-100",
              isActive
                ? "bg-brand-500 text-white shadow-[var(--shadow-soft)]"
                : "bg-white text-[color:var(--color-text-main)] hover:bg-brand-50",
            ].join(" ")}
          >
            <span className="hidden sm:inline">{language.label}</span>
            <span className="sm:hidden">{language.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}

export default LanguageSwitcher;
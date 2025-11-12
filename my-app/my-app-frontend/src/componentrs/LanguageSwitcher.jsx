import { useTranslation } from "react-i18next";

const LANG_MAP = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("digitalLibraryLang", code);
  };

  return (
    <div className="join">
      {LANG_MAP.map((lang) => (
        <button
          key={lang.code}
          className={`btn btn-xs join-item ${i18n.language === lang.code ? "btn-primary" : "btn-ghost"}`}
          onClick={() => changeLang(lang.code)}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}

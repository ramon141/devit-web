import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'it', label: 'IT' },
  { code: 'pt', label: 'PT' },
]

// Seletor simples de idioma, persistido em localStorage pelo próprio i18n
function LanguageSwitcher() {
  const { t, i18n } = useTranslation('common')

  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="h-9 rounded-md border border-input bg-background px-2 text-sm"
      aria-label={t('languageSwitcher.ariaLabel')}
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  )
}

export default LanguageSwitcher

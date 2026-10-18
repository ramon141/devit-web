import SelectField from '@/components/SelectField'
import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { value: 'it', label: 'IT' },
  { value: 'pt', label: 'PT' },
]

// Seletor simples de idioma, persistido em localStorage pelo próprio i18n
function LanguageSwitcher() {
  const { i18n } = useTranslation('common')

  return (
    <SelectField
      value={i18n.language}
      onValueChange={(value) => value && i18n.changeLanguage(value)}
      options={LANGUAGES}
      clearable={false}
    />
  )
}

export default LanguageSwitcher

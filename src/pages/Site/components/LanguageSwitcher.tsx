import { useTranslation } from 'react-i18next'
import { toLocale } from '@/lib/site/dict'
import { LOCALES, type Locale } from '@/lib/site/types'

const LOCALE_NAMES: Record<Locale, string> = { it: 'Italiano', pt: 'Português' }

function LanguageSwitcher({ label }: { label: string }) {
  const { i18n } = useTranslation()
  const current = toLocale(i18n.language)

  return (
    <nav aria-label={label} className="flex items-center gap-1">
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => i18n.changeLanguage(locale)}
          aria-current={locale === current ? 'true' : undefined}
          title={LOCALE_NAMES[locale]}
          className={
            'rounded px-1.5 py-1 font-site-mono text-[0.7rem] uppercase tracking-[0.1em] transition-colors ' +
            (locale === current
              ? 'font-medium text-site-accent-deep'
              : 'text-site-muted hover:text-site-ink')
          }
        >
          {locale}
        </button>
      ))}
    </nav>
  )
}

export default LanguageSwitcher

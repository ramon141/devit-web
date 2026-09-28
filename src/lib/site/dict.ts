import { useTranslation } from 'react-i18next'
import itDict from '@/i18n/locales/it/publicSite.json'
import ptDict from '@/i18n/locales/pt/publicSite.json'
import { toNumber } from './property'
import type { Locale, Localized } from './types'

export type SiteDict = typeof itDict

const dictionaries: Record<Locale, SiteDict> = { it: itDict, pt: ptDict }

const LOCALE_TAGS: Record<Locale, string> = { it: 'it-IT', pt: 'pt-BR' }

export function toLocale(language: string): Locale {
  return language.startsWith('pt') ? 'pt' : 'it'
}

// Dicionário do site público na língua atual (mesma escolha do i18n do CRM)
export function useSiteDict() {
  const { i18n } = useTranslation('publicSite')
  const locale = toLocale(i18n.language)

  return { dict: dictionaries[locale], locale }
}

export function pickLocalized<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value.it
}

export function formatPrice(value: number | string | null | undefined, locale: Locale, dict: SiteDict) {
  const amount = toNumber(value)
  if (amount === null) return dict.property.priceOnRequest

  return new Intl.NumberFormat(LOCALE_TAGS[locale], {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(value: number | string | null | undefined, locale: Locale) {
  return new Intl.NumberFormat(LOCALE_TAGS[locale]).format(toNumber(value) ?? 0)
}

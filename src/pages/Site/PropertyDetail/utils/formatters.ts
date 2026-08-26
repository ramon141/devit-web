import type { TFunction } from 'i18next'
import { formatAmount } from '@/utils/formatAmount'

export function formatCurrency(value: number | null | undefined): string | null {
  if (value === null || value === undefined) return null

  return formatAmount(value, { maximumFractionDigits: 0 })
}

export function formatBoolean(t: TFunction<'site'>, value: boolean | null | undefined): string {
  return value ? t('formatters.yes') : t('formatters.no')
}

export function formatFeatureLabel(featureKey: string): string {
  const spaced = featureKey.replace(/[_-]+/g, ' ').trim()

  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

function getConditionLabels(t: TFunction<'site'>): Record<string, string> {
  return {
    new: t('formatters.condition.new'),
    excellent: t('formatters.condition.excellent'),
    good: t('formatters.condition.good'),
    to_renovate: t('formatters.condition.toRenovate'),
  }
}

function getFurnishedLabels(t: TFunction<'site'>): Record<string, string> {
  return {
    yes: t('formatters.furnished.yes'),
    partial: t('formatters.furnished.partial'),
    no: t('formatters.furnished.no'),
  }
}

function getAvailabilityLabels(t: TFunction<'site'>): Record<string, string> {
  return {
    available: t('formatters.availability.available'),
    occupied: t('formatters.availability.occupied'),
    under_renovation: t('formatters.availability.underRenovation'),
  }
}

function getMediationTypeLabels(t: TFunction<'site'>): Record<string, string> {
  return {
    exclusive: t('formatters.mediationType.exclusive'),
    open: t('formatters.mediationType.open'),
  }
}

function translateWithFallback(dictionary: Record<string, string>, value: string): string {
  return dictionary[value] ?? value
}

export function formatCondition(t: TFunction<'site'>, value: string): string {
  return translateWithFallback(getConditionLabels(t), value)
}

export function formatFurnished(t: TFunction<'site'>, value: string): string {
  return translateWithFallback(getFurnishedLabels(t), value)
}

export function formatAvailability(t: TFunction<'site'>, value: string): string {
  return translateWithFallback(getAvailabilityLabels(t), value)
}

export function formatMediationType(t: TFunction<'site'>, value: string): string {
  return translateWithFallback(getMediationTypeLabels(t), value)
}

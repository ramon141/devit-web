import type { TFunction } from 'i18next'
import { formatAmount } from '@/utils/formatAmount'
import { PropertyDetailCondition } from '@/api/generated/models/propertyDetailCondition'
import { PropertyDetailFurnished } from '@/api/generated/models/propertyDetailFurnished'
import { PropertyDetailAvailability } from '@/api/generated/models/propertyDetailAvailability'
import { PropertyDetailMediationType } from '@/api/generated/models/propertyDetailMediationType'

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

// Chaves derivadas dos enums gerados pelo orval — não podem divergir do backend.
function labelsFromEnum(
  enumObject: Record<string, string>,
  translate: (value: string) => string,
): Record<string, string> {
  return Object.fromEntries(
    Object.values(enumObject).map(value => [value, translate(value)]),
  )
}

function getConditionLabels(t: TFunction<'site'>): Record<string, string> {
  return labelsFromEnum(PropertyDetailCondition, value => t(`formatters.condition.${value}`))
}

function getFurnishedLabels(t: TFunction<'site'>): Record<string, string> {
  return labelsFromEnum(PropertyDetailFurnished, value => t(`formatters.furnished.${value}`))
}

function getAvailabilityLabels(t: TFunction<'site'>): Record<string, string> {
  return labelsFromEnum(PropertyDetailAvailability, value => t(`formatters.availability.${value}`))
}

function getMediationTypeLabels(t: TFunction<'site'>): Record<string, string> {
  return labelsFromEnum(PropertyDetailMediationType, value => t(`formatters.mediationType.${value}`))
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

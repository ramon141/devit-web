import type { TFunction } from 'i18next'

export function getIndustrialAreaTypeOptions(t: TFunction<'imoveis'>) {
  return [
    { value: 'work_area', label: t('options.industrialAreaType.workArea') },
    { value: 'warehouse', label: t('options.industrialAreaType.warehouse') },
    { value: 'office', label: t('options.industrialAreaType.office') },
    { value: 'mezzanine', label: t('options.industrialAreaType.mezzanine') },
    { value: 'service', label: t('options.industrialAreaType.service') },
    { value: 'shed', label: t('options.industrialAreaType.shed') },
    { value: 'courtyard', label: t('options.industrialAreaType.courtyard') },
    { value: 'covered_area', label: t('options.industrialAreaType.coveredArea') },
    { value: 'uncovered_area', label: t('options.industrialAreaType.uncoveredArea') },
  ]
}

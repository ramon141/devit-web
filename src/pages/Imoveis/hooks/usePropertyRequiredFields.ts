import { useWatch, type Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { PropertyPurpose } from '@/api/generated/models'
import type { PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

export type RequiredField = {
  field: string
  stepValue: string
  label: string
  done: boolean
}

const MIN_TITLE_LENGTH = 3

// Campos obrigatórios do cadastro com a etapa onde cada um mora e se já foram preenchidos
export function usePropertyRequiredFields(control: Control<PropertyFormValues>) {
  const { t } = useTranslation('imoveis')
  const values = useWatch({ control })
  const isRentOnly = values.purpose === PropertyPurpose.rent

  const fields: RequiredField[] = [
    { field: 'code', stepValue: 'generale', label: t('generalTab.codeLabel'), done: !!values.code },
    {
      field: 'title',
      stepValue: 'generale',
      label: t('generalTab.titleLabel'),
      done: (values.title ?? '').length >= MIN_TITLE_LENGTH,
    },
    {
      field: 'categoryId',
      stepValue: 'generale',
      label: t('categoryOwnerFields.categoryLabel'),
      done: !!values.categoryId,
    },
    {
      field: 'ownerId',
      stepValue: 'generale',
      label: t('categoryOwnerFields.ownerLabel'),
      done: !!values.ownerId,
    },
    { field: 'purpose', stepValue: 'generale', label: t('generalTab.purposeLabel'), done: !!values.purpose },
    { field: 'status', stepValue: 'generale', label: t('generalTab.statusLabel'), done: !!values.status },
    ...(isRentOnly
      ? []
      : [
          {
            field: 'salePrice',
            stepValue: 'prezzo',
            label: t('priceTab.salePriceLabel'),
            done: !!values.salePrice,
          },
        ]),
    {
      field: 'city',
      stepValue: 'localizzazione',
      label: t('locationTab.cityLabel'),
      done: !!values.city?.trim(),
    },
  ]

  return { fields, done: fields.filter((item) => item.done).length, total: fields.length }
}

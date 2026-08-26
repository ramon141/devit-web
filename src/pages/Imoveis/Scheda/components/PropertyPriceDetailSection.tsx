import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { usePropertyPriceDetailForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyPriceDetailForm'

type PropertyPriceDetailSectionProps = {
  propertyId: string
}

function PropertyPriceDetailSection({ propertyId }: PropertyPriceDetailSectionProps) {
  const { t } = useTranslation('imoveis')
  const { form, isLoading, isSubmitting, onSubmit } = usePropertyPriceDetailForm(propertyId)
  const { register, control } = form

  const flagFields = [
    { name: 'negotiable', label: t('scheda.priceDetailSection.flags.negotiable') },
    { name: 'priceFrom', label: t('scheda.priceDetailSection.flags.priceFrom') },
    { name: 'hiddenOnPrint', label: t('scheda.priceDetailSection.flags.hiddenOnPrint') },
    { name: 'hiddenOnInternet', label: t('scheda.priceDetailSection.flags.hiddenOnInternet') },
    { name: 'boxIncludedInPrice', label: t('scheda.priceDetailSection.flags.boxIncludedInPrice') },
    { name: 'auction', label: t('scheda.priceDetailSection.flags.auction') },
  ] as const

  if (isLoading) return null

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
      <Separator className="sm:col-span-2" />
      <p className="text-sm font-medium sm:col-span-2">{t('scheda.priceDetailSection.title')}</p>

      <FormFieldWrapper label={t('scheda.priceDetailSection.estimatedValueLabel')}>
        <Input {...register('estimatedValue')} type="number" />
      </FormFieldWrapper>

      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        {flagFields.map((flag) => (
          <Controller
            key={flag.name}
            control={control}
            name={flag.name}
            render={({ field }) => (
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={field.value} onCheckedChange={field.onChange} />
                {flag.label}
              </label>
            )}
          />
        ))}
      </div>

      <div className="flex justify-end sm:col-span-2">
        <Button type="submit" disabled={isSubmitting}>{t('scheda.priceDetailSection.save')}</Button>
      </div>
    </form>
  )
}

export default PropertyPriceDetailSection

import { InfoIcon } from 'lucide-react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { PriceDetailFormValues } from '@/pages/Imoveis/Scheda/hooks/usePropertyPriceDetailForm'

type PropertyPriceDetailSectionProps = {
  form: UseFormReturn<PriceDetailFormValues>
}

// Campos de "opções de preço": sem <form noValidate>/botão próprio, o submit é
// disparado junto com o botão "Próximo" do wizard (ver PropertyPriceTab)
function PropertyPriceDetailSection({ form }: PropertyPriceDetailSectionProps) {
  const { t } = useTranslation('imoveis')
  const { register, control } = form

  const flagFields = ([
    'negotiable',
    'priceFrom',
    'hiddenOnPrint',
    'hiddenOnInternet',
    'boxIncludedInPrice',
    'auction',
  ] as const).map((name) => ({
    name,
    label: t(`scheda.priceDetailSection.flags.${name}`),
    hint: t(`scheda.priceDetailSection.flags.${name}Hint`),
  }))

  return (
    <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
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

                <Tooltip>
                  <TooltipTrigger render={<InfoIcon className="size-4 text-muted-foreground" />} />
                  <TooltipContent className="max-w-xs">{flag.hint}</TooltipContent>
                </Tooltip>
              </label>
            )}
          />
        ))}
      </div>
    </div>
  )
}

export default PropertyPriceDetailSection

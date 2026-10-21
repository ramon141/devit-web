import { Controller, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { LeadFormValues } from '@/pages/Clientes/Leads/schemas/leadSchema'

type FeatureName = 'wantsElevator' | 'wantsParking' | 'wantsTerrace' | 'wantsBalcony'

const FEATURES: FeatureName[] = ['wantsElevator', 'wantsParking', 'wantsTerrace', 'wantsBalcony']

type LeadFeatureFieldsProps = {
  form: UseFormReturn<LeadFormValues>
}

// Características exigidas pelo cliente; desmarcado = indiferente
function LeadFeatureFields({ form }: LeadFeatureFieldsProps) {
  const { t } = useTranslation('clientes')

  return (
    <div id="modal-field-features" className="grid gap-2 sm:col-span-2">
      <span className="text-sm font-medium">{t('leadFormFields.features')}</span>

      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {FEATURES.map((feature) => (
          <Controller
            key={feature}
            control={form.control}
            name={feature}
            render={({ field }) => (
              <Label className="flex items-center gap-2 font-normal">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
                {t(`leadFormFields.${feature}`)}
              </Label>
            )}
          />
        ))}
      </div>
    </div>
  )
}

export default LeadFeatureFields

import { Controller, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { IndustrialFormValues } from '@/pages/Imoveis/Scheda/hooks/usePropertyIndustrialForm'

type IndustrialDetailFieldsProps = {
  form: UseFormReturn<IndustrialFormValues>
}

function IndustrialDetailFields({ form }: IndustrialDetailFieldsProps) {
  const { t } = useTranslation('imoveis')
  const { register, control } = form

  return (
    <>
      <FormFieldWrapper label={t('scheda.industrialDetailFields.heightLabel')}>
        <Input {...register('heightM')} type="number" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.industrialDetailFields.heightUnderBeamLabel')}>
        <Input {...register('heightUnderBeamM')} type="number" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.industrialDetailFields.floorsCountLabel')}>
        <Input {...register('floorsCount')} type="number" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.industrialDetailFields.entrancesCountLabel')}>
        <Input {...register('entrancesCount')} type="number" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.industrialDetailFields.loadingBaysCountLabel')}>
        <Input {...register('loadingBaysCount')} type="number" />
      </FormFieldWrapper>
      <FormFieldWrapper label={t('scheda.industrialDetailFields.allowedActivitiesLabel')}>
        <Input {...register('allowedActivities')} />
      </FormFieldWrapper>

      <div className="flex items-center gap-4 sm:col-span-2">
        <Controller control={control} name="hasOverheadCrane" render={({ field }) => (
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            {t('scheda.industrialDetailFields.hasOverheadCrane')}
          </label>
        )} />
        <Controller control={control} name="hasAlarm" render={({ field }) => (
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            {t('scheda.industrialDetailFields.hasAlarm')}
          </label>
        )} />
      </div>
    </>
  )
}

export default IndustrialDetailFields

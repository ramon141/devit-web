import { Controller, useWatch, type Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import type { PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

type PropertyFlagsRowProps = {
  control: Control<PropertyFormValues>
}

function PropertyFlagsRow({ control }: PropertyFlagsRowProps) {
  const { t } = useTranslation('imoveis')
  const featured = useWatch({ control, name: 'featured' })

  return (
    <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
      <Controller
        control={control}
        name="featured"
        render={({ field }) => (
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            {t('flagsRow.featured')}
          </label>
        )}
      />
      {featured && (
        <Controller
          control={control}
          name="featuredOrder"
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              placeholder={t('flagsRow.featuredOrderPlaceholder')}
              className="w-40"
            />
          )}
        />
      )}
      <Controller
        control={control}
        name="publishedOnSite"
        render={({ field }) => (
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            {t('flagsRow.publishedOnSite')}
          </label>
        )}
      />
      <Controller
        control={control}
        name="active"
        render={({ field }) => (
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            {t('flagsRow.active')}
          </label>
        )}
      />
    </div>
  )
}

export default PropertyFlagsRow

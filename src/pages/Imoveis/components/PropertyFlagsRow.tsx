import { Controller, useWatch, type Control } from 'react-hook-form'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import type { PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

type PropertyFlagsRowProps = {
  control: Control<PropertyFormValues>
}

function PropertyFlagsRow({ control }: PropertyFlagsRowProps) {
  const featured = useWatch({ control, name: 'featured' })

  return (
    <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
      <Controller
        control={control}
        name="featured"
        render={({ field }) => (
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            In evidenza
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
              placeholder="Ordine in evidenza"
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
            Pubblicato sul sito
          </label>
        )}
      />
      <Controller
        control={control}
        name="active"
        render={({ field }) => (
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            Attivo
          </label>
        )}
      />
    </div>
  )
}

export default PropertyFlagsRow

import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import ComponentSection from '@/pages/Componentes/components/ComponentSection'

type SelectFormValues = {
  propertyType: string
}

function SelectSection() {
  const { t } = useTranslation('componentes')
  const form = useForm<SelectFormValues>({
    defaultValues: { propertyType: 'villa' },
  })

  const propertyTypes = [
    { value: 'villa', label: t('propertyTypes.villa') },
    { value: 'appartamento', label: t('propertyTypes.appartamento') },
    { value: 'attico', label: t('propertyTypes.attico') },
    { value: 'casale', label: t('propertyTypes.casale') },
  ]

  return (
    <ComponentSection
      id="select"
      title={t('select.title')}
      description={t('select.description')}
    >
      <div className="grid max-w-xs gap-2">
        <Label>{t('select.propertyTypeLabel')}</Label>

        <Form {...form}>
          <FormField
            control={form.control}
            name="propertyType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('select.placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      </div>
    </ComponentSection>
  )
}

export default SelectSection

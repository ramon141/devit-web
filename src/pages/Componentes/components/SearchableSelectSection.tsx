import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import SearchableSelect from '@/components/SearchableSelect'
import ComponentSection from '@/pages/Componentes/components/ComponentSection'

type SearchableSelectFormValues = {
  city: string
}

function SearchableSelectSection() {
  const { t } = useTranslation('componentes')
  const form = useForm<SearchableSelectFormValues>({
    defaultValues: { city: '' },
  })

  const cities = [
    { value: 'napoli', label: t('searchableSelect.cities.napoli') },
    { value: 'sorrento', label: t('searchableSelect.cities.sorrento') },
    { value: 'positano', label: t('searchableSelect.cities.positano') },
    { value: 'massa-lubrense', label: t('searchableSelect.cities.massaLubrense') },
    { value: 'capri', label: t('searchableSelect.cities.capri') },
    { value: 'amalfi', label: t('searchableSelect.cities.amalfi') },
    { value: 'ravello', label: t('searchableSelect.cities.ravello') },
    { value: 'roma', label: t('searchableSelect.cities.roma') },
    { value: 'milano', label: t('searchableSelect.cities.milano') },
    { value: 'torino', label: t('searchableSelect.cities.torino') },
  ]

  return (
    <ComponentSection
      id="searchable-select"
      title={t('searchableSelect.title')}
      description={t('searchableSelect.description')}
    >
      <div className="grid max-w-xs gap-2">
        <Label>{t('searchableSelect.cityLabel')}</Label>

        <Form {...form}>
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <SearchableSelect
                    options={cities}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder={t('searchableSelect.placeholder')}
                    searchPlaceholder={t('searchableSelect.searchPlaceholder')}
                    emptyText={t('searchableSelect.emptyText')}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      </div>
    </ComponentSection>
  )
}

export default SearchableSelectSection

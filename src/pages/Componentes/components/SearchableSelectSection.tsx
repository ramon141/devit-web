import { useForm } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import SearchableSelect from '@/components/SearchableSelect'
import ComponentSection from '@/pages/Componentes/components/ComponentSection'

const cities = [
  { value: 'napoli', label: 'Napoli' },
  { value: 'sorrento', label: 'Sorrento' },
  { value: 'positano', label: 'Positano' },
  { value: 'massa-lubrense', label: 'Massa Lubrense' },
  { value: 'capri', label: 'Capri' },
  { value: 'amalfi', label: 'Amalfi' },
  { value: 'ravello', label: 'Ravello' },
  { value: 'roma', label: 'Roma' },
  { value: 'milano', label: 'Milano' },
  { value: 'torino', label: 'Torino' },
]

type SearchableSelectFormValues = {
  city: string
}

function SearchableSelectSection() {
  const form = useForm<SearchableSelectFormValues>({
    defaultValues: { city: '' },
  })

  return (
    <ComponentSection
      id="searchable-select"
      title="Select con ricerca"
      description="Combobox con campo di ricerca, per liste lunghe. Usato con il Controller del react-hook-form."
    >
      <div className="grid max-w-xs gap-2">
        <Label>Città</Label>

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
                    placeholder="Seleziona una città"
                    searchPlaceholder="Cerca città..."
                    emptyText="Nessuna città trovata."
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

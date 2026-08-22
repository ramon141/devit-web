import { useForm } from 'react-hook-form'
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

const propertyTypes = [
  { value: 'villa', label: 'Villa' },
  { value: 'appartamento', label: 'Appartamento' },
  { value: 'attico', label: 'Attico' },
  { value: 'casale', label: 'Casale' },
]

type SelectFormValues = {
  propertyType: string
}

function SelectSection() {
  const form = useForm<SelectFormValues>({
    defaultValues: { propertyType: 'villa' },
  })

  return (
    <ComponentSection
      id="select"
      title="Select"
      description="Usato con il Controller del react-hook-form, secondo lo standard del progetto."
    >
      <div className="grid max-w-xs gap-2">
        <Label>Tipo di immobile</Label>

        <Form {...form}>
          <FormField
            control={form.control}
            name="propertyType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleziona un tipo" />
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

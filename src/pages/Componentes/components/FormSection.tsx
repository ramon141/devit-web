import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import InputMoney from '@/components/InputMoney'
import ComponentSection from '@/pages/Componentes/components/ComponentSection'

const propertyFormSchema = z.object({
  title: z.string().min(3, 'Inserisci un titolo di almeno 3 lettere'),
  type: z.string().min(1, 'Seleziona un tipo'),
  price: z.string().optional(),
})

type PropertyFormValues = z.infer<typeof propertyFormSchema>

function FormSection() {
  const [submitted, setSubmitted] = useState<PropertyFormValues | null>(null)

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: { title: '', type: '', price: undefined },
  })

  function onSubmit(values: PropertyFormValues) {
    setSubmitted(values)
  }

  return (
    <ComponentSection
      id="form"
      title="Form"
      description="Composizione di Input (register), Select (Controller) e InputMoney con validazione via zod."
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid max-w-md gap-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titolo dell'annuncio</FormLabel>
                <FormControl>
                  <Input placeholder="Villa in Parco Esclusivo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo di immobile</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleziona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="appartamento">Appartamento</SelectItem>
                      <SelectItem value="attico">Attico</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <InputMoney
            name="price"
            label="Prezzo"
            value={form.watch('price')}
            setValue={(value) => form.setValue('price', value)}
          />

          <Button type="submit" className="w-fit">
            Salva annuncio
          </Button>
        </form>
      </Form>

      {submitted && (
        <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-3 text-xs">
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </ComponentSection>
  )
}

export default FormSection

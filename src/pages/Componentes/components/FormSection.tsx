import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import i18n from '@/i18n'
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

function createPropertyFormSchema() {
  return z.object({
    title: z.string().min(3, i18n.t('form.titleError', { ns: 'componentes' })),
    type: z.string().min(1, i18n.t('form.typeError', { ns: 'componentes' })),
    price: z.string().optional(),
  })
}

type PropertyFormValues = z.infer<ReturnType<typeof createPropertyFormSchema>>

function FormSection() {
  const { t } = useTranslation('componentes')
  const [submitted, setSubmitted] = useState<PropertyFormValues | null>(null)

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(createPropertyFormSchema()),
    defaultValues: { title: '', type: '', price: undefined },
  })

  function onSubmit(values: PropertyFormValues) {
    setSubmitted(values)
  }

  return (
    <ComponentSection
      id="form"
      title={t('form.title')}
      description={t('form.description')}
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
                <FormLabel>{t('form.titleField')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('form.titlePlaceholder')} {...field} />
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
                <FormLabel>{t('form.typeField')}</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t('form.typePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="villa">{t('propertyTypes.villa')}</SelectItem>
                      <SelectItem value="appartamento">{t('propertyTypes.appartamento')}</SelectItem>
                      <SelectItem value="attico">{t('propertyTypes.attico')}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <InputMoney
            name="price"
            label={t('form.priceLabel')}
            value={form.watch('price')}
            setValue={(value) => form.setValue('price', value)}
          />

          <Button type="submit" className="w-fit">
            {t('form.submit')}
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

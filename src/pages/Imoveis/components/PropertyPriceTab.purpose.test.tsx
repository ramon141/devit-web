import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { renderWithProviders, screen, userEvent, waitFor } from '@/test'
import { createPropertySchema, type PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'
import { tImoveis, validValues } from '@/pages/Imoveis/schemas/imoveisTestHelpers'
import { PropertyDraftProvider } from '@/pages/Imoveis/contexts/PropertyDraftProvider'
import PropertyPriceTab from './PropertyPriceTab'

function Harness() {
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(createPropertySchema(tImoveis)),
    defaultValues: { ...validValues, purpose: 'sale', salePrice: '300000' },
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  return (
    <PropertyDraftProvider>
      <PropertyPriceTab form={form} onSubmit={(event) => event.preventDefault()} isSubmitting={false} />
      <button type="button" onClick={() => form.setValue('purpose', 'rent', { shouldValidate: true })}>
        to-rent
      </button>
      <output data-testid="sale">{String(form.watch('salePrice'))}</output>
      <output data-testid="errors">{Object.keys(form.formState.errors).join(',')}</output>
    </PropertyDraftProvider>
  )
}

describe('Imóveis: troca de finalidade com preço já digitado', () => {
  // Comportamento real: o campo de preço de venda some e o valor antigo é descartado,
  // então o usuário não envia nem fica com erro pendente de um campo que não vê.
  it('T091 venda -> locação: preço de venda some do formulário e não é enviado', async () => {
    renderWithProviders(<Harness />)

    expect(await screen.findByText('Prezzo di vendita')).toBeInTheDocument()
    expect(screen.getByTestId('sale')).toHaveTextContent('300000')

    await userEvent.click(screen.getByRole('button', { name: 'to-rent' }))

    await waitFor(() => expect(screen.queryByText('Prezzo di vendita')).not.toBeInTheDocument())
    expect(screen.getByTestId('sale')).toHaveTextContent('undefined')
    expect(screen.getByTestId('errors')).toBeEmptyDOMElement()
  })
})

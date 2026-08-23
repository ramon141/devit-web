import { useWatch, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import InputMoney from '@/components/InputMoney'
import PropertyPriceDetailSection from '@/pages/Imoveis/Scheda/components/PropertyPriceDetailSection'
import type { PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

type PropertyPriceTabProps = {
  form: UseFormReturn<PropertyFormValues>
  onSubmit: () => void
  isSubmitting: boolean
  propertyId?: string
}

function PropertyPriceTab({ form, onSubmit, isSubmitting, propertyId }: PropertyPriceTabProps) {
  const { control, setValue } = form
  const salePrice = useWatch({ control, name: 'salePrice' })
  const rentPrice = useWatch({ control, name: 'rentPrice' })
  const condoFee = useWatch({ control, name: 'condoFee' })

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <form onSubmit={onSubmit} className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
        <InputMoney
          name="salePrice"
          label="Prezzo di vendita"
          value={salePrice}
          setValue={(value) => setValue('salePrice', value)}
        />

        <InputMoney
          name="rentPrice"
          label="Prezzo di affitto"
          value={rentPrice}
          setValue={(value) => setValue('rentPrice', value)}
        />

        <InputMoney
          name="condoFee"
          label="Spese condominiali mensili"
          value={condoFee}
          setValue={(value) => setValue('condoFee', value)}
        />

        <div className="flex justify-end sm:col-span-2">
          <Button type="submit" disabled={isSubmitting}>
            Salva prezzo
          </Button>
        </div>
      </form>

      {propertyId && <PropertyPriceDetailSection propertyId={propertyId} />}
    </div>
  )
}

export default PropertyPriceTab

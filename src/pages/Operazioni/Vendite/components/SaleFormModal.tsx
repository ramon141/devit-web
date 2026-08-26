import ModalRegister from '@/components/ModalRegister'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { SaleWithRelations } from '@/api/generated/models'
import { useSaleForm } from '@/pages/Operazioni/Vendite/hooks/useSaleForm'
import SaleFormFields from '@/pages/Operazioni/Vendite/components/SaleFormFields'
import SaleDocumentsManager from '@/pages/Operazioni/Vendite/components/SaleDocumentsManager'
import SaleStatusHistoryTab from '@/pages/Operazioni/Vendite/components/SaleStatusHistoryTab'

type SaleFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale?: SaleWithRelations | null
}

function SaleFormModal({ open, onOpenChange, sale }: SaleFormModalProps) {
  const { form, isSubmitting, onSubmit } = useSaleForm({
    sale,
    onSaved: () => onOpenChange(false),
  })

  return (
    <ModalRegister open={open} onOpenChange={onOpenChange} title={sale ? 'Modifica vendita' : 'Nuova vendita'}>
      <Tabs defaultValue="dati" className="w-full">
        <TabsList>
          <TabsTrigger value="dati">Dati</TabsTrigger>
          <TabsTrigger value="documenti" disabled={!sale?.id}>
            Documenti
          </TabsTrigger>
          <TabsTrigger value="storico" disabled={!sale?.id}>
            Storico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dati">
          <form onSubmit={onSubmit} className="grid gap-4">
            <SaleFormFields form={form} />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annulla
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Salva
              </Button>
            </div>
          </form>
        </TabsContent>

        {sale?.id && (
          <TabsContent value="documenti">
            <SaleDocumentsManager saleId={sale.id} />
          </TabsContent>
        )}

        {sale?.id && (
          <TabsContent value="storico">
            <SaleStatusHistoryTab saleId={sale.id} />
          </TabsContent>
        )}
      </Tabs>
    </ModalRegister>
  )
}

export default SaleFormModal

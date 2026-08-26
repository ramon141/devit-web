import { useState } from 'react'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import Stepper from '@/components/Stepper'
import type { SaleWithRelations } from '@/api/generated/models'
import { useSaleForm } from '@/pages/Operazioni/Vendite/hooks/useSaleForm'
import SaleGeneralStepFields from '@/pages/Operazioni/Vendite/components/SaleGeneralStepFields'
import SalePaymentStepFields from '@/pages/Operazioni/Vendite/components/SalePaymentStepFields'
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
  const [activeStep, setActiveStep] = useState('generale')

  const steps = [
    { value: 'generale', label: 'Generale', step: 1 },
    { value: 'pagamento', label: 'Pagamento', step: 2 },
    { value: 'documenti', label: 'Documenti', step: 3, locked: !sale?.id },
    { value: 'storico', label: 'Storico', step: 4, locked: !sale?.id },
  ]
  const isDataStep = activeStep === 'generale' || activeStep === 'pagamento'

  return (
    <ModalRegister open={open} onOpenChange={onOpenChange} title={sale ? 'Modifica vendita' : 'Nuova vendita'}>
      <Tabs value={activeStep} onValueChange={(value) => setActiveStep(value as string)}>
        <Stepper steps={steps} />

        <form onSubmit={onSubmit} className="grid gap-4">
          <TabsContent value="generale">
            <SaleGeneralStepFields form={form} />
          </TabsContent>

          <TabsContent value="pagamento">
            <SalePaymentStepFields form={form} />
          </TabsContent>

          {isDataStep && (
            <FormModalFooter onCancel={() => onOpenChange(false)} isSubmitting={isSubmitting} />
          )}
        </form>

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

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  tourActiveTab?: string
}

function SaleFormModal({ open, onOpenChange, sale, tourActiveTab }: SaleFormModalProps) {
  const { t } = useTranslation('operazioni')
  const { form, isSubmitting, onSubmit } = useSaleForm({
    sale,
    onSaved: () => onOpenChange(false),
  })
  const [activeStep, setActiveStep] = useState('generale')

  useEffect(() => {
    if (tourActiveTab) setActiveStep(tourActiveTab)
  }, [tourActiveTab])

  const steps = [
    { value: 'generale', label: t('vendite.formModal.generalStep'), step: 1 },
    { value: 'pagamento', label: t('vendite.formModal.paymentStep'), step: 2 },
    { value: 'documenti', label: t('vendite.formModal.documentsStep'), step: 3, locked: !sale?.id },
    { value: 'storico', label: t('vendite.formModal.historyStep'), step: 4, locked: !sale?.id },
  ]
  const isDataStep = activeStep === 'generale' || activeStep === 'pagamento'

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={sale ? t('vendite.formModal.editTitle') : t('vendite.formModal.newTitle')}
    >
      <Tabs value={activeStep} onValueChange={(value) => setActiveStep(value as string)}>
        <Stepper steps={steps} />

        <form id="modal-vendite-form" onSubmit={onSubmit} className="grid gap-4">
          <TabsContent id="modal-vendite-tab-generale" value="generale">
            <SaleGeneralStepFields form={form} />
          </TabsContent>

          <TabsContent id="modal-vendite-tab-pagamento" value="pagamento">
            <SalePaymentStepFields form={form} />
          </TabsContent>

          {isDataStep && (
            <FormModalFooter
              id="modal-btn-actions"
              onCancel={() => onOpenChange(false)}
              isSubmitting={isSubmitting}
            />
          )}
        </form>

        {sale?.id && (
          <TabsContent id="modal-vendite-tab-documenti" value="documenti">
            <SaleDocumentsManager saleId={sale.id} />
          </TabsContent>
        )}

        {sale?.id && (
          <TabsContent id="modal-vendite-tab-storico" value="storico">
            <SaleStatusHistoryTab saleId={sale.id} />
          </TabsContent>
        )}
      </Tabs>
    </ModalRegister>
  )
}

export default SaleFormModal

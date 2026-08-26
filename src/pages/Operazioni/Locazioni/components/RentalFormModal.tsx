import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { RentalContractWithRelations } from '@/api/generated/models'
import { useRentalContractForm } from '@/pages/Operazioni/Locazioni/hooks/useRentalContractForm'
import RentalFormFields from '@/pages/Operazioni/Locazioni/components/RentalFormFields'
import RentalContractAttachmentsManager from '@/pages/Operazioni/Locazioni/components/RentalContractAttachmentsManager'
import RentalContractRenewalsHistory from '@/pages/Operazioni/Locazioni/components/RentalContractRenewalsHistory'

type RentalFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  contract?: RentalContractWithRelations | null
}

function RentalFormModal({ open, onOpenChange, contract }: RentalFormModalProps) {
  const { t } = useTranslation('operazioni')
  const { form, isSubmitting, onSubmit } = useRentalContractForm({
    contract,
    onSaved: () => onOpenChange(false),
  })

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={contract ? t('locazioni.formModal.editTitle') : t('locazioni.formModal.newTitle')}
    >
      <Tabs defaultValue="dati" className="w-full">
        <TabsList>
          <TabsTrigger value="dati">{t('locazioni.formModal.dataTab')}</TabsTrigger>
          <TabsTrigger value="allegati" disabled={!contract?.id}>
            {t('locazioni.formModal.attachmentsTab')}
          </TabsTrigger>
          <TabsTrigger value="storico" disabled={!contract?.id}>
            {t('locazioni.formModal.historyTab')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dati">
          <form onSubmit={onSubmit} className="grid gap-4">
            <RentalFormFields form={form} />

            <FormModalFooter onCancel={() => onOpenChange(false)} isSubmitting={isSubmitting} />
          </form>
        </TabsContent>

        {contract?.id && (
          <TabsContent value="allegati">
            <RentalContractAttachmentsManager contractId={contract.id} />
          </TabsContent>
        )}

        {contract?.id && (
          <TabsContent value="storico">
            <RentalContractRenewalsHistory contractId={contract.id} />
          </TabsContent>
        )}
      </Tabs>
    </ModalRegister>
  )
}

export default RentalFormModal

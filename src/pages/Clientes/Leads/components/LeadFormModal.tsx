import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
import type { Lead } from '@/api/generated/models'
import { useLeadForm } from '@/pages/Clientes/Leads/hooks/useLeadForm'
import LeadFormFields from '@/pages/Clientes/Leads/components/LeadFormFields'
import LeadCriteriaFields from '@/pages/Clientes/Leads/components/LeadCriteriaFields'

type LeadFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead?: Lead | null
}

function LeadFormModal({ open, onOpenChange, lead }: LeadFormModalProps) {
  const { t } = useTranslation('clientes')
  const { form, isSubmitting, onSubmit } = useLeadForm({
    lead,
    onSaved: () => onOpenChange(false),
  })

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={lead ? t('leadFormModal.editTitle') : t('leadFormModal.newTitle')}
    >
      <form id="modal-leads-form" onSubmit={onSubmit} className="grid gap-4">
        <LeadFormFields form={form} />

        <div id="modal-leads-criteria" className="grid gap-4 border-t pt-4">
          <h3 className="text-sm font-semibold">{t('leadFormModal.criteriaTitle')}</h3>

          <LeadCriteriaFields form={form} />
        </div>

        <FormModalFooter
          id="modal-btn-actions"
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </form>
    </ModalRegister>
  )
}

export default LeadFormModal

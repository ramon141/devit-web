import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { usePersonControllerFind } from '@/api/generated/api'
import { PersonRole } from '@/api/generated/models/personRole'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SearchableSelect from '@/components/SearchableSelect'
import { useOwnerAccessActions } from '@/pages/Amministrazione/Proprietari/hooks/useOwnerAccessActions'

type OwnerAccessFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

function OwnerAccessFormModal({ open, onOpenChange, onCreated }: OwnerAccessFormModalProps) {
  const { t } = useTranslation('amministrazione')
  const [personId, setPersonId] = useState('')
  const [email, setEmail] = useState('')
  const { createAccess } = useOwnerAccessActions(onCreated)

  const { data: owners } = usePersonControllerFind({
    filter: { where: { role: PersonRole.owner }, order: ['name ASC'], limit: 200 },
  })
  const ownerOptions = (owners ?? []).map((owner) => ({ value: owner.id ?? '', label: owner.name }))

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!personId || !email) return

    createAccess(personId, email)
    onOpenChange(false)
    setPersonId('')
    setEmail('')
  }

  return (
    <ModalRegister open={open} onOpenChange={onOpenChange} title={t('proprietari.formModal.title')}>
      <form onSubmit={submit} className="grid gap-4">
        <SearchableSelect
          label={t('proprietari.formModal.ownerLabel')}
          required
          options={ownerOptions}
          value={personId}
          onValueChange={setPersonId}
          placeholder={t('proprietari.formModal.ownerPlaceholder')}
        />

        <FormFieldWrapper label={t('proprietari.formModal.emailLabel')} required>
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </FormFieldWrapper>

        <FormModalFooter onCancel={() => onOpenChange(false)} />
      </form>
    </ModalRegister>
  )
}

export default OwnerAccessFormModal

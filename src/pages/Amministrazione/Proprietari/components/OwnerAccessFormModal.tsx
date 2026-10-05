import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SearchableSelect from '@/components/SearchableSelect'
import { usePersonSearchOptions } from '@/hooks/usePersonSearchOptions'
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

  // role "owner" é raramente usado: a maioria dos proprietários reais está
  // cadastrada como "contact". Busca por nome em todas as pessoas, não só por role.
  const { options: ownerOptions, isLoading: isLoadingOwners, setSearch } =
    usePersonSearchOptions(personId)

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
      <form id="modal-proprietari-form" onSubmit={submit} className="grid gap-4">
        <div id="modal-field-owner">
          <SearchableSelect
            label={t('proprietari.formModal.ownerLabel')}
            required
            options={ownerOptions}
            value={personId}
            onValueChange={setPersonId}
            placeholder={t('proprietari.formModal.ownerPlaceholder')}
            searchPlaceholder={t('proprietari.formModal.ownerSearchPlaceholder')}
            onSearchChange={setSearch}
            isLoading={isLoadingOwners}
          />
        </div>

        <FormFieldWrapper id="modal-field-email" label={t('proprietari.formModal.emailLabel')} required>
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </FormFieldWrapper>

        <FormModalFooter id="modal-btn-actions" onCancel={() => onOpenChange(false)} />
      </form>
    </ModalRegister>
  )
}

export default OwnerAccessFormModal

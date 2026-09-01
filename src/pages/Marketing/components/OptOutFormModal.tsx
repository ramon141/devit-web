import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePersonControllerFind } from '@/api/generated/api'
import { CommunicationOptOutChannel } from '@/api/generated/models/communicationOptOutChannel'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
import { Input } from '@/components/ui/input'
import SearchableSelect from '@/components/SearchableSelect'
import SelectField from '@/components/SelectField'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { useOptOutActions } from '@/pages/Marketing/hooks/useOptOutActions'

type OptOutFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function OptOutFormModal({ open, onOpenChange }: OptOutFormModalProps) {
  const { t } = useTranslation('marketing')
  const { data: people } = usePersonControllerFind({ filter: { order: ['name ASC'], limit: 200 } })
  const { handleCreate, isCreating } = useOptOutActions()

  const [personId, setPersonId] = useState('')
  const [channel, setChannel] = useState<CommunicationOptOutChannel>(CommunicationOptOutChannel.email)
  const [reason, setReason] = useState('')

  const personOptions = (people ?? []).map((person) => ({ value: person.id ?? '', label: person.name }))
  const channelOptions = Object.values(CommunicationOptOutChannel).map((value) => ({
    value,
    label: t(`templateChannelOptions.${value}`),
  }))

  function reset() {
    setPersonId('')
    setChannel(CommunicationOptOutChannel.email)
    setReason('')
  }

  function onSubmit() {
    if (!personId) return
    handleCreate({ personId, channel, reason: reason || undefined }, () => {
      reset()
      onOpenChange(false)
    })
  }

  return (
    <ModalRegister open={open} onOpenChange={onOpenChange} title={t('optOutFormModal.title')}>
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <SearchableSelect
          label={t('optOutFormModal.personLabel')}
          required
          value={personId}
          onValueChange={setPersonId}
          options={personOptions}
        />

        <FormFieldWrapper label={t('optOutFormModal.channelLabel')} required>
          <SelectField
            value={channel}
            onValueChange={(value) => setChannel(value as CommunicationOptOutChannel)}
            options={channelOptions}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('optOutFormModal.reasonLabel')}>
          <Input value={reason} onChange={(event) => setReason(event.target.value)} placeholder={t('optOutFormModal.reasonPlaceholder')} />
        </FormFieldWrapper>

        <FormModalFooter onCancel={() => onOpenChange(false)} isSubmitting={isCreating} />
      </form>
    </ModalRegister>
  )
}

export default OptOutFormModal

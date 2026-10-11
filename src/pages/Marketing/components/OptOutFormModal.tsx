import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CommunicationOptOutChannel } from '@/api/generated/models/communicationOptOutChannel'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
import { Input } from '@/components/ui/input'
import SearchableSelect from '@/components/SearchableSelect'
import SelectField from '@/components/SelectField'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { usePersonSearchOptions } from '@/hooks/usePersonSearchOptions'
import { useOptOutActions } from '@/pages/Marketing/hooks/useOptOutActions'

type OptOutFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function OptOutFormModal({ open, onOpenChange }: OptOutFormModalProps) {
  const { t } = useTranslation('marketing')
  const { handleCreate, isCreating } = useOptOutActions()

  const [personId, setPersonId] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { options: personOptions, isLoading: isLoadingPeople, setSearch } =
    usePersonSearchOptions(personId)
  const [channel, setChannel] = useState<CommunicationOptOutChannel>(CommunicationOptOutChannel.email)
  const [reason, setReason] = useState('')

  const channelOptions = Object.values(CommunicationOptOutChannel).map((value) => ({
    value,
    label: t(`templateChannelOptions.${value}`),
  }))

  function reset() {
    setPersonId('')
    setSubmitted(false)
    setChannel(CommunicationOptOutChannel.email)
    setReason('')
  }

  function onSubmit() {
    setSubmitted(true)
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
          onSearchChange={setSearch}
          isLoading={isLoadingPeople}
          error={submitted && !personId ? t('optOutFormModal.personRequired') : undefined}
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

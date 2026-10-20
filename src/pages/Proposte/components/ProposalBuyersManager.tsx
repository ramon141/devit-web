import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import SearchableSelect from '@/components/SearchableSelect'
import { usePersonSearchOptions } from '@/hooks/usePersonSearchOptions'
import RemovableRow from '@/components/RemovableRow'
import { useProposalBuyers } from '@/pages/Proposte/hooks/useProposalBuyers'

type ProposalBuyersManagerProps = {
  proposalId: string
}

// Acquirenti adicionais além do buyerId principal — vínculo M2M purchase_proposal_buyers.
function ProposalBuyersManager({ proposalId }: ProposalBuyersManagerProps) {
  const { t } = useTranslation('proposte')
  const { buyers, addBuyer, removeBuyer } = useProposalBuyers(proposalId)
  const [personId, setPersonId] = useState('')
  const { options, isLoading, setSearch } = usePersonSearchOptions(personId)

  const takenIds = new Set(buyers.map((buyer) => buyer.personId))
  const personOptions = options.filter((option) => !takenIds.has(option.value))

  function handleAdd() {
    if (!personId) return
    addBuyer(personId)
    setPersonId('')
  }

  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium">{t('buyersManager.title')}</p>

      {buyers.map((buyer) => (
        <RemovableRow key={buyer.id} onRemove={() => buyer.id && removeBuyer(buyer.id)}>
          <span className="text-sm">{buyer.person?.name ?? buyer.personId}</span>
        </RemovableRow>
      ))}

      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-52 flex-1">
          <SearchableSelect
            value={personId}
            onValueChange={setPersonId}
            options={personOptions}
            isLoading={isLoading}
            onSearchChange={setSearch}
            placeholder={t('buyersManager.buyerPlaceholder')}
            searchPlaceholder={t('propertyBuyerFields.buyerSearchPlaceholder')}
          />
        </div>
        <Button type="button" onClick={handleAdd}>
          {t('buyersManager.add')}
        </Button>
      </div>
    </div>
  )
}

export default ProposalBuyersManager

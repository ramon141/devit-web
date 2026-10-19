import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import MultiSelectField from '@/components/MultiSelectField'
import { Button } from '@/components/ui/button'
import CheckboxListPicker from '@/pages/Marketing/components/CheckboxListPicker'
import { useRecipientGroup } from '@/pages/Marketing/hooks/useRecipientGroup'
import type { GroupKind } from '@/pages/Marketing/utils/leadGroup'
import { useNeighborhoodOptions } from '@/hooks/useNeighborhoodOptions'
import { normalizeText } from '@/utils/normalizeText'

type RecipientGroupDialogProps = {
  kind: GroupKind
  open: boolean
  onOpenChange: (open: boolean) => void
  isEmail: boolean
  optedOutPersonIds: string[]
  onConfirm: (leadIds: string[]) => void
}

function RecipientGroupDialog({
  kind,
  open,
  onOpenChange,
  isEmail,
  optedOutPersonIds,
  onConfirm,
}: RecipientGroupDialogProps) {
  const { t } = useTranslation('marketing')
  const neighborhoodOptions = useNeighborhoodOptions()
  const group = useRecipientGroup({ kind, open, isEmail, optedOutPersonIds })
  const { partition } = group

  const streetOptions = group.streetOptions.map((street) => ({ value: street, label: street }))
  const nameTerm = normalizeText(group.nameSearch)

  const items = partition.eligible
    .filter((candidate) => normalizeText(candidate.name).includes(nameTerm))
    .map((candidate) => ({
      id: candidate.id,
      label: candidate.name,
      sublabel: (isEmail ? candidate.email : candidate.phone) ?? undefined,
    }))

  const excluded = partition.optedOut + partition.withoutContact

  function handleConfirm() {
    onConfirm(group.selectedIds)
    group.reset()
    onOpenChange(false)
  }

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={t(`leadGroup.${kind}.title`)}
      description={t('leadGroup.description')}
    >
      <div className="grid gap-4">
        <MultiSelectField
          options={neighborhoodOptions}
          values={group.neighborhoodIds}
          onChange={group.setNeighborhoodIds}
          label={t('leadGroup.neighborhoods')}
          placeholder={t('leadGroup.neighborhoodsPlaceholder')}
        />

        <MultiSelectField
          options={streetOptions}
          values={group.streets}
          onChange={group.setStreets}
          label={t('leadGroup.street')}
          placeholder={t('leadGroup.streetPlaceholder')}
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium">
            {t(`leadGroup.${kind}.count`, {
              selected: group.selectedIds.length,
              total: partition.eligible.length,
            })}
          </p>

          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={group.selectAll}>
              {t('leadGroup.selectAll')}
            </Button>

            <Button type="button" variant="outline" size="sm" onClick={group.clearAll}>
              {t('leadGroup.clearAll')}
            </Button>
          </div>
        </div>

        <CheckboxListPicker
          items={items}
          selectedIds={group.selectedIds}
          onToggle={group.toggle}
          search={group.nameSearch}
          onSearchChange={group.setNameSearch}
          searchPlaceholder={t(`leadGroup.${kind}.search`)}
          emptyMessage={group.isLoading ? t('leadGroup.loading') : t(`leadGroup.${kind}.empty`)}
        />

        {excluded > 0 && (
          <p className="text-xs text-muted-foreground">
            {t('leadGroup.excluded', {
              count: excluded,
              optedOut: partition.optedOut,
              withoutContact: partition.withoutContact,
            })}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('leadGroup.cancel')}
          </Button>

          <Button type="button" disabled={group.selectedIds.length === 0} onClick={handleConfirm}>
            {t('leadGroup.confirm', { count: group.selectedIds.length })}
          </Button>
        </div>
      </div>
    </ModalRegister>
  )
}

export default RecipientGroupDialog

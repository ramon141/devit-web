import { useTranslation } from 'react-i18next'
import ListToolbar from '@/components/ListToolbar'
import ExportMenu from '@/components/ExportMenu'
import SelectField from '@/components/SelectField'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import TablePagination from '@/components/TablePagination'
import JoyrideWrapper from '@/components/JoyrideWrapper'
import TourFab from '@/components/TourFab'
import type { PersonWithRelations } from '@/api/generated/models'
import { usePersonList } from '@/pages/Clientes/hooks/usePersonList'
import { getPersonRoleOptions } from '@/pages/Clientes/schemas/personSchema'
import { useEditModalState } from '@/hooks/useEditModalState'
import { useClientiTour, MODAL_TOUR_START_STEP } from '@/pages/Clientes/hooks/useClientiTour'
import { useTourModalSync } from '@/hooks/useTourModalSync'
import PersonTable from '@/pages/Clientes/components/PersonTable'
import PersonFormModal from '@/pages/Clientes/components/PersonFormModal'

function Anagrafica() {
  const { t } = useTranslation('clientes')
  const {
    people,
    where,
    isLoading,
    totalItems,
    pageSize,
    page,
    setPage,
    search,
    onSearchChange,
    roleFilter,
    setRoleFilter,
  } = usePersonList()
  const { open, setOpen, editing, openNew, openEdit } = useEditModalState<PersonWithRelations>()
  const { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour, stopTour } =
    useClientiTour()

  useTourModalSync({
    run,
    stepIndex,
    modalStartStep: MODAL_TOUR_START_STEP,
    isOpen: open,
    openModal: openNew,
    closeModal: () => setOpen(false),
    steps,
  })

  function handleModalOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen && run) stopTour()
  }

  return (
    <div>
      <JoyrideWrapper
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        tourKey={tourKey}
        onEvent={handleJoyrideCallback}
      />
      <TourFab onClick={startTour} />

      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={t('anagrafica.searchPlaceholder')}
        onNewClick={openNew}
        newLabel={t('anagrafica.newLabel')}
        searchWrapperId="clienti-search-filter"
        newButtonId="clienti-new-btn"
        actions={<ExportMenu path="/people/export" params={{ filter: { where } }} />}
        filters={
          <div className="w-full sm:w-48">
            <FormFieldWrapper id="clienti-role-filter" label={t('anagrafica.roleFilterLabel')}>
              <SelectField
                value={roleFilter}
                onValueChange={setRoleFilter}
                options={getPersonRoleOptions(t)}
                placeholder={t('anagrafica.roleFilterAll')}
              />
            </FormFieldWrapper>
          </div>
        }
      />

      <PersonTable people={people} isLoading={isLoading} onEdit={openEdit} />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />

      <PersonFormModal open={open} onOpenChange={handleModalOpenChange} person={editing} />
    </div>
  )
}

export default Anagrafica

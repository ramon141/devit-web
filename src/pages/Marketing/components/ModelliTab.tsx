import { useTranslation } from 'react-i18next'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import type { CommunicationTemplate } from '@/api/generated/models'
import { useTemplateList } from '@/pages/Marketing/hooks/useTemplateList'
import { useEditModalState } from '@/hooks/useEditModalState'
import TemplateTable from '@/pages/Marketing/components/TemplateTable'
import TemplateFormModal from '@/pages/Marketing/components/TemplateFormModal'

// Sub-aba MODELLI: CRUD de modelos de comunicação. CATEGORIE/TESTI não viram
// telas próprias — categoria já é um campo do modelo (decisão do W3-F4).
function ModelliTab() {
  const { t } = useTranslation('marketing')
  const { templates, isLoading, totalItems, pageSize, page, setPage, search, onSearchChange } =
    useTemplateList()
  const { open, setOpen, editing, openNew, openEdit } = useEditModalState<CommunicationTemplate>()

  return (
    <div>
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={t('modelliTab.searchPlaceholder')}
        onNewClick={openNew}
        newLabel={t('modelliTab.newLabel')}
      />

      <TemplateTable templates={templates} isLoading={isLoading} onEdit={openEdit} />

      <TablePagination page={page} pageSize={pageSize} totalItems={totalItems} onPageChange={setPage} />

      <TemplateFormModal open={open} onOpenChange={setOpen} template={editing} />
    </div>
  )
}

export default ModelliTab

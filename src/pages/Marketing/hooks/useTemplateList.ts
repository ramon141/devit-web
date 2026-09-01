import {
  useCommunicationTemplateControllerCount,
  useCommunicationTemplateControllerFind,
} from '@/api/generated/api'
import { useListPagination } from '@/hooks/useListPagination'

export function useTemplateList() {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } =
    useListPagination()

  const where = debouncedSearch ? { name: { ilike: `%${debouncedSearch}%` } } : undefined

  const { data: templates, isLoading } = useCommunicationTemplateControllerFind({
    filter: { where, order: ['name ASC'], limit: pageSize, skip },
  })

  const { data: countResult } = useCommunicationTemplateControllerCount({ where })

  return {
    templates: templates ?? [],
    isLoading,
    totalItems: countResult?.count ?? 0,
    pageSize,
    page,
    setPage,
    search,
    onSearchChange,
  }
}

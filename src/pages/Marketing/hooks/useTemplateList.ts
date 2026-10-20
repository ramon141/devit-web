import { KEEP_PREVIOUS_DATA } from '@/constants/queryOptions'
import {
  useCommunicationTemplateControllerCount,
  useCommunicationTemplateControllerFind,
} from '@/api/generated/api'
import { useListPagination } from '@/hooks/useListPagination'
import { toLikePattern } from '@/utils/toLikePattern'

export function useTemplateList() {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } =
    useListPagination()

  const where = debouncedSearch ? { name: { ilike: toLikePattern(debouncedSearch) } } : undefined

  const { data: templates, isLoading } = useCommunicationTemplateControllerFind({
    filter: { where, order: ['name ASC'], limit: pageSize, skip },
  }, KEEP_PREVIOUS_DATA)

  const { data: countResult } = useCommunicationTemplateControllerCount({ where }, KEEP_PREVIOUS_DATA)

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

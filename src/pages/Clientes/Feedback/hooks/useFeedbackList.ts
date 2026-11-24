import { useState } from 'react'
import {
  useClientFeedbackControllerCount,
  useClientFeedbackControllerFind,
} from '@/api/generated/api'
import { KEEP_PREVIOUS_DATA } from '@/constants/queryOptions'
import { useListPagination } from '@/hooks/useListPagination'
import { toLikePattern } from '@/utils/toLikePattern'

type UseFeedbackListProps = {
  // Na ficha do cliente a lista já vem presa a um cliente
  personId?: string
}

export function useFeedbackList({ personId }: UseFeedbackListProps = {}) {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } =
    useListPagination()
  const [typeFilter, setTypeFilterState] = useState('')
  const [propertyFilter, setPropertyFilterState] = useState('')
  const [leadFilter, setLeadFilterState] = useState('')

  function resetPageAnd(setter: (value: string) => void) {
    return (value: string) => {
      setter(value)
      setPage(1)
    }
  }

  const conditions: Record<string, unknown>[] = []

  if (personId) conditions.push({ personId })
  if (typeFilter) conditions.push({ type: typeFilter })
  if (propertyFilter) conditions.push({ propertyId: propertyFilter })
  if (leadFilter) conditions.push({ leadId: leadFilter })

  if (debouncedSearch) {
    conditions.push({ content: { ilike: toLikePattern(debouncedSearch) } })
  }

  const where =
    conditions.length === 0 ? undefined : conditions.length === 1 ? conditions[0] : { and: conditions }

  const { data: feedbacks, isLoading } = useClientFeedbackControllerFind(
    {
      filter: {
        where,
        order: ['createdAt DESC'],
        limit: pageSize,
        skip,
        include: [{ relation: 'person' }, { relation: 'property' }, { relation: 'createdBy' }],
      },
    },
    KEEP_PREVIOUS_DATA,
  )

  const { data: countResult } = useClientFeedbackControllerCount({ where }, KEEP_PREVIOUS_DATA)

  return {
    feedbacks: feedbacks ?? [],
    isLoading,
    totalItems: countResult?.count ?? 0,
    pageSize,
    page,
    setPage,
    search,
    onSearchChange,
    typeFilter,
    setTypeFilter: resetPageAnd(setTypeFilterState),
    propertyFilter,
    setPropertyFilter: resetPageAnd(setPropertyFilterState),
    leadFilter,
    setLeadFilter: resetPageAnd(setLeadFilterState),
  }
}

import { KEEP_PREVIOUS_DATA } from '@/constants/queryOptions'
import { useState } from 'react'
import { usePersonControllerCount, usePersonControllerFind } from '@/api/generated/api'
import { useListPagination } from '@/hooks/useListPagination'
import { toLikePattern } from '@/utils/toLikePattern'

export function usePersonList() {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } =
    useListPagination()
  const [roleFilter, setRoleFilterState] = useState('')

  function setRoleFilter(value: string) {
    setRoleFilterState(value)
    setPage(1)
  }

  const conditions: Record<string, unknown>[] = []

  if (debouncedSearch) {
    conditions.push({ name: { ilike: toLikePattern(debouncedSearch) } })
  }

  if (roleFilter) {
    conditions.push({ role: roleFilter })
  }

  const where =
    conditions.length === 0 ? undefined : conditions.length === 1 ? conditions[0] : { and: conditions }

  const { data: people, isLoading } = usePersonControllerFind({
    filter: {
      where,
      order: ['createdAt DESC'],
      limit: pageSize,
      skip,
      include: [{ relation: 'address' }],
    },
  }, KEEP_PREVIOUS_DATA)

  const { data: countResult } = usePersonControllerCount({ where }, KEEP_PREVIOUS_DATA)

  return {
    people: people ?? [],
    where,
    isLoading,
    totalItems: countResult?.count ?? 0,
    pageSize,
    page,
    setPage,
    search,
    onSearchChange,
    roleFilter,
    setRoleFilter,
  }
}

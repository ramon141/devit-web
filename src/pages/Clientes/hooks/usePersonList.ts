import { useState } from 'react'
import { usePersonControllerCount, usePersonControllerFind } from '@/api/generated/api'
import { useListPagination } from '@/hooks/useListPagination'

export function usePersonList() {
  const { search, debouncedSearch, page, setPage, pageSize, skip, onSearchChange } =
    useListPagination()
  const [roleFilter, setRoleFilter] = useState('')

  const conditions: Record<string, unknown>[] = []

  if (debouncedSearch) {
    conditions.push({ name: { ilike: `%${debouncedSearch}%` } })
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
  })

  const { data: countResult } = usePersonControllerCount({ where })

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

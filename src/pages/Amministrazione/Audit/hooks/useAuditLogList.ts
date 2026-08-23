import { useState } from 'react'
import { useAuditLogControllerCount, useAuditLogControllerFind } from '@/api/generated/api'
import { AUDIT_PAGE_SIZE as PAGE_SIZE } from '@/constants/pagination'

export function useAuditLogList() {
  const [page, setPage] = useState(1)

  const { data: logs, isLoading } = useAuditLogControllerFind({
    filter: {
      order: ['createdAt DESC'],
      limit: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    },
  })

  const { data: countResult } = useAuditLogControllerCount({})

  return {
    logs: logs ?? [],
    isLoading,
    totalItems: countResult?.count ?? 0,
    pageSize: PAGE_SIZE,
    page,
    setPage,
  }
}

import { useState } from 'react'
import dayjs from 'dayjs'
import { useCalendarEventControllerFind } from '@/api/generated/api'
import { CalendarEventType } from '@/api/generated/models'
import { UserInfo } from '@/auth'

const VISIBLE_USER_IDS_KEY = 'agenda.visibleUserIds'

function loadVisibleUserIds(): string[] {
  try {
    const stored = localStorage.getItem(VISIBLE_USER_IDS_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    // localStorage indisponível — mantém só em memória
  }

  const currentUserId = UserInfo.getUserId()
  return currentUserId ? [currentUserId] : []
}

function saveVisibleUserIds(ids: string[]) {
  try {
    localStorage.setItem(VISIBLE_USER_IDS_KEY, JSON.stringify(ids))
  } catch {
    // localStorage indisponível — segue sem persistir
  }
}

type DateRange = {
  start: string
  end: string
}

export type CalendarEventFilters = {
  type: string
  onlyCalls: boolean
  search: string
  visibleUserIds: string[]
}

export const emptyCalendarEventFilters: CalendarEventFilters = {
  type: '',
  onlyCalls: false,
  search: '',
  visibleUserIds: [],
}

const CALL_TYPES = [CalendarEventType.call_scheduled, CalendarEventType.call_completed]

const defaultRange: DateRange = {
  start: dayjs().startOf('month').toISOString(),
  end: dayjs().endOf('month').toISOString(),
}

function buildWhere(range: DateRange, filters: CalendarEventFilters) {
  const conditions: Record<string, unknown>[] = [
    { startAt: { between: [range.start, range.end] } },
  ]

  if (filters.onlyCalls) {
    conditions.push({ type: { inq: CALL_TYPES } })
  } else if (filters.type) {
    conditions.push({ type: filters.type })
  }

  if (filters.search) {
    conditions.push({ title: { ilike: `%${filters.search}%` } })
  }

  if (filters.visibleUserIds.length) {
    conditions.push({ createdById: { inq: filters.visibleUserIds } })
  }

  return { and: conditions }
}

export function useCalendarEventList() {
  const [range, setRange] = useState<DateRange>(defaultRange)
  const [filters, setFiltersState] = useState<CalendarEventFilters>({
    ...emptyCalendarEventFilters,
    visibleUserIds: loadVisibleUserIds(),
  })

  function setFilters(next: CalendarEventFilters) {
    if (next.visibleUserIds !== filters.visibleUserIds) {
      saveVisibleUserIds(next.visibleUserIds)
    }
    setFiltersState(next)
  }

  const { data: events, isLoading } = useCalendarEventControllerFind({
    filter: {
      where: buildWhere(range, filters),
      order: ['startAt ASC'],
      include: ['lead', 'owner', 'createdBy'],
    },
  })

  return {
    events: events ?? [],
    isLoading,
    setRange,
    filters,
    setFilters,
  }
}

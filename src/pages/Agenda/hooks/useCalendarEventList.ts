import { useState } from 'react'
import dayjs from 'dayjs'
import { useCalendarEventControllerFind } from '@/api/generated/api'

type DateRange = {
  start: string
  end: string
}

const defaultRange: DateRange = {
  start: dayjs().startOf('month').toISOString(),
  end: dayjs().endOf('month').toISOString(),
}

export function useCalendarEventList() {
  const [range, setRange] = useState<DateRange>(defaultRange)

  const { data: events, isLoading } = useCalendarEventControllerFind({
    filter: {
      where: {
        startAt: { between: [range.start, range.end] },
      },
      order: ['startAt ASC'],
      include: ['lead', 'owner', 'createdBy'],
    },
  })

  return {
    events: events ?? [],
    isLoading,
    setRange,
  }
}

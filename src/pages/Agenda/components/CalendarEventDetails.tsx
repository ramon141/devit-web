import { formatPropertyBroker } from '@/utils/formatBroker'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import type { CalendarEventWithRelations } from '@/api/generated/models'
import { useCalendarEventPropertyControllerFind } from '@/api/generated/api'
import { getEventOriginOptions, getEventTypeOptions } from '@/pages/Agenda/schemas/calendarEventSchema'
import { getEventColor } from '@/pages/Agenda/utils/eventColors'
import dayjs from 'dayjs'
import { formatDate, formatDateTime } from '@/utils/formatDate'
import { getOptionLabel } from '@/utils/getOptionLabel'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'

type CalendarEventDetailsProps = {
  event: CalendarEventWithRelations
}

const linkClass =
  'font-medium text-foreground underline decoration-primary decoration-2 underline-offset-4 hover:bg-accent'

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function CalendarEventDetails({ event }: CalendarEventDetailsProps) {
  const { t } = useTranslation('agenda')
  const eventTypeOptions = getEventTypeOptions(t)
  const originLabel = event.origin ? getOptionLabel(getEventOriginOptions(t), event.origin) : ''
  const ownerName = event.owner?.name ?? event.createdBy?.fullName ?? ''

  const { data: links } = useCalendarEventPropertyControllerFind(
    {
      filter: {
        where: { calendarEventId: event.id ?? '' },
        include: [{ relation: 'property', scope: { include: [{ relation: 'responsibleBroker' }] } }],
      },
    },
    { query: { enabled: !!event.id } }
  )

  return (
    <div className="grid w-full gap-3">
      <div className="flex items-start justify-between gap-3">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-foreground"
          style={{ backgroundColor: `color-mix(in srgb, ${getEventColor(event)} 18%, white)` }}
        >
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: getEventColor(event) }}
          />

          {getOptionLabel(eventTypeOptions, event.type)}
        </span>

        {ownerName && (
          <div className="flex items-center gap-2">
            <Avatar className="size-9">
              <AvatarFallback>{getInitials(ownerName)}</AvatarFallback>
            </Avatar>

            <span className="text-sm leading-tight">{ownerName}</span>
          </div>
        )}
      </div>

      <p className="text-base font-semibold">
        {t('agenda:hoverCard.timeRange', {
          date: formatDate(event.startAt),
          start: dayjs(event.startAt).format('HH:mm'),
          end: dayjs(event.endAt).format('HH:mm'),
        })}
      </p>

      {event.place && <p className="text-sm text-muted-foreground">{event.place}</p>}

      <Separator />

      <p className="text-sm">
        <span className="text-muted-foreground">{t('agenda:hoverCard.clientLabel')}</span>{' '}
        {event.lead?.id ? (
          <Link
            to={`${CRM_BASE_PATH}/clienti/${event.lead.id}`}
            className={linkClass}
          >
            {event.lead.externalId ? `${event.lead.externalId} - ` : ''}
            {event.lead.name}
          </Link>
        ) : (
          '—'
        )}
      </p>

      {originLabel && (
        <p className="text-sm">
          <span className="text-muted-foreground">{t('agenda:formFields.origin')}:</span> {originLabel}
        </p>
      )}

      <Separator />

      <div className="grid gap-1 text-sm">
        <span className="text-muted-foreground">{t('agenda:hoverCard.propertiesLabel')}</span>

        {(links ?? []).length === 0 && <span className="text-muted-foreground">—</span>}

        {(links ?? []).map((link) => (
          <Link
            key={link.id}
            to={`${CRM_BASE_PATH}/proprieta/${link.propertyId}`}
            className={linkClass}
          >
            {t('agenda:hoverCard.refLabel')} {link.property?.code} - {link.property?.title} ·{' '}
            {formatPropertyBroker(link.property)}
          </Link>
        ))}
      </div>

      <Separator />

      <p className="text-right text-xs text-muted-foreground">
        <span className="font-semibold">{t('agenda:hoverCard.createdByLabel')}</span>{' '}
        {event.createdBy?.fullName ?? '—'} {t('agenda:hoverCard.createdAtConnector')}{' '}
        {formatDateTime(event.createdAt)}
      </p>

      {event.description ? (
        <div className="rounded-md border bg-muted/40 p-3 text-sm whitespace-pre-wrap">
          {event.description}
        </div>
      ) : (
        <p className="text-sm italic text-muted-foreground">
          {t('agenda:hoverCard.noDescription')}
        </p>
      )}
    </div>
  )
}

export default CalendarEventDetails

import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import DashboardCard from '@/pages/Home/components/DashboardCard'
import {
  getConfirmationStatusOptions,
  getEventTypeOptions,
} from '@/pages/Agenda/schemas/calendarEventSchema'
import { getOptionLabel } from '@/utils/getOptionLabel'
import { CalendarEventConfirmationStatus } from '@/api/generated/models'
import type { LeadsReportControllerTodayAppointments200Item } from '@/api/generated/models'

type TodayAppointmentsCardProps = {
  appointments: LeadsReportControllerTodayAppointments200Item[]
}

function TodayAppointmentsCard({ appointments }: TodayAppointmentsCardProps) {
  const { t } = useTranslation('home')
  const { t: tAgenda } = useTranslation('agenda')
  const typeOptions = getEventTypeOptions(tAgenda)
  const confirmationOptions = getConfirmationStatusOptions(tAgenda)

  return (
    <DashboardCard title={t('todayAppointmentsCard.title')} count={appointments.length}>
      {appointments.length === 0 && (
        <p className="text-sm text-muted-foreground">{t('todayAppointmentsCard.empty')}</p>
      )}

      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="rounded-lg px-2 py-2 hover:bg-accent hover:text-accent-foreground"
        >
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-primary">
              {appointment.startAt && dayjs(appointment.startAt).format('HH:mm')}
            </span>

            <p className="truncate text-sm font-medium">
              {appointment.place ?? appointment.title}
            </p>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            {appointment.confirmationStatus && (
              <Badge
                variant={
                  appointment.confirmationStatus === CalendarEventConfirmationStatus.confirmed
                    ? 'default'
                    : 'secondary'
                }
              >
                {getOptionLabel(confirmationOptions, appointment.confirmationStatus)}
              </Badge>
            )}

            <span className="text-xs text-muted-foreground">
              {appointment.endAt && `${dayjs(appointment.endAt).format('HH:mm')} · `}
              {t('todayAppointmentsCard.type', {
                type: getOptionLabel(typeOptions, appointment.type),
              })}
            </span>
          </div>

          {appointment.personName && (
            <p className="truncate text-xs text-muted-foreground">
              {[appointment.personName, appointment.personPhone].filter(Boolean).join(' ')}
            </p>
          )}

          {appointment.propertyCodes && appointment.propertyCodes.length > 0 && (
            <p className="truncate text-xs text-muted-foreground">
              {t('todayAppointmentsCard.propertyCodes', {
                codes: appointment.propertyCodes.join(', '),
              })}
            </p>
          )}
        </div>
      ))}
    </DashboardCard>
  )
}

export default TodayAppointmentsCard

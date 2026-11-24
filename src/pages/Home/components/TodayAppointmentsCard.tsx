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
  isLoading?: boolean
}

function TodayAppointmentsCard({ appointments, isLoading }: TodayAppointmentsCardProps) {
  const { t } = useTranslation('home')
  const { t: tAgenda } = useTranslation('agenda')
  const typeOptions = getEventTypeOptions(tAgenda)
  const confirmationOptions = getConfirmationStatusOptions(tAgenda)

  return (
    <DashboardCard
      title={t('todayAppointmentsCard.title')}
      count={appointments.length}
      isLoading={isLoading}
    >
      {appointments.length === 0 && (
        <p className="text-sm text-muted-foreground">{t('todayAppointmentsCard.empty')}</p>
      )}

      <div className="flex flex-col gap-2">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex gap-3 rounded-lg border border-l-4 border-l-primary bg-card p-3 transition-colors hover:bg-accent/40"
          >
            <div className="flex w-14 shrink-0 flex-col items-start">
              <span className="text-lg font-semibold leading-tight text-foreground">
                {appointment.startAt && dayjs(appointment.startAt).format('HH:mm')}
              </span>

              {appointment.endAt && (
                <span className="text-xs text-muted-foreground">
                  {`– ${dayjs(appointment.endAt).format('HH:mm')}`}
                </span>
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-sm font-medium">
                  {appointment.place ?? appointment.title}
                </p>

                {appointment.confirmationStatus && (
                  <Badge
                    variant={
                      appointment.confirmationStatus === CalendarEventConfirmationStatus.confirmed
                        ? 'default'
                        : 'secondary'
                    }
                    className="shrink-0"
                  >
                    {getOptionLabel(confirmationOptions, appointment.confirmationStatus)}
                  </Badge>
                )}
              </div>

              <p className="truncate text-xs text-muted-foreground">
                {t('todayAppointmentsCard.type', {
                  type: getOptionLabel(typeOptions, appointment.type),
                })}
              </p>

              {appointment.personName && (
                <p className="truncate text-xs text-muted-foreground">
                  {[appointment.personName, appointment.personPhone].filter(Boolean).join(' · ')}
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
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}

export default TodayAppointmentsCard

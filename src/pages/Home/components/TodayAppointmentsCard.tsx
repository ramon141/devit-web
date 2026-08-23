import dayjs from 'dayjs'
import DashboardCard from '@/pages/Home/components/DashboardCard'
import type { LeadsReportControllerTodayAppointments200Item } from '@/api/generated/models'

type TodayAppointmentsCardProps = {
  appointments: LeadsReportControllerTodayAppointments200Item[]
}

function TodayAppointmentsCard({ appointments }: TodayAppointmentsCardProps) {
  return (
    <DashboardCard title="Impegni di oggi" count={appointments.length}>
      {appointments.length === 0 && (
        <p className="text-sm text-muted-foreground">Nessun risultato.</p>
      )}

      {appointments.map((appointment) => (
        <div key={appointment.id} className="rounded-lg px-2 py-1.5 hover:bg-muted/50">
          <p className="truncate text-sm font-medium">{appointment.title}</p>
          <p className="text-xs text-muted-foreground">
            {appointment.startAt && dayjs(appointment.startAt).format('HH:mm')}
            {appointment.endAt && ` - ${dayjs(appointment.endAt).format('HH:mm')}`}
            {appointment.type && ` · ${appointment.type}`}
          </p>
        </div>
      ))}
    </DashboardCard>
  )
}

export default TodayAppointmentsCard

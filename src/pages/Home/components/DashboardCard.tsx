import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type DashboardCardProps = {
  title: string
  count?: number
  children: ReactNode
}

// Card padrão da Bacheca: título + contador + lista de itens
function DashboardCard({ title, count, children }: DashboardCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>

        {count !== undefined && (
          <CardAction>
            <Badge className="h-7 min-w-7 rounded-full bg-accent px-1.5 text-accent-foreground">
              {count}
            </Badge>
          </CardAction>
        )}
      </CardHeader>

      {/* grid-cols-1 = minmax(0,1fr): impede texto longo de esticar o card */}
      <CardContent className="grid grid-cols-1 gap-1">{children}</CardContent>
    </Card>
  )
}

export default DashboardCard

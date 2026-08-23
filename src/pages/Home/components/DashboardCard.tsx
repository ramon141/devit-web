import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type DashboardCardProps = {
  title: string
  count?: number
  children: ReactNode
}

// Card padrão da Bacheca: título + contador + lista de itens
function DashboardCard({ title, count, children }: DashboardCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {count !== undefined && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
            {count}
          </span>
        )}
      </CardHeader>
      <CardContent className="grid gap-2">{children}</CardContent>
    </Card>
  )
}

export default DashboardCard

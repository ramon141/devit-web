import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const SKELETON_ITEMS = 4

type DashboardCardProps = {
  title: string
  count?: number
  isLoading?: boolean
  children: ReactNode
}

// Itens de carregamento da lista do card
function DashboardCardSkeleton() {
  return (
    <>
      {Array.from({ length: SKELETON_ITEMS }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4 py-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </>
  )
}

// Card padrão da Bacheca: título + contador + lista de itens
function DashboardCard({ title, count, isLoading = false, children }: DashboardCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>

        {!isLoading && count !== undefined && (
          <CardAction>
            <Badge className="h-7 min-w-7 rounded-full bg-accent px-1.5 text-accent-foreground">
              {count}
            </Badge>
          </CardAction>
        )}
      </CardHeader>

      {/* grid-cols-1 = minmax(0,1fr): impede texto longo de esticar o card; max-h + overflow limita listas grandes */}
      <CardContent className="grid max-h-[420px] grid-cols-1 gap-1 overflow-y-auto">
        {isLoading ? <DashboardCardSkeleton /> : children}
      </CardContent>
    </Card>
  )
}

export default DashboardCard

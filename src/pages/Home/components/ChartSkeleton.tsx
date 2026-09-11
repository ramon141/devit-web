import { Skeleton } from '@/components/ui/skeleton'

type ChartSkeletonProps = {
  size?: number
  count?: number
}

// Placeholder circular usado enquanto os gráficos (donut/gauge) carregam
function ChartSkeleton({ size = 220, count = 1 }: ChartSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          className="rounded-full"
          style={{ width: size, height: size }}
        />
      ))}
    </>
  )
}

export default ChartSkeleton

import { LockIcon } from 'lucide-react'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

type StepperStep = {
  value: string
  label: string
  step: number
  locked?: boolean
}

type StepperProps = {
  steps: StepperStep[]
}

function Stepper({ steps }: StepperProps) {
  return (
    <TabsList className="relative !h-auto w-full items-start justify-between gap-1 bg-transparent p-0 mb-6">
      <div className="absolute top-4 right-4 left-4 h-0.5 bg-border" />

      {steps.map((step) => (
        <TabsTrigger
          key={step.value}
          value={step.value}
          disabled={step.locked}
          className="group relative z-10 h-auto flex-1 flex-col gap-1.5 border-0 bg-transparent p-0 after:hidden data-active:bg-transparent data-active:ring-0"
        >
          <span
            className={cn(
              'flex size-8 items-center justify-center rounded-full border-2 border-border bg-card text-sm font-semibold text-muted-foreground transition-colors',
              'group-data-active:border-primary group-data-active:bg-primary group-data-active:text-primary-foreground'
            )}
          >
            {step.locked ? <LockIcon className="size-3.5" /> : step.step}
          </span>
          <span className="text-center text-[11px] leading-tight font-medium whitespace-normal text-muted-foreground group-data-active:text-foreground">
            {step.label}
          </span>
        </TabsTrigger>
      ))}
    </TabsList>
  )
}

export default Stepper
export type { StepperStep }

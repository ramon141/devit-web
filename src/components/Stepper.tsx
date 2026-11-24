import { LockIcon, type LucideIcon } from 'lucide-react'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

type StepperStep = {
  value: string
  label: string
  step: number
  icon?: LucideIcon
  locked?: boolean
}

type StepperProps = {
  steps: StepperStep[]
}

function renderStepContent(step: StepperStep) {
  if (step.locked) return <LockIcon className="size-3.5" />

  if (step.icon) {
    const Icon = step.icon

    return <Icon className="size-4" />
  }

  return step.step
}

function Stepper({ steps }: StepperProps) {
  return (
    <TabsList className="relative !h-auto w-full shrink-0 items-start justify-between gap-1 bg-transparent p-0 mb-6">
      <div
        className="absolute top-4 h-0.5 bg-border"
        style={{
          left: `${50 / steps.length}%`,
          right: `${50 / steps.length}%`,
        }}
      />

      {steps.map((step) => (
        <TabsTrigger
          key={step.value}
          id={`stepper-tab-${step.value}`}
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
            {renderStepContent(step)}
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

import { useTranslation } from 'react-i18next'
import { CheckCircle2Icon, CircleIcon, LockIcon, SaveIcon, XIcon, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { RequiredField } from '@/pages/Imoveis/hooks/usePropertyRequiredFields'

type SidebarSection = {
  value: string
  label: string
  icon: LucideIcon
  locked?: boolean
}

type PropertySectionsSidebarProps = {
  sections: SidebarSection[]
  activeValue: string
  requiredFields: RequiredField[]
  isSubmitting: boolean
  onSelect: (value: string) => void
  onFocusField: (field: RequiredField) => void
  onCancel: () => void
  onSave: () => void
}

type SectionItemProps = {
  section: SidebarSection
  isActive: boolean
  fields: RequiredField[]
  onSelect: (value: string) => void
}

function SectionItem({ section, isActive, fields, onSelect }: SectionItemProps) {
  const { t } = useTranslation('imoveis')
  const Icon = section.icon
  const done = fields.filter((field) => field.done).length
  const isComplete = fields.length > 0 && done === fields.length

  return (
    <button
      id={`stepper-tab-${section.value}`}
      type="button"
      disabled={section.locked}
      aria-current={isActive ? 'true' : undefined}
      onClick={() => onSelect(section.value)}
      className={cn(
        'flex shrink-0 items-start gap-2 rounded-lg border-l-[3px]',
        'border-transparent px-2.5 py-2 text-left text-sm',
        'whitespace-nowrap text-foreground transition-colors',
        'hover:bg-accent disabled:pointer-events-none disabled:opacity-50',
        isActive && 'border-primary bg-accent font-semibold'
      )}
    >
      {isComplete ? (
        <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-green-600" />
      ) : (
        <Icon className="mt-0.5 size-4 shrink-0" />
      )}

      <span className="flex flex-1 flex-col">
        {section.label}
        {fields.length > 0 && (
          <span className={cn('text-xs font-normal', isComplete ? 'text-green-600' : 'text-muted-foreground')}>
            {isComplete
              ? t('formFields.sectionComplete')
              : t('formFields.sectionProgress', { done, total: fields.length })}
          </span>
        )}
      </span>

      {section.locked && <LockIcon className="mt-0.5 size-3.5" />}
    </button>
  )
}

type ProgressProps = {
  fields: RequiredField[]
  onFocusField: (field: RequiredField) => void
}

function RequiredProgress({ fields, onFocusField }: ProgressProps) {
  const { t } = useTranslation('imoveis')
  const done = fields.filter((field) => field.done).length
  const isComplete = done === fields.length
  const percent = fields.length ? (done / fields.length) * 100 : 0

  return (
    <div className="grid gap-1.5 border-t border-border pt-3">
      <div className="flex justify-between text-sm">
        <span>{t('formFields.requiredFields')}</span>
        <span className={cn('font-bold', isComplete && 'text-green-600')}>
          {done}/{fields.length}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full rounded-full', isComplete ? 'bg-green-600' : 'bg-primary')}
          style={{ width: `${percent}%` }}
        />
      </div>

      {fields.filter((field) => !field.done).map((field) => (
        <button
          key={field.field}
          type="button"
          onClick={() => onFocusField(field)}
          className="flex items-center gap-2 rounded-md px-1 py-1 text-left text-[13px] hover:bg-accent"
        >
          <CircleIcon className="size-4 shrink-0 text-amber-500" />
          {field.label}
        </button>
      ))}
    </div>
  )
}

// Menu lateral: seções com andamento, campos obrigatórios pendentes e botões de salvar/cancelar
function PropertySectionsSidebar(props: PropertySectionsSidebarProps) {
  const { t } = useTranslation('imoveis')
  const { sections, activeValue, requiredFields, isSubmitting } = props

  return (
    <aside
      className={cn(
        'order-first flex shrink-0 flex-col gap-3 lg:order-last lg:w-72',
        'lg:max-h-full lg:self-start lg:overflow-y-auto lg:rounded-xl',
        'lg:border lg:border-border lg:bg-card lg:p-3'
      )}
    >
      <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        <span className="hidden px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase lg:block">
          {t('formFields.sectionsTitle')}
        </span>

        <p className="hidden px-1 pb-1 text-xs text-muted-foreground lg:block">
          {t('formFields.sectionsHint')}
        </p>

        {sections.map((section) => (
          <SectionItem
            key={section.value}
            section={section}
            isActive={section.value === activeValue}
            fields={requiredFields.filter((field) => field.stepValue === section.value)}
            onSelect={props.onSelect}
          />
        ))}
      </nav>

      <div className="grid gap-3">
        <div className="hidden lg:block">
          <RequiredProgress fields={requiredFields} onFocusField={props.onFocusField} />
        </div>

        <div id="property-sidebar-actions" className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={props.onCancel}>
            <XIcon data-icon="inline-start" />
            {t('formFields.cancel')}
          </Button>

          <Button type="button" disabled={isSubmitting} onClick={props.onSave}>
            <SaveIcon data-icon="inline-start" />
            {t('formFields.finish')}
          </Button>
        </div>
      </div>
    </aside>
  )
}

export default PropertySectionsSidebar

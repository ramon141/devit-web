import HeaderActions from '@/components/layout/HeaderActions'
import SessionInfo from '@/components/layout/SessionInfo'

type DesktopHeaderProps = {
  title: string
  description?: string
}

function DesktopHeader({ title, description }: DesktopHeaderProps) {
  return (
    <div className="mt-4 mr-4 mb-4 hidden h-16 shrink-0 items-center gap-3 rounded-xl bg-card px-4 ring-1 ring-border lg:flex">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold text-foreground">
          {title}
        </h1>
        {description && (
          <p className="truncate text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <SessionInfo className="text-right" />
      <HeaderActions className="flex items-center gap-1" />
    </div>
  )
}

export default DesktopHeader

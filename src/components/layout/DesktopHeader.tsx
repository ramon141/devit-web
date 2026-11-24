import GlobalSearch from '@/components/layout/GlobalSearch'
import HeaderActions from '@/components/layout/HeaderActions'
import SessionInfo from '@/components/layout/SessionInfo'

type DesktopHeaderProps = {
  title: string
  description?: string
}

function DesktopHeader({ title, description }: DesktopHeaderProps) {
  return (
    <div className="mt-4 mb-4 hidden h-16 shrink-0 items-center gap-3 rounded-xl bg-card px-4 ring-1 ring-border lg:flex">
      <div id="page-section-title" className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold text-foreground">
          {title}
        </h1>
        {description && (
          <p className="truncate text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <div className="flex flex-1 justify-center px-2">
        <GlobalSearch />
      </div>

      <SessionInfo className="text-right" />
      <HeaderActions hideSearch className="flex items-center gap-1" />
    </div>
  )
}

export default DesktopHeader

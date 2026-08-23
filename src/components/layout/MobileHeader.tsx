import devitFavicon from '@/assets/logos/devit-favicon.png'
import HeaderActions from '@/components/layout/HeaderActions'
import SessionInfo from '@/components/layout/SessionInfo'

type MobileHeaderProps = {
  title: string
}

function MobileHeader({ title }: MobileHeaderProps) {
  return (
    <header
      className="flex items-center justify-between gap-3 bg-sidebar px-4 lg:hidden"
      style={{
        height: 'calc(56px + env(safe-area-inset-top))',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <div className="flex min-w-0 items-center gap-2">
        <img src={devitFavicon} alt="Devit" className="size-8 rounded-lg" />
        <span className="truncate text-sm font-semibold text-sidebar-foreground">
          {title}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <HeaderActions className="flex items-center text-sidebar-foreground [&_button]:text-sidebar-foreground [&_button:hover]:bg-sidebar-accent [&_button:hover]:text-sidebar-accent-foreground" />
        <SessionInfo avatarOnly />
      </div>
    </header>
  )
}

export default MobileHeader

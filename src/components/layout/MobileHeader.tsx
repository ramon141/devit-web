import { Bell, CircleUser } from 'lucide-react'
import devitFavicon from '@/assets/logos/devit-favicon.png'
import { Button } from '@/components/ui/button'

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

      <div className="flex shrink-0 items-center">
        <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <Bell />
          <span className="sr-only">Notifiche</span>
        </Button>

        <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <CircleUser />
          <span className="sr-only">Account</span>
        </Button>
      </div>
    </header>
  )
}

export default MobileHeader

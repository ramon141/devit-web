import { Bell, CircleUser } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

      <Button variant="ghost" size="icon">
        <Bell />
        <span className="sr-only">Notifiche</span>
      </Button>

      <Button variant="ghost" size="icon">
        <CircleUser />
        <span className="sr-only">Account</span>
      </Button>
    </div>
  )
}

export default DesktopHeader

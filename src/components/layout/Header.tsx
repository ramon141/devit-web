import { Bell, CircleUser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MobileNav from '@/components/layout/MobileNav'

type HeaderProps = {
  title: string
  description?: string
}

function Header({ title, description }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background px-4 lg:px-6">
      <MobileNav />

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
    </header>
  )
}

export default Header

import { useState } from 'react'
import { Menu } from 'lucide-react'
import devitLogo from '@/assets/logos/devit-logo.png'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import SidebarNav from '@/components/layout/SidebarNav'

function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu />
            <span className="sr-only">Apri menu</span>
          </Button>
        }
      />

      <SheetContent
        side="left"
        className="w-72 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
      >
        <SheetHeader className="h-16 justify-center border-b border-sidebar-border">
          <SheetTitle className="flex items-center">
            <img src={devitLogo} alt="Devit" className="h-8 w-auto" />
          </SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <SidebarNav onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav

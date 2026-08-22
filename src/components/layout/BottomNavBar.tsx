import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { NavLink, useLocation } from 'react-router'
import { cn } from '@/lib/utils'
import { navItems } from '@/components/layout/nav-items'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const MAX_MAIN_ITEMS = 4

function BottomNavBar() {
  const location = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)

  const mainItems = navItems.slice(0, MAX_MAIN_ITEMS)
  const moreItems = navItems.slice(MAX_MAIN_ITEMS)
  const hasMore = moreItems.length > 0
  const isMoreActive = moreItems.some((item) => item.path === location.pathname)

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-background lg:hidden"
        style={{
          height: 64,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {mainItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-2 text-[0.65rem] font-medium',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )
            }
          >
            <item.icon className="size-5" />
            {item.label}
          </NavLink>
        ))}

        {hasMore && (
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 py-2 text-[0.65rem] font-medium',
              isMoreActive ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <MoreHorizontal className="size-5" />
            Altro
          </button>
        )}
      </nav>

      {hasMore && (
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetContent side="bottom" className="rounded-t-2xl pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <SheetHeader>
              <SheetTitle>Altro</SheetTitle>
            </SheetHeader>

            <div className="grid gap-1 px-4 pb-2">
              {moreItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMoreOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                      isActive
                        ? 'bg-accent text-primary'
                        : 'text-foreground hover:bg-muted'
                    )
                  }
                >
                  <item.icon className="size-4.5" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}

export default BottomNavBar

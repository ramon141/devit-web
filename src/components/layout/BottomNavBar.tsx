import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { NavLink, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { getNavItems, type NavItem } from '@/components/layout/nav-items'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'
import { BOTTOM_NAV_MAX_MAIN_ITEMS } from '@/constants/ui'

function itemPath(item: NavItem) {
  return item.children?.[0]?.path ?? item.path
}

function BottomNavBar() {
  const { t } = useTranslation('common')
  const location = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)

  const items = getNavItems()
  const mainItems = items.slice(0, BOTTOM_NAV_MAX_MAIN_ITEMS)
  const moreItems = items.slice(BOTTOM_NAV_MAX_MAIN_ITEMS)
  const hasMore = moreItems.length > 0
  const isMoreActive = moreItems.some((item) => location.pathname.startsWith(itemPath(item)))

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
            to={itemPath(item)}
            end={itemPath(item) === CRM_BASE_PATH}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-2 text-[0.65rem] font-medium',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )
            }
          >
            <item.icon className="size-5" />
            {t(item.label)}
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
            {t('sidebar.more')}
          </button>
        )}
      </nav>

      {hasMore && (
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetContent side="bottom" className="rounded-t-2xl pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <SheetHeader>
              <SheetTitle>{t('sidebar.more')}</SheetTitle>
            </SheetHeader>

            <div className="grid gap-1 px-4 pb-2">
              {moreItems.map((item) => (
                <div key={item.path} className="grid gap-1">
                  <NavLink
                    to={itemPath(item)}
                    onClick={() => setMoreOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                        isActive
                          ? 'bg-accent text-primary'
                          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                      )
                    }
                  >
                    <item.icon className="size-4.5" />
                    {t(item.label)}
                  </NavLink>

                  {item.children?.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      end
                      onClick={() => setMoreOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'ml-8 rounded-lg px-3 py-1.5 text-sm',
                          isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                        )
                      }
                    >
                      {t(child.label)}
                    </NavLink>
                  ))}
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}

export default BottomNavBar

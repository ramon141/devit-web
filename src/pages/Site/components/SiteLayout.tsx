import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { to: '/site', label: 'Home' },
  { to: '/site/affitto', label: 'Proprietà in Affitto' },
  { to: '/site/vendita', label: 'Proprietà in Vendita' },
  { to: '/site/chi-siamo', label: 'Chi Siamo' },
  { to: '/site/richieste', label: 'Richieste' },
  { to: '/site/contatti', label: 'Contatti' },
  { to: '/site/news', label: 'News' },
]

const COOKIE_CONSENT_KEY = 'site_cookie_consent'

function SiteHeader() {
  const location = useLocation()

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link to="/site" className="text-xl font-bold tracking-tight">
          Devit
        </Link>

        <nav className="flex flex-wrap items-center gap-4 text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'text-muted-foreground transition-colors hover:text-foreground',
                location.pathname === link.to && 'font-semibold text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-4">
        <div className="flex gap-3 text-sm text-muted-foreground">
          <a href="https://www.facebook.com">Facebook</a>
          <a href="https://www.instagram.com">Instagram</a>
          <a href="https://www.youtube.com">YouTube</a>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <Link to="/site/richieste">Richieste</Link>
          <Link to="/site/contatti">Contatti</Link>
          <Link to="/site/news">News</Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <Link to="/site/chi-siamo">Chi Siamo</Link>
          <Link to="/site/vendita">Proprietà in vendita</Link>
          <Link to="/site/affitto">Proprietà in affitto</Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold">Info Legali</span>
          <Link to="/site/privacy-cookies">Uso dei Cookies</Link>
          <Link to="/site/privacy-cookies">Privacy Policy</Link>
        </div>
      </div>

      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        © Devit Servizi immobiliari S.n.c. - IT07609021212 —{' '}
        <Link to="/site/privacy-cookies">Privacy e Cookies</Link>
      </div>
    </footer>
  )
}

// ponytail: banner só grava a escolha, sem central de preferências por categoria de cookie
function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(!localStorage.getItem(COOKIE_CONSENT_KEY))
  }, [])

  function choose(value: string) {
    localStorage.setItem(COOKIE_CONSENT_KEY, value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-4 shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">Diamo valore alla tua privacy</p>
          <p className="text-sm text-muted-foreground">
            Utilizziamo i cookie per migliorare la tua esperienza sul sito.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => choose('customized')}>
            Personalizza
          </Button>
          <Button variant="outline" size="sm" onClick={() => choose('rejected')}>
            Rifiuta tutto
          </Button>
          <Button size="sm" onClick={() => choose('accepted')}>
            Accettare tutto
          </Button>
        </div>
      </div>
    </div>
  )
}

function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <Outlet />
      </main>

      <SiteFooter />
      <CookieBanner />
    </div>
  )
}

export default SiteLayout

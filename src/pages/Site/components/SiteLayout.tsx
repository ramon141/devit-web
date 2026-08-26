import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import devitLogo from '@/assets/logos/devit-logo.png'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/affitto', label: 'Proprietà in Affitto' },
  { to: '/vendita', label: 'Proprietà in Vendita' },
  { to: '/chi-siamo', label: 'Chi Siamo' },
  { to: '/richieste', label: 'Richieste' },
  { to: '/contatti', label: 'Contatti' },
  { to: '/news', label: 'News' },
]

const COOKIE_CONSENT_KEY = 'site_cookie_consent'

// Icone social minimali: lucide-react 1.x non include più i loghi dei brand
function SocialIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d={path} />
    </svg>
  )
}

const FACEBOOK_PATH =
  'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12'
const INSTAGRAM_PATH =
  'M12 2c2.7 0 3.1 0 4.1.1 1.1 0 1.8.2 2.4.5.6.2 1.1.6 1.6 1.1.5.5.8 1 1.1 1.6.3.6.4 1.3.5 2.4 0 1 .1 1.4.1 4.1s0 3.1-.1 4.1c0 1.1-.2 1.8-.5 2.4-.2.6-.6 1.1-1.1 1.6-.5.5-1 .8-1.6 1.1-.6.3-1.3.4-2.4.5-1 0-1.4.1-4.1.1s-3.1 0-4.1-.1c-1.1 0-1.8-.2-2.4-.5-.6-.2-1.1-.6-1.6-1.1-.5-.5-.8-1-1.1-1.6-.3-.6-.4-1.3-.5-2.4C2 15.1 2 14.7 2 12s0-3.1.1-4.1c0-1.1.2-1.8.5-2.4.2-.6.6-1.1 1.1-1.6.5-.5 1-.8 1.6-1.1.6-.3 1.3-.4 2.4-.5C8.9 2 9.3 2 12 2m0 1.8c-2.7 0-3 0-4 .1-.9 0-1.4.2-1.7.3-.4.2-.7.3-1 .6-.3.3-.5.6-.6 1-.1.3-.3.8-.3 1.7-.1 1-.1 1.3-.1 4s0 3 .1 4c0 .9.2 1.4.3 1.7.2.4.3.7.6 1 .3.3.6.5 1 .6.3.1.8.3 1.7.3 1 .1 1.3.1 4 .1s3 0 4-.1c.9 0 1.4-.2 1.7-.3.4-.2.7-.3 1-.6.3-.3.5-.6.6-1 .1-.3.3-.8.3-1.7.1-1 .1-1.3.1-4s0-3-.1-4c0-.9-.2-1.4-.3-1.7-.2-.4-.3-.7-.6-1-.3-.3-.6-.5-1-.6-.3-.1-.8-.3-1.7-.3-1-.1-1.3-.1-4-.1M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4m5.2-3.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4'
const YOUTUBE_PATH =
  'M21.6 7.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.9 4 12 4 12 4h0s-3.9 0-6.7.2c-.4 0-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2.2 9 2.2 10.8v1.4c0 1.8.2 3.6.2 3.6s.2 1.5.8 2.1c.8.8 1.9.8 2.3.9 1.7.2 7.3.2 7.5.2s3.9 0 6.7-.3c.4 0 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.8.2-3.6v-1.4c0-1.8-.2-3.6-.2-3.6M9.9 15.1V8.9l6 3.1z'

function SiteHeader() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3">
        <Link to="/" className="shrink-0">
          <img src={devitLogo} alt="Devit Immobiliare" className="h-9 w-auto" />
        </Link>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'border-b-2 border-transparent pb-0.5 text-foreground/70 transition-colors hover:border-primary hover:text-foreground',
                location.pathname === link.to && 'border-primary font-semibold text-foreground'
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
    <footer className="bg-[var(--devit-navy-dark)] text-neutral-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-4">
        <div className="flex gap-3">
          <a href="https://www.facebook.com" aria-label="Facebook" className="text-primary hover:opacity-80">
            <SocialIcon path={FACEBOOK_PATH} />
          </a>
          <a href="https://www.instagram.com" aria-label="Instagram" className="text-primary hover:opacity-80">
            <SocialIcon path={INSTAGRAM_PATH} />
          </a>
          <a href="https://www.youtube.com" aria-label="YouTube" className="text-primary hover:opacity-80">
            <SocialIcon path={YOUTUBE_PATH} />
          </a>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <Link to="/richieste" className="hover:text-primary">Richieste</Link>
          <Link to="/contatti" className="hover:text-primary">Contatti</Link>
          <Link to="/news" className="hover:text-primary">News</Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <Link to="/chi-siamo" className="hover:text-primary">Chi Siamo</Link>
          <Link to="/vendita" className="hover:text-primary">Proprietà in vendita</Link>
          <Link to="/affitto" className="hover:text-primary">Proprietà in affitto</Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-semibold text-white">Info Legali</span>
          <Link to="/privacy-cookies" className="hover:text-primary">Uso dei Cookies</Link>
          <Link to="/privacy-cookies" className="hover:text-primary">Privacy Policy</Link>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-neutral-400">
        © Devit Servizi immobiliari S.n.c. - IT07609021212 —{' '}
        <Link to="/privacy-cookies" className="hover:text-primary">Privacy e Cookies</Link>
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
    <div className="flex min-h-screen flex-col bg-background">
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

import { Fragment } from 'react'
import { Link } from 'react-router'
import { useSiteDict } from '@/lib/site/dict'

type Crumb = { label: string; to?: string }

// Percurso de navegação: o último item (sem `to`) é a página atual
function Breadcrumb({ items, dark = false }: { items: Crumb[]; dark?: boolean }) {
  const { dict } = useSiteDict()
  const tone = dark ? 'text-site-cream/70' : 'text-site-muted'
  const hover = dark ? 'hover:text-site-accent' : 'hover:text-site-ink'

  return (
    <nav
      aria-label={dict.common.breadcrumb}
      className={`mb-6 font-site-mono text-[0.7rem] uppercase tracking-[0.14em] ${tone}`}
    >
      {items.map((item, index) => (
        <Fragment key={item.label}>
          {index > 0 && <span className="px-2">/</span>}
          {item.to ? (
            <Link to={item.to} className={hover}>
              {item.label}
            </Link>
          ) : (
            <span className={dark ? '' : 'text-site-ink'}>{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumb

import { useState } from 'react'
import { Link } from 'react-router'
import { BuildingIcon, SearchIcon, UserIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { useGlobalSearchControllerSearch } from '@/api/generated/api'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'
import { LEAD_ID_SEARCH_PARAM } from '@/constants/notifications'

const MIN_CHARS = 2
const DEBOUNCE_MS = 250
const API_URL = import.meta.env.VITE_APP_BASE_API_URL

type ResultLinkProps = {
  to: string
  title: string
  subtitle?: string
  photoId?: string | null
  isProperty?: boolean
  onClick: () => void
}

function ResultLink({ to, title, subtitle, photoId, isProperty, onClick }: ResultLinkProps) {
  const Icon = isProperty ? BuildingIcon : UserIcon

  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-3 rounded-md p-2 hover:bg-muted">
      {isProperty && photoId ? (
        <img
          src={`${API_URL}/public/attachments/${photoId}`}
          alt=""
          className="size-12 shrink-0 rounded-md object-cover"
        />
      ) : (
        <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-muted">
          <Icon className="size-5 text-muted-foreground" />
        </span>
      )}

      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">{title}</span>
        {subtitle && <span className="block truncate text-xs text-muted-foreground">{subtitle}</span>}
      </span>
    </Link>
  )
}

// Busca global: mostra resultados enquanto digita, sem precisar de ENTER
function GlobalSearch() {
  const { t } = useTranslation('common')
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const query = useDebouncedValue(text.trim(), DEBOUNCE_MS)
  const enabled = query.length >= MIN_CHARS
  const { data } = useGlobalSearchControllerSearch({ q: query }, { query: { enabled } })

  const properties = enabled ? (data?.properties ?? []) : []
  const people = enabled ? (data?.people ?? []) : []
  const leads = enabled ? (data?.leads ?? []) : []
  const isEmpty = enabled && data && !properties.length && !people.length && !leads.length

  function close() {
    setOpen(false)
    setText('')
  }

  return (
    <div id="global-search" className="relative w-64" onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}>
      <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={text}
        onChange={(event) => setText(event.target.value)}
        onFocus={() => setOpen(true)}
        placeholder={t('globalSearch.placeholder')}
        className="pl-9"
      />

      {open && enabled && (
        <div className="absolute top-full right-0 z-50 mt-1 max-h-[70vh] w-96 max-w-[90vw] overflow-y-auto rounded-xl bg-card p-2 shadow-lg ring-1 ring-border">
          {properties.map((p) => (
            <ResultLink
              key={p.id}
              isProperty
              photoId={p.coverAttachmentId}
              to={`${CRM_BASE_PATH}/proprieta/${p.id}`}
              title={`${p.code}${p.title ? ` · ${p.title}` : ''}`}
              subtitle={[p.street, p.city].filter(Boolean).join(', ')}
              onClick={close}
            />
          ))}

          {people.map((p) => (
            <ResultLink
              key={p.id}
              to={`${CRM_BASE_PATH}/clienti/${p.id}`}
              title={p.name}
              subtitle={[p.phone, p.email].filter(Boolean).join(' · ')}
              onClick={close}
            />
          ))}

          {leads.map((l) => (
            <ResultLink
              key={l.id}
              to={`${CRM_BASE_PATH}/clienti/richieste?${LEAD_ID_SEARCH_PARAM}=${l.id}`}
              title={`${l.name} · ${t('globalSearch.lead')}`}
              subtitle={[l.phone, l.email].filter(Boolean).join(' · ')}
              onClick={close}
            />
          ))}

          {isEmpty && <p className="p-3 text-sm text-muted-foreground">{t('globalSearch.empty')}</p>}
        </div>
      )}
    </div>
  )
}

export default GlobalSearch

import { useTranslation } from 'react-i18next'
import { keepPreviousData } from '@tanstack/react-query'
import { useGlobalSearchControllerSearch } from '@/api/generated/api'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import PropertyThumb from '@/components/layout/PropertyThumb'
import { useGlobalSearchNav, type NavOption } from '@/components/layout/useGlobalSearchNav'
import type { SearchGroup, SearchRow } from '@/components/layout/searchTypes'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'
import { LEAD_ID_SEARCH_PARAM } from '@/constants/notifications'

const MIN_CHARS = 2
const DEBOUNCE_MS = 120
const CACHE_MS = 30_000
// Monta os grupos exibidos no modal: atalhos do menu (e recentes) + resultados do servidor
export function useGlobalSearchGroups(open: boolean, text: string, onNavigate: (path: string) => void) {
  const { t } = useTranslation('common')
  const { options, recents, pushRecent } = useGlobalSearchNav()
  const term = text.trim().toLowerCase()
  const query = useDebouncedValue(text.trim(), DEBOUNCE_MS)
  const enabled = open && query.length >= MIN_CHARS && term.length >= MIN_CHARS
  const { data, isFetching } = useGlobalSearchControllerSearch({ q: query }, {
    // mantém os resultados anteriores até chegar o novo e reaproveita buscas repetidas
    query: { enabled, placeholderData: keepPreviousData, staleTime: CACHE_MS },
  })

  function navRow(option: NavOption, prefix: string): SearchRow {
    const Icon = option.icon

    return {
      id: `${prefix}-${option.path}`,
      label: t(option.labelKey),
      chip: option.parentKey ? t(option.parentKey) : undefined,
      icon: <Icon className="size-6" />,
      onSelect: () => {
        pushRecent(option.path)
        onNavigate(option.path)
      },
    }
  }

  const navMatches = options.filter((o) => t(o.labelKey).toLowerCase().includes(term))
  const groups: SearchGroup[] = []

  if (!term) {
    groups.push({ key: 'recents', title: t('globalSearch.groupRecents'), items: recents.map((o) => navRow(o, 'recent')) })
  }

  groups.push({ key: 'nav', title: t('globalSearch.groupNav'), items: navMatches.map((o) => navRow(o, 'nav')) })

  if (enabled && data) {
    groups.push(
      {
        key: 'properties',
        title: t('globalSearch.groupProperties'),
        items: (data.properties ?? []).map((p) => ({
          id: `property-${p.id}`,
          label: `${p.code}${p.title ? ` · ${p.title}` : ''}`,
          sublabel: [p.street, p.city].filter(Boolean).join(', '),
          chip: t('globalSearch.chipProperty'),
          icon: <PropertyThumb photoId={p.coverAttachmentId} />,
          onSelect: () => onNavigate(`${CRM_BASE_PATH}/proprieta/${p.id}`),
        })),
      },
      {
        key: 'people',
        title: t('globalSearch.groupPeople'),
        items: (data.people ?? []).map((p) => ({
          id: `person-${p.id}`,
          label: p.name,
          sublabel: [p.phone, p.email].filter(Boolean).join(' · '),
          chip: t('globalSearch.chipPerson'),
          onSelect: () => onNavigate(`${CRM_BASE_PATH}/clienti/${p.id}`),
        })),
      },
      {
        key: 'leads',
        title: t('globalSearch.groupLeads'),
        items: (data.leads ?? []).map((l) => ({
          id: `lead-${l.id}`,
          label: l.name,
          sublabel: [l.phone, l.email].filter(Boolean).join(' · '),
          chip: t('globalSearch.lead'),
          onSelect: () => onNavigate(`${CRM_BASE_PATH}/clienti/richieste?${LEAD_ID_SEARCH_PARAM}=${l.id}`),
        })),
      }
    )
  }

  const isLoading = enabled && isFetching
  const isEmpty = Boolean(term) && !isLoading && groups.every((g) => !g.items.length)

  return { groups, term, isLoading, isEmpty }
}

import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Building2,
  CalendarDays,
  FileText,
  Handshake,
  LayoutDashboard,
  Megaphone,
  ShieldCheck,
  Settings,
  Users,
} from 'lucide-react'
import { Auth } from '@/auth'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'

export type NavChild = {
  label: string
  path: string
}

export type NavItem = {
  label: string
  path: string
  icon: LucideIcon
  adminOnly?: boolean
  children?: NavChild[]
}

function crmPath(path: string): string {
  return path === '/' ? CRM_BASE_PATH : `${CRM_BASE_PATH}${path}`
}

// Os "label" abaixo são chaves i18n (namespace 'common'), traduzidas no render
// pelos componentes de sidebar/bottom nav, não texto exibido diretamente
const allNavItems: NavItem[] = [
  {
    label: 'sidebar.nav.bacheca',
    path: crmPath('/'),
    icon: LayoutDashboard,
  },
  {
    label: 'sidebar.nav.agenda',
    path: crmPath('/agenda'),
    icon: CalendarDays,
  },
  {
    label: 'sidebar.nav.proprieta',
    path: crmPath('/proprieta'),
    icon: Building2,
  },
  {
    label: 'sidebar.nav.clienti',
    path: crmPath('/clienti'),
    icon: Users,
    children: [
      { label: 'sidebar.nav.clienti', path: crmPath('/clienti') },
      { label: 'sidebar.nav.richieste', path: crmPath('/clienti/richieste') },
    ],
  },
  {
    label: 'sidebar.nav.proposte',
    path: crmPath('/proposte'),
    icon: FileText,
  },
  {
    label: 'sidebar.nav.operazioni',
    path: crmPath('/operazioni'),
    icon: Handshake,
    children: [
      { label: 'sidebar.nav.vendite', path: crmPath('/operazioni/vendite') },
      { label: 'sidebar.nav.locazioni', path: crmPath('/operazioni/locazioni') },
      { label: 'sidebar.nav.adeguamentoCanone', path: crmPath('/operazioni/adeguamenti-canone') },
      { label: 'sidebar.nav.scadenziario', path: crmPath('/operazioni/scadenziario') },
      { label: 'sidebar.nav.registrazioni', path: crmPath('/operazioni/registrazioni') },
    ],
  },
  {
    label: 'sidebar.nav.marketing',
    path: crmPath('/marketing'),
    icon: Megaphone,
  },
  {
    label: 'sidebar.nav.statistiche',
    path: crmPath('/statistiche'),
    icon: BarChart3,
  },
  {
    label: 'sidebar.nav.amministrazione',
    path: crmPath('/amministrazione'),
    icon: ShieldCheck,
    adminOnly: true,
    children: [
      { label: 'sidebar.nav.utenti', path: crmPath('/amministrazione/utenti') },
      { label: 'sidebar.nav.filiali', path: crmPath('/amministrazione/filiali') },
      { label: 'sidebar.nav.categorie', path: crmPath('/amministrazione/categorie') },
      { label: 'sidebar.nav.banner', path: crmPath('/amministrazione/banner') },
      { label: 'sidebar.nav.auditLog', path: crmPath('/amministrazione/audit') },
    ],
  },
  {
    label: 'sidebar.nav.componenti',
    path: crmPath('/componenti'),
    icon: Settings,
  },
]

export function getNavItems(): NavItem[] {
  return allNavItems.filter((item) => !item.adminOnly || Auth.isAdmin())
}

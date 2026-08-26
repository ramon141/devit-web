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

const allNavItems: NavItem[] = [
  {
    label: 'Bacheca',
    path: crmPath('/'),
    icon: LayoutDashboard,
  },
  {
    label: 'Agenda',
    path: crmPath('/agenda'),
    icon: CalendarDays,
  },
  {
    label: 'Proprietà',
    path: crmPath('/proprieta'),
    icon: Building2,
  },
  {
    label: 'Clienti',
    path: crmPath('/clienti'),
    icon: Users,
    children: [
      { label: 'Clienti', path: crmPath('/clienti') },
      { label: 'Richieste', path: crmPath('/clienti/richieste') },
    ],
  },
  {
    label: 'Proposte',
    path: crmPath('/proposte'),
    icon: FileText,
  },
  {
    label: 'Operazioni',
    path: crmPath('/operazioni'),
    icon: Handshake,
    children: [
      { label: 'Vendite', path: crmPath('/operazioni/vendite') },
      { label: 'Locazioni', path: crmPath('/operazioni/locazioni') },
      { label: 'Adeguamento canone', path: crmPath('/operazioni/adeguamenti-canone') },
      { label: 'Scadenziario', path: crmPath('/operazioni/scadenziario') },
      { label: 'Registrazioni', path: crmPath('/operazioni/registrazioni') },
    ],
  },
  {
    label: 'Marketing',
    path: crmPath('/marketing'),
    icon: Megaphone,
  },
  {
    label: 'Statistiche',
    path: crmPath('/statistiche'),
    icon: BarChart3,
  },
  {
    label: 'Amministrazione',
    path: crmPath('/amministrazione'),
    icon: ShieldCheck,
    adminOnly: true,
    children: [
      { label: 'Utenti', path: crmPath('/amministrazione/utenti') },
      { label: 'Filiali', path: crmPath('/amministrazione/filiali') },
      { label: 'Categorie', path: crmPath('/amministrazione/categorie') },
      { label: 'Banner', path: crmPath('/amministrazione/banner') },
      { label: 'Log di audit', path: crmPath('/amministrazione/audit') },
    ],
  },
  {
    label: 'Componenti',
    path: crmPath('/componenti'),
    icon: Settings,
  },
]

export function getNavItems(): NavItem[] {
  return allNavItems.filter((item) => !item.adminOnly || Auth.isAdmin())
}

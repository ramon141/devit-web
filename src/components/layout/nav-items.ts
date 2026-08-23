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

const allNavItems: NavItem[] = [
  {
    label: 'Bacheca',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Agenda',
    path: '/agenda',
    icon: CalendarDays,
  },
  {
    label: 'Proprietà',
    path: '/proprieta',
    icon: Building2,
  },
  {
    label: 'Clienti',
    path: '/clienti',
    icon: Users,
    children: [
      { label: 'Clienti', path: '/clienti' },
      { label: 'Richieste', path: '/clienti/richieste' },
    ],
  },
  {
    label: 'Proposte',
    path: '/proposte',
    icon: FileText,
  },
  {
    label: 'Operazioni',
    path: '/operazioni',
    icon: Handshake,
    children: [
      { label: 'Vendite', path: '/operazioni/vendite' },
      { label: 'Locazioni', path: '/operazioni/locazioni' },
    ],
  },
  {
    label: 'Marketing',
    path: '/marketing',
    icon: Megaphone,
  },
  {
    label: 'Statistiche',
    path: '/statistiche',
    icon: BarChart3,
  },
  {
    label: 'Amministrazione',
    path: '/amministrazione',
    icon: ShieldCheck,
    adminOnly: true,
    children: [
      { label: 'Utenti', path: '/amministrazione/utenti' },
      { label: 'Filiali', path: '/amministrazione/filiali' },
      { label: 'Categorie', path: '/amministrazione/categorie' },
      { label: 'Banner', path: '/amministrazione/banner' },
      { label: 'Log di audit', path: '/amministrazione/audit' },
    ],
  },
  {
    label: 'Componenti',
    path: '/componenti',
    icon: Settings,
  },
]

export function getNavItems(): NavItem[] {
  return allNavItems.filter((item) => !item.adminOnly || Auth.isAdmin())
}

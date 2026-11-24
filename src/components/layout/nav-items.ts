import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Building2,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  FileText,
  MessageSquareText,
  Handshake,
  History,
  KeyRound,
  LayoutDashboard,
  MapPin,
  Megaphone,
  Play,
  ShieldCheck,
  Tag,
  TrendingUp,
  UserCog,
  Users,
  UserSearch,
  Layers,
  Store,
} from 'lucide-react'
import { Auth } from '@/auth'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'

export type NavChild = {
  label: string
  path: string
  icon: LucideIcon
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
      { label: 'sidebar.nav.clienti', path: crmPath('/clienti'), icon: Users },
      { label: 'sidebar.nav.richieste', path: crmPath('/clienti/richieste'), icon: ClipboardList },
      { label: 'sidebar.nav.feedback', path: crmPath('/clienti/feedback'), icon: MessageSquareText },
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
      { label: 'sidebar.nav.vendite', path: crmPath('/operazioni/vendite'), icon: Tag },
      { label: 'sidebar.nav.locazioni', path: crmPath('/operazioni/locazioni'), icon: KeyRound },
      { label: 'sidebar.nav.adeguamentoCanone', path: crmPath('/operazioni/adeguamenti-canone'), icon: TrendingUp },
      { label: 'sidebar.nav.scadenziario', path: crmPath('/operazioni/scadenziario'), icon: CalendarClock },
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
      { label: 'sidebar.nav.utenti', path: crmPath('/amministrazione/utenti'), icon: UserCog },
      { label: 'sidebar.nav.filiali', path: crmPath('/amministrazione/filiali'), icon: Store },
      { label: 'sidebar.nav.categorie', path: crmPath('/amministrazione/categorie'), icon: Layers },
      { label: 'sidebar.nav.zone', path: crmPath('/amministrazione/zone'), icon: MapPin },
      { label: 'sidebar.nav.videoHome', path: crmPath('/amministrazione/video-home'), icon: Play },
      { label: 'sidebar.nav.auditLog', path: crmPath('/amministrazione/audit'), icon: History },
      { label: 'sidebar.nav.proprietari', path: crmPath('/amministrazione/proprietari'), icon: UserSearch },
    ],
  },
]

export function getNavItems(): NavItem[] {
  return allNavItems.filter((item) => !item.adminOnly || Auth.isAdmin())
}

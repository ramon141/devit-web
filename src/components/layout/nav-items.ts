import type { LucideIcon } from 'lucide-react'
import {
  Building2,
  LayoutDashboard,
  Newspaper,
  Settings,
  Users,
} from 'lucide-react'

export type NavItem = {
  label: string
  path: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  {
    label: 'Bacheca',
    path: '/',
    icon: LayoutDashboard,
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
  },
  {
    label: 'News',
    path: '/news',
    icon: Newspaper,
  },
  {
    label: 'Componenti',
    path: '/componenti',
    icon: Settings,
  },
]

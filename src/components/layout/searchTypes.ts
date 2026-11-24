import type { ReactNode } from 'react'

export type SearchRow = {
  id: string
  label: string
  sublabel?: string
  chip?: string
  icon?: ReactNode
  onSelect: () => void
}

export type SearchGroup = {
  key: string
  title: string
  items: SearchRow[]
}

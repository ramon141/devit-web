import {
  BuildingIcon,
  FactoryIcon,
  HardHatIcon,
  HomeIcon,
  LandPlotIcon,
  ParkingSquareIcon,
  type LucideIcon,
} from 'lucide-react'
import type { PropertyCategoryKind } from '@/pages/Imoveis/hooks/useCategoryKinds'

export const categoryKindIcons: Record<PropertyCategoryKind, LucideIcon> = {
  residential: HomeIcon,
  commercial: BuildingIcon,
  industrial: FactoryIcon,
  land: LandPlotIcon,
  attachment: ParkingSquareIcon,
  construction_site: HardHatIcon,
}

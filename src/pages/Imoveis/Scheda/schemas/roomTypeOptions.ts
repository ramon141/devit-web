import type { TFunction } from 'i18next'
import { PropertyRoomRoomType } from '@/api/generated/models'

export function getRoomTypeOptions(t: TFunction<'imoveis'>) {
  return [
    { value: PropertyRoomRoomType.kitchen, label: t('options.roomType.kitchen') },
    { value: PropertyRoomRoomType.balcony, label: t('options.roomType.balcony') },
    { value: PropertyRoomRoomType.terrace, label: t('options.roomType.terrace') },
    { value: PropertyRoomRoomType.garden, label: t('options.roomType.garden') },
    { value: PropertyRoomRoomType.land, label: t('options.roomType.land') },
    { value: PropertyRoomRoomType.garage, label: t('options.roomType.garage') },
    { value: PropertyRoomRoomType.covered_parking, label: t('options.roomType.coveredParking') },
    { value: PropertyRoomRoomType.uncovered_parking, label: t('options.roomType.uncoveredParking') },
    { value: PropertyRoomRoomType.motorcycle_spot, label: t('options.roomType.motorcycleSpot') },
    { value: PropertyRoomRoomType.camper_spot, label: t('options.roomType.camperSpot') },
    { value: PropertyRoomRoomType.boat_spot, label: t('options.roomType.boatSpot') },
    { value: PropertyRoomRoomType.cellar, label: t('options.roomType.cellar') },
    { value: PropertyRoomRoomType.warehouse, label: t('options.roomType.warehouse') },
    { value: PropertyRoomRoomType.storage, label: t('options.roomType.storage') },
    { value: PropertyRoomRoomType.attic, label: t('options.roomType.attic') },
    { value: PropertyRoomRoomType.loft, label: t('options.roomType.loft') },
    { value: PropertyRoomRoomType.carriage_house, label: t('options.roomType.carriageHouse') },
    { value: PropertyRoomRoomType.stable, label: t('options.roomType.stable') },
    { value: PropertyRoomRoomType.veranda, label: t('options.roomType.veranda') },
  ]
}

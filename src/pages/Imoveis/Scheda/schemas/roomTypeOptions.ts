import { PropertyRoomRoomType } from '@/api/generated/models'

export const roomTypeOptions = [
  { value: PropertyRoomRoomType.kitchen, label: 'Cucina' },
  { value: PropertyRoomRoomType.balcony, label: 'Balcone' },
  { value: PropertyRoomRoomType.terrace, label: 'Terrazzo' },
  { value: PropertyRoomRoomType.garden, label: 'Giardino' },
  { value: PropertyRoomRoomType.land, label: 'Terreno' },
  { value: PropertyRoomRoomType.garage, label: 'Garage' },
  { value: PropertyRoomRoomType.covered_parking, label: 'Posto auto coperto' },
  { value: PropertyRoomRoomType.uncovered_parking, label: 'Posto auto scoperto' },
  { value: PropertyRoomRoomType.motorcycle_spot, label: 'Posto moto' },
  { value: PropertyRoomRoomType.camper_spot, label: 'Posto camper' },
  { value: PropertyRoomRoomType.boat_spot, label: 'Posto barca' },
  { value: PropertyRoomRoomType.cellar, label: 'Cantina' },
  { value: PropertyRoomRoomType.warehouse, label: 'Deposito' },
  { value: PropertyRoomRoomType.storage, label: 'Ripostiglio' },
  { value: PropertyRoomRoomType.attic, label: 'Soffitta' },
  { value: PropertyRoomRoomType.loft, label: 'Sottotetto' },
  { value: PropertyRoomRoomType.carriage_house, label: 'Rimessa' },
  { value: PropertyRoomRoomType.stable, label: 'Stalla' },
  { value: PropertyRoomRoomType.veranda, label: 'Veranda' },
]

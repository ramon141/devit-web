import type { TFunction } from 'i18next'

export function getLifestyleOptions(t: TFunction<'imoveis'>) {
  return [
    { key: 'student_friendly', label: t('options.features.lifestyle.studentFriendly') },
    { key: 'pets_allowed', label: t('options.features.lifestyle.petsAllowed') },
    { key: 'luxury', label: t('options.features.lifestyle.luxury') },
    { key: 'panoramic', label: t('options.features.lifestyle.panoramic') },
    { key: 'quiet_area', label: t('options.features.lifestyle.quietArea') },
    { key: 'city_center', label: t('options.features.lifestyle.cityCenter') },
  ]
}

export function getAmenityOptions(t: TFunction<'imoveis'>) {
  return [
    { key: 'air_conditioning', label: t('options.features.amenity.airConditioning') },
    { key: 'fireplace', label: t('options.features.amenity.fireplace') },
    { key: 'safe', label: t('options.features.amenity.safe') },
    { key: 'adsl_fastweb', label: t('options.features.amenity.adslFastweb') },
    { key: 'shower', label: t('options.features.amenity.shower') },
    { key: 'video_intercom', label: t('options.features.amenity.videoIntercom') },
    { key: 'aluminum_frames', label: t('options.features.amenity.aluminumFrames') },
    { key: 'wood_frames', label: t('options.features.amenity.woodFrames') },
    { key: 'parquet', label: t('options.features.amenity.parquet') },
    { key: 'blinds', label: t('options.features.amenity.blinds') },
    { key: 'alarm', label: t('options.features.amenity.alarm') },
    { key: 'suspended_toilets', label: t('options.features.amenity.suspendedToilets') },
    { key: 'hydro_tub', label: t('options.features.amenity.hydroTub') },
    { key: 'tv_antenna', label: t('options.features.amenity.tvAntenna') },
    { key: 'cable_tv', label: t('options.features.amenity.cableTv') },
  ]
}

export function getNeighborhoodOptions(t: TFunction<'imoveis'>) {
  return [
    { key: 'kindergarten', label: t('options.features.neighborhood.kindergarten') },
    { key: 'bar', label: t('options.features.neighborhood.bar') },
    { key: 'sports_field', label: t('options.features.neighborhood.sportsField') },
    { key: 'wellness_center', label: t('options.features.neighborhood.wellnessCenter') },
    { key: 'shopping_center', label: t('options.features.neighborhood.shoppingCenter') },
    { key: 'gym', label: t('options.features.neighborhood.gym') },
    { key: 'playground', label: t('options.features.neighborhood.playground') },
    { key: 'bike_path', label: t('options.features.neighborhood.bikePath') },
    { key: 'schools', label: t('options.features.neighborhood.schools') },
    { key: 'train_station', label: t('options.features.neighborhood.trainStation') },
    { key: 'public_transport', label: t('options.features.neighborhood.publicTransport') },
    { key: 'town_hall', label: t('options.features.neighborhood.townHall') },
    { key: 'post_office', label: t('options.features.neighborhood.postOffice') },
  ]
}

export function getIndustrialFeatureOptions(t: TFunction<'imoveis'>) {
  return [
    { key: 'industrial_water', label: t('options.features.industrial.industrialWater') },
    { key: 'fire_alarm', label: t('options.features.industrial.fireAlarm') },
    { key: 'transformer_cabin', label: t('options.features.industrial.transformerCabin') },
    { key: 'loading_docks', label: t('options.features.industrial.loadingDocks') },
    { key: 'freight_elevator', label: t('options.features.industrial.freightElevator') },
    { key: 'fence', label: t('options.features.industrial.fence') },
    { key: 'ramps', label: t('options.features.industrial.ramps') },
  ]
}

export function getLandFeatureOptions(t: TFunction<'imoveis'>) {
  return [
    { key: 'water_conduits', label: t('options.features.land.waterConduits') },
    { key: 'street_frontage', label: t('options.features.land.streetFrontage') },
    { key: 'phone_lines', label: t('options.features.land.phoneLines') },
    { key: 'subdividable', label: t('options.features.land.subdividable') },
    { key: 'electricity', label: t('options.features.land.electricity') },
    { key: 'gas', label: t('options.features.land.gas') },
  ]
}

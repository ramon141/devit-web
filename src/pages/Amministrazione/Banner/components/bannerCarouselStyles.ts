export type BannerPreviewMode = 'desktop' | 'mobile'

// Deslocamento horizontal e redução de escala aplicados a cada card lateral
const SCALE_STEP = 0.12
export const VISIBLE_SIDES = 2
const ADD_CARD_SCALE = 0.74

export const MODE_CONFIG = {
  desktop: {
    offsetX: 190,
    sizeClassName: 'aspect-[16/6] w-[22rem]',
    containerClassName: 'h-72',
  },
  mobile: {
    offsetX: 130,
    sizeClassName: 'aspect-[9/16] w-40',
    containerClassName: 'h-[22rem]',
  },
} as const

export function getCardStyle(distance: number, mode: BannerPreviewMode) {
  const abs = Math.abs(distance)

  return {
    transform: `translateX(calc(-50% + ${distance * MODE_CONFIG[mode].offsetX}px)) scale(${1 - abs * SCALE_STEP})`,
    zIndex: VISIBLE_SIDES - abs,
    opacity: abs > VISIBLE_SIDES ? 0 : 1,
    pointerEvents: abs > VISIBLE_SIDES ? ('none' as const) : ('auto' as const),
  }
}

// Cards "+" logo depois do último banner visível de cada lado
export function getAddCardStyle(distance: number, mode: BannerPreviewMode) {
  return {
    transform: `translateX(calc(-50% + ${distance * MODE_CONFIG[mode].offsetX}px)) scale(${ADD_CARD_SCALE})`,
    zIndex: 0,
  }
}

export type BannerPreviewMode = 'desktop' | 'mobile'

// Deslocamento horizontal e redução de escala aplicados a cada card lateral
const SCALE_STEP = 0.12
const VISIBLE_SIDES = 2
const ADD_CARD_SCALE = 0.74

export const MODE_CONFIG = {
  desktop: { offsetX: 300, sizeClassName: 'aspect-[16/6] w-[28rem]' },
  mobile: { offsetX: 160, sizeClassName: 'aspect-[9/16] w-40' },
} as const

export function getCardStyle(distance: number, mode: BannerPreviewMode) {
  const abs = Math.abs(distance)

  return {
    transform: `translateX(calc(-50% + ${distance * MODE_CONFIG[mode].offsetX}px)) scale(${1 - abs * SCALE_STEP})`,
    zIndex: VISIBLE_SIDES - abs,
    opacity: abs > VISIBLE_SIDES ? 0 : 1 - abs * 0.2,
    pointerEvents: abs > VISIBLE_SIDES ? ('none' as const) : ('auto' as const),
  }
}

// Cards "+" ancorados nas bordas do carrossel, atrás dos banners
export function getAddCardStyle() {
  return {
    transform: `translateY(-50%) scale(${ADD_CARD_SCALE})`,
    zIndex: 0,
  }
}

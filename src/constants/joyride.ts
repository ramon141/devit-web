import type { Options, Styles } from 'react-joyride'
import type { TFunction } from 'i18next'

export const JOYRIDE_ACCENT_COLOR = '#ffcc00'

export const joyrideOptions: Partial<Options> = {
  primaryColor: JOYRIDE_ACCENT_COLOR,
  overlayColor: 'rgba(11, 11, 11, 0.5)',
  textColor: '#0b0b0b',
  backgroundColor: '#ffffff',
  arrowColor: '#ffffff',
  zIndex: 10000,
  showProgress: true,
  buttons: ['back', 'close', 'primary', 'skip'],
  // Sem isso o Joyride mostra um beacon pulsante que exige um clique extra
  // antes de abrir o tooltip do primeiro passo
  skipBeacon: true,
}

export const joyrideStyles: Partial<Styles> = {
  tooltip: {
    borderRadius: 12,
  },
  buttonPrimary: {
    borderRadius: 8,
    color: '#0b0b0b',
  },
  buttonBack: {
    color: JOYRIDE_ACCENT_COLOR,
  },
}

export function getJoyrideLocale(t: TFunction<'common'>) {
  return {
    back: t('tour.locale.back'),
    close: t('tour.locale.close'),
    last: t('tour.locale.last'),
    next: t('tour.locale.next'),
    nextWithProgress: t('tour.locale.nextWithProgress'),
    open: t('tour.locale.open'),
    skip: t('tour.locale.skip'),
  }
}

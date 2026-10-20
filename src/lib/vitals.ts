type MetricName = 'FCP' | 'LCP' | 'CLS' | 'INP' | 'TTFB' | 'JS_ERROR'

type Metric = {
  name: MetricName
  value: number
  detail?: string
  path: string
}

type LayoutShiftEntry = PerformanceEntry & { value: number; hadRecentInput: boolean }
type EventTimingEntry = PerformanceEntry & { interactionId?: number }

const METRICS_URL = import.meta.env.VITE_APP_METRICS_URL

function report(name: MetricName, value: number, detail?: string) {
  const metric: Metric = {
    name,
    value: Math.round(value * 1000) / 1000,
    detail,
    path: location.pathname,
  }

  if (!METRICS_URL) {
    if (import.meta.env.DEV) console.log(JSON.stringify(metric))
    return
  }

  const body = JSON.stringify(metric)

  if (!navigator.sendBeacon(METRICS_URL, new Blob([body], { type: 'application/json' }))) {
    fetch(METRICS_URL, { method: 'POST', body, keepalive: true }).catch(() => undefined)
  }
}

function observe(type: string, onEntries: (entries: PerformanceEntry[]) => void) {
  try {
    const observer = new PerformanceObserver((list) => onEntries(list.getEntries()))

    observer.observe({ type, buffered: true })
  } catch {
    // navegador sem suporte a este tipo de métrica
  }
}

function observeLcpAndCls(flushers: Array<() => void>) {
  let lcp = 0
  let cls = 0

  observe('largest-contentful-paint', (entries) => {
    lcp = entries[entries.length - 1]?.startTime ?? lcp
  })

  observe('layout-shift', (entries) => {
    ;(entries as LayoutShiftEntry[]).forEach((entry) => {
      if (!entry.hadRecentInput) cls += entry.value
    })
  })

  flushers.push(() => {
    if (lcp) report('LCP', lcp)
    report('CLS', cls)
  })
}

function observeInp(flushers: Array<() => void>) {
  let worst = 0

  observe('event', (entries) => {
    ;(entries as EventTimingEntry[]).forEach((entry) => {
      if (entry.interactionId) worst = Math.max(worst, entry.duration)
    })
  })

  flushers.push(() => {
    if (worst) report('INP', worst)
  })
}

// Mede o desempenho real de quem usa (tempo de carga, estabilidade, resposta) e
// os erros de JavaScript; LCP, CLS e INP são enviados quando a aba é escondida
export function initVitals() {
  const flushers: Array<() => void> = []

  observe('paint', (entries) => {
    entries
      .filter((entry) => entry.name === 'first-contentful-paint')
      .forEach((entry) => report('FCP', entry.startTime))
  })

  observe('navigation', (entries) => {
    entries.forEach((entry) => report('TTFB', (entry as PerformanceNavigationTiming).responseStart))
  })

  observeLcpAndCls(flushers)
  observeInp(flushers)

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushers.forEach((flush) => flush())
  })

  window.addEventListener('error', (event) => report('JS_ERROR', 1, event.message))
  window.addEventListener('unhandledrejection', (event) => report('JS_ERROR', 1, String(event.reason)))
}

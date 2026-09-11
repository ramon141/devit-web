import L from 'leaflet'

// Pin simples em SVG: evita depender das imagens padrão do Leaflet (quebram no bundler)
export const pinIcon = L.divIcon({
  className: '',
  iconSize: [24, 32],
  iconAnchor: [12, 32],
  html: `
    <svg viewBox="0 0 24 32" width="24" height="32" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 20 12 20s12-11.6 12-20c0-6.6-5.4-12-12-12z" fill="#dc2626" />
      <circle cx="12" cy="12" r="4.5" fill="#ffffff" />
    </svg>
  `,
})

// Escapa texto vindo do cadastro antes de interpolar no HTML do marcador
function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`)
}

type PriceMarkerOptions = {
  price: string
  code: string
  selected: boolean
}

// Etiqueta com preço e referência, como no portal de anúncios
export function createPriceIcon({ price, code, selected }: PriceMarkerOptions) {
  const background = selected ? '#dc2626' : '#0ea5e9'
  const safePrice = escapeHtml(price)
  const safeCode = escapeHtml(code)

  return L.divIcon({
    className: '',
    iconSize: [150, 38],
    iconAnchor: [75, 38],
    html: `
      <div style="display:flex;align-items:stretch;border-radius:4px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.4);font-family:inherit">
        <div style="display:flex;align-items:center;padding:0 6px;background:rgba(0,0,0,.15);color:#fff">i</div>
        <div style="flex:1;padding:4px 8px;background:${background};color:#fff;text-align:center;line-height:1.2">
          <div style="font-weight:600;font-size:12px">${safePrice}</div>
          <div style="font-size:11px">${safeCode}</div>
        </div>
      </div>
    `,
  })
}

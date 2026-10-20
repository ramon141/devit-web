// Pós-build: gera uma página estática por imóvel (título, descrição e foto para
// Google e WhatsApp) e o sitemap. Se a API estiver fora do ar, o build segue sem isso.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DIST = path.resolve('dist')
const API = process.env.VITE_APP_BASE_API_URL
const SITE = (process.env.SITE_URL ?? '').replace(/\/$/, '')
const PAGE_SIZE = 100
const STATIC_PATHS = ['/', '/immobili', '/zone', '/chi-siamo', '/calendari', '/richieste', '/contatti', '/news']

const escapeHtml = (text) =>
  String(text ?? '').replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char])

async function fetchAllProperties() {
  const items = []

  for (let page = 1; ; page += 1) {
    const response = await fetch(`${API}/public/properties?page=${page}&limit=${PAGE_SIZE}`)
    if (!response.ok) throw new Error(`API respondeu ${response.status}`)

    const data = await response.json()
    items.push(...(data.items ?? []))

    if (items.length >= (data.total ?? 0) || !data.items?.length) return items
  }
}

function describe(property) {
  const parts = [
    property.category?.name,
    property.zone?.name ?? property.address?.city,
    property.areaSqm ? `${property.areaSqm} m²` : null,
    property.bedrooms ? `${property.bedrooms} camere` : null,
    property.price ? `€ ${Number(property.price).toLocaleString('it-IT')}` : null,
  ]

  return parts.filter(Boolean).join(' · ')
}

function buildPage(template, property) {
  const title = `${property.title} | Devit Servizi Immobiliari`
  const url = `${SITE}/property/${property.slug}`
  const image = property.coverPhotoUrl ? new URL(property.coverPhotoUrl, API).href : ''

  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(describe(property))}" />`,
    SITE && `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(property.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(describe(property))}" />`,
    SITE && `<meta property="og:url" content="${escapeHtml(url)}" />`,
    image && `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ]

  return template
    .replace(/<title>.*?<\/title>/, '')
    .replace('</head>', `    ${tags.filter(Boolean).join('\n    ')}\n  </head>`)
}

function buildSitemap(properties) {
  const paths = [...STATIC_PATHS, ...properties.map((property) => `/property/${property.slug}`)]
  const urls = paths.map((item) => `  <url><loc>${escapeHtml(SITE + item)}</loc></url>`).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

async function main() {
  if (!API) return console.warn('[seo] VITE_APP_BASE_API_URL ausente: páginas estáticas não geradas')

  const template = await readFile(path.join(DIST, 'index.html'), 'utf8')
  const properties = (await fetchAllProperties()).filter((property) => property.slug)

  for (const property of properties) {
    const dir = path.join(DIST, 'property', property.slug)

    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, 'index.html'), buildPage(template, property))
  }

  if (SITE) {
    await writeFile(path.join(DIST, 'sitemap.xml'), buildSitemap(properties))
    await writeFile(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /gestionale/\nSitemap: ${SITE}/sitemap.xml\n`)
  }

  console.log(`[seo] ${properties.length} páginas de imóveis geradas`)
}

main().catch((error) => console.warn(`[seo] ignorado: ${error.message}`))

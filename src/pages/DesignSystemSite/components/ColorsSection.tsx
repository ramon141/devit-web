import { useTranslation } from 'react-i18next'
import Section from '@/pages/DesignSystemSite/components/Section'

type SiteColor = {
  name: string
  hex: string
  role: string
}

const siteColors: SiteColor[] = [
  { name: 'Cream light', hex: '#fbf7ef', role: 'Fundo principal' },
  { name: 'Cream', hex: '#f4efe6', role: 'Seção alternada' },
  { name: 'Ink', hex: '#0b0b0b', role: 'Texto, footer, botão' },
  { name: 'Ink soft', hex: '#514b40', role: 'Texto secundário' },
  { name: 'Muted', hex: '#8b8478', role: 'Labels, metadados' },
  { name: 'Accent', hex: '#ffcc00', role: 'CTA, badge, eyebrow' },
  { name: 'Accent deep', hex: '#e0b400', role: 'Hover do accent' },
]

function ColorSwatch({ color }: { color: SiteColor }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="h-16" style={{ backgroundColor: color.hex }} />
      <div className="p-3">
        <p className="text-sm font-semibold">{color.name}</p>
        <p className="font-mono text-xs text-muted-foreground">{color.hex}</p>
        <p className="mt-1 text-xs text-muted-foreground">{color.role}</p>
      </div>
    </div>
  )
}

function ColorsSection() {
  const { t } = useTranslation('designSystemSite')

  return (
    <Section id="colors" title={t('colors.title')} description={t('colors.description')}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {siteColors.map((color) => (
          <ColorSwatch key={color.hex} color={color} />
        ))}
      </div>
    </Section>
  )
}

export default ColorsSection

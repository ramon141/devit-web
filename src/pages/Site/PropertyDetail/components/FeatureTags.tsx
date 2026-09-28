import { useTranslation } from 'react-i18next'
import type { SiteDetail } from '@/lib/site/types'

// "airConditioning" -> "Air Conditioning" quando a tradução da característica não existir
function humanize(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ').replace(/^./, (char) => char.toUpperCase())
}

// Características do imóvel, traduzidas com as mesmas chaves do cadastro do CRM (imoveis)
function FeatureTags({ features }: { features: NonNullable<SiteDetail['features']> }) {
  const { t } = useTranslation('imoveis')

  return (
    <ul className="flex flex-wrap gap-2.5">
      {features.map((feature) => (
        <li
          key={`${feature.category}-${feature.featureKey}`}
          className="rounded-full border border-site-line px-4 py-2 text-sm text-site-ink-soft"
        >
          {t(`options.features.${feature.category}.${feature.featureKey}`, {
            defaultValue: humanize(feature.featureKey ?? ''),
          })}
        </li>
      ))}
    </ul>
  )
}

export default FeatureTags

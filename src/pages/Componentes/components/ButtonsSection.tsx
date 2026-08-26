import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import ComponentSection from '@/pages/Componentes/components/ComponentSection'

function ButtonsSection() {
  const { t } = useTranslation('componentes')

  return (
    <ComponentSection
      id="button"
      title={t('buttons.title')}
      description={t('buttons.description')}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Button>{t('buttons.primary')}</Button>
        <Button variant="secondary">{t('buttons.secondary')}</Button>
        <Button variant="outline">{t('buttons.outline')}</Button>
        <Button variant="ghost">{t('buttons.ghost')}</Button>
        <Button variant="destructive">
          <Trash2 />
          {t('buttons.delete')}
        </Button>
        <Button variant="link">{t('buttons.link')}</Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">{t('buttons.small')}</Button>
        <Button size="default">{t('buttons.default')}</Button>
        <Button size="lg">{t('buttons.large')}</Button>
        <Button size="icon" variant="outline">
          <Trash2 />
        </Button>
        <Button disabled>{t('buttons.disabled')}</Button>
      </div>
    </ComponentSection>
  )
}

export default ButtonsSection

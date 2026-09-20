import { useTranslation } from 'react-i18next'
import { AppLayout } from '@/components/layout'
import ColorsSection from '@/pages/DesignSystemSite/components/ColorsSection'
import TypographySection from '@/pages/DesignSystemSite/components/TypographySection'
import ButtonsSection from '@/pages/DesignSystemSite/components/ButtonsSection'
import BadgesSection from '@/pages/DesignSystemSite/components/BadgesSection'
import PropertyCardSection from '@/pages/DesignSystemSite/components/PropertyCardSection'
import SearchFormSection from '@/pages/DesignSystemSite/components/SearchFormSection'
import SpacingSection from '@/pages/DesignSystemSite/components/SpacingSection'
import MotionSection from '@/pages/DesignSystemSite/components/MotionSection'
import AnatomySection from '@/pages/DesignSystemSite/components/AnatomySection'

function DesignSystemSite() {
  const { t } = useTranslation('designSystemSite')

  return (
    <AppLayout title={t('page.title')} description={t('page.description')}>
      <div
        className="-m-1 rounded-xl p-5 sm:p-6"
        style={{ backgroundColor: '#fbf7ef' }}
      >
        <div className="grid gap-4">
          <ColorsSection />
          <TypographySection />
          <ButtonsSection />
          <BadgesSection />
          <PropertyCardSection />
          <SearchFormSection />
          <SpacingSection />
          <MotionSection />
          <AnatomySection />
        </div>
      </div>
    </AppLayout>
  )
}

export default DesignSystemSite

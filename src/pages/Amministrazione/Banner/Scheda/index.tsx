import { useNavigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import SectionPage from '@/components/layout/SectionPage'
import { useHomeBannerControllerFindById } from '@/api/generated/api'
import { useBannerForm } from '@/pages/Amministrazione/Banner/hooks/useBannerForm'
import BannerFormFields from '@/pages/Amministrazione/Banner/components/BannerFormFields'
import BannerPreviewPanel from '@/pages/Amministrazione/Banner/components/BannerPreviewPanel'

const LIST_PATH = '/gestionale/amministrazione/banner'

function BannerScheda() {
  const { t } = useTranslation('amministrazione')
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = !id

  const { data: banner } = useHomeBannerControllerFindById(
    id ?? '',
    { filter: { include: [{ relation: 'attachment' }, { relation: 'mobileAttachment' }] } },
    { query: { enabled: !isNew } }
  )

  const bannerForm = useBannerForm({
    banner,
    onSaved: () => navigate(LIST_PATH),
  })

  return (
    <SectionPage
      title={isNew ? t('bannerFormModal.newTitle') : t('bannerFormModal.editTitle')}
      description={t('bannerPage.description')}
      parentLabel={t('bannerPage.title')}
      parentPath={LIST_PATH}
    >
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <BannerFormFields
            banner={banner}
            bannerForm={bannerForm}
            onCancel={() => navigate(LIST_PATH)}
          />
        </div>

        <div className="rounded-xl border bg-white p-6">
          <BannerPreviewPanel
            title={bannerForm.form.watch('title')}
            subtitle={bannerForm.form.watch('subtitle')}
            desktopFile={bannerForm.imageFiles[0]}
            mobileFile={bannerForm.mobileImageFiles[0]}
            desktopUrl={banner?.attachment?.url}
            mobileUrl={banner?.mobileAttachment?.url}
          />
        </div>
      </div>
    </SectionPage>
  )
}

export default BannerScheda

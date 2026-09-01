import { useNavigate, useParams, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import AppLayout from '@/components/layout/AppLayout'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Link } from 'react-router'
import { usePropertyControllerFindById } from '@/api/generated/api'
import { usePropertyForm } from '@/pages/Imoveis/hooks/usePropertyForm'
import PropertyFormFields from '@/pages/Imoveis/components/PropertyFormFields'

function PropertyScheda() {
  const { t } = useTranslation('imoveis')
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isNew = !id

  const { data: property } = usePropertyControllerFindById(
    id ?? '',
    { filter: { include: [{ relation: 'category' }, { relation: 'address' }, { relation: 'owner' }] } },
    { query: { enabled: !isNew } }
  )

  const { form, isSubmitting, onSubmit } = usePropertyForm({
    property,
    initialCategoryId: isNew ? (searchParams.get('categoryId') ?? undefined) : undefined,
    onSaved: (savedId) => {
      if (isNew) navigate(`/gestionale/proprieta/${savedId}`, { replace: true })
    },
  })

  return (
    <AppLayout
      title={property?.title ?? t('scheda.pageTitle')}
      description={t('scheda.pageDescription')}
    >
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/gestionale/proprieta" />}>{t('scheda.breadcrumbList')}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{property?.title ?? t('scheda.pageTitle')}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PropertyFormFields
        form={form}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        propertyId={property?.id}
      />
    </AppLayout>
  )
}

export default PropertyScheda

import { useNavigate, useParams } from 'react-router'
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
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = !id

  const { data: property } = usePropertyControllerFindById(
    id ?? '',
    { filter: { include: [{ relation: 'category' }, { relation: 'address' }, { relation: 'owner' }] } },
    { query: { enabled: !isNew } }
  )

  const { form, isSubmitting, onSubmit } = usePropertyForm({
    property,
    onSaved: (savedId) => {
      if (isNew) navigate(`/proprieta/${savedId}`, { replace: true })
    },
  })

  return (
    <AppLayout
      title={property?.title ?? 'Nuovo immobile'}
      description="Gestisci tutti i dati dell'immobile"
    >
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/proprieta" />}>Proprietà</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{property?.title ?? 'Nuovo immobile'}</BreadcrumbPage>
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

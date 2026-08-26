import { Link, useParams } from 'react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { usePublicPropertyControllerFindById } from '@/api/generated/api'
import PropertyHeader from '@/pages/Site/PropertyDetail/components/PropertyHeader'
import PropertyGallery from '@/pages/Site/PropertyDetail/components/PropertyGallery'
import PropertyDescription from '@/pages/Site/PropertyDetail/components/PropertyDescription'
import PropertyAddressBlock from '@/pages/Site/PropertyDetail/components/PropertyAddressBlock'
import PropertyDetailsGrid from '@/pages/Site/PropertyDetail/components/PropertyDetailsGrid'
import PropertyAdditionalDetailsGrid from '@/pages/Site/PropertyDetail/components/PropertyAdditionalDetailsGrid'
import PropertyFeatures from '@/pages/Site/PropertyDetail/components/PropertyFeatures'

function PropertyDetailSkeleton() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-8">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}

function PropertyNotFound() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-4 py-16 text-center">
      <h1 className="font-heading text-xl font-semibold">Immobile non trovato.</h1>
      <Link to="/site" className="text-sm text-primary underline underline-offset-2">
        Torna alla home
      </Link>
    </div>
  )
}

function PropertyDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: property, isLoading, isError } = usePublicPropertyControllerFindById(id ?? '')

  if (isLoading) return <PropertyDetailSkeleton />
  if (isError || !property) return <PropertyNotFound />

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
      <PropertyGallery photos={property.photos} />
      <PropertyHeader property={property} />

      <Separator />

      <PropertyDescription description={property.description} documents={property.documents} />

      <Separator />

      <PropertyAddressBlock address={property.address} />

      <Separator />

      <PropertyDetailsGrid property={property} />
      <PropertyAdditionalDetailsGrid property={property} />

      <PropertyFeatures features={property.features} />
    </div>
  )
}

export default PropertyDetail

import { usePublicPropertyControllerFindFeatured } from '@/api/generated/api'
import { Skeleton } from '@/components/ui/skeleton'
import SearchBar from '@/pages/Site/components/SearchBar'
import PropertyCard from '@/pages/Site/components/PropertyCard'

function FeaturedProperties() {
  const { data, isLoading } = usePublicPropertyControllerFindFeatured({ limit: 8 })

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-72 w-full" />
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return <p className="text-muted-foreground">Nessuna proprietà in evidenza al momento.</p>
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}

function SiteHome() {
  return (
    <div className="flex flex-col gap-16 py-10">
      <section className="px-4">
        <SearchBar />
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
        <div>
          <h1 className="text-2xl font-bold">Le nostre proposte esclusive</h1>
          <p className="text-muted-foreground">Scegli la proprietà che fa al caso tuo.</p>
        </div>

        <FeaturedProperties />
      </section>

      <section className="mx-auto max-w-3xl px-4 text-center">
        <blockquote className="text-lg italic">
          "...garantiamo la massima collaborazione, la massima adesione ai nostri
          clienti affinché tutto avvenga con serenità ed ognuno possa realizzare nel
          modo migliore il proprio sogno".
        </blockquote>
        <p className="mt-2 font-semibold">A.D.S. e M.V</p>
      </section>
    </div>
  )
}

export default SiteHome

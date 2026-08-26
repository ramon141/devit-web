import { useTranslation } from 'react-i18next'
import { usePublicPropertyControllerFindFeatured } from '@/api/generated/api'
import { Skeleton } from '@/components/ui/skeleton'
import SearchBar from '@/pages/Site/components/SearchBar'
import PropertyCard from '@/pages/Site/components/PropertyCard'
import DropCapHeading from '@/pages/Site/components/DropCapHeading'
import heroImage from '@/assets/images/property-sample-1.jpg'

function FeaturedProperties() {
  const { t } = useTranslation('site')
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
    return (
      <p className="text-center text-muted-foreground">
        {t('home.noFeatured')}
      </p>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}

function Hero() {
  const { t } = useTranslation('site')

  return (
    <section className="relative h-[420px] w-full overflow-hidden sm:h-[480px]">
      <img src={heroImage} alt="" className="h-full w-full object-cover" />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 pb-24 text-center text-white sm:pb-28">
        <h1 className="font-heading text-3xl font-bold drop-shadow-sm sm:text-4xl">
          {t('home.heroTitle')}
        </h1>
        <p className="mt-2 text-sm text-white/90 sm:text-base">
          {t('home.heroSubtitle')}
        </p>
      </div>

      <div className="absolute inset-x-4 bottom-0 translate-y-1/2">
        <SearchBar />
      </div>
    </section>
  )
}

function SiteHome() {
  const { t } = useTranslation('site')

  return (
    <div className="flex flex-col gap-16 pb-16">
      <Hero />

      <section className="mx-auto mt-8 flex w-full max-w-6xl flex-col gap-8 px-4 sm:mt-12">
        <div className="text-center">
          <DropCapHeading
            as="h2"
            text={t('home.sectionTitle')}
            className="text-3xl font-bold"
          />
          <p className="mt-1 text-muted-foreground">{t('home.sectionSubtitle')}</p>
        </div>

        <FeaturedProperties />
      </section>

      <section className="mx-auto w-full px-4">
        <blockquote className="text-lg italic text-foreground/90">
          {t('home.quote')}
        </blockquote>
        <p className="mt-3 text-right font-semibold">{t('home.quoteAuthor')}</p>
      </section>
    </div>
  )
}

export default SiteHome

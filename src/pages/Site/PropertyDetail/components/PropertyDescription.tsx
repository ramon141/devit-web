import { useTranslation } from 'react-i18next'
import { Separator } from '@/components/ui/separator'
import type { PublicPropertyControllerFindById200DocumentsItem } from '@/api/generated/models'

type PropertyDescriptionProps = {
  description: string | null | undefined
  documents: PublicPropertyControllerFindById200DocumentsItem[] | undefined
}

function PropertyDescription({ description, documents }: PropertyDescriptionProps) {
  const { t } = useTranslation('site')
  const hasDocuments = documents && documents.length > 0

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-heading text-lg font-semibold">{t('propertyDescription.title')}</h2>
        <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
          {description ?? t('propertyDescription.empty')}
        </p>
      </div>

      {hasDocuments && (
        <>
          <Separator />

          <div>
            <h3 className="font-heading text-base font-semibold">
              {t('propertyDescription.documentsTitle')}
            </h3>

            <ul className="mt-2 flex flex-col gap-1">
              {documents.map((document, index) => (
                <li key={document.url ?? index}>
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary underline underline-offset-2"
                  >
                    {document.label ?? t('propertyDescription.defaultDocumentLabel')}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

export default PropertyDescription

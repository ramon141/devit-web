import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DownloadIcon, FileTextIcon } from 'lucide-react'
import ConfirmDeleteButton from '@/components/ConfirmDeleteButton'
import { Button } from '@/components/ui/button'
import FileUpload from '@/components/FileUpload'
import { usePropertyFloorPlans } from '@/pages/Imoveis/Scheda/hooks/usePropertyFloorPlans'

type PropertyFloorPlansProps = {
  propertyId: string
}

function PropertyFloorPlans({ propertyId }: PropertyFloorPlansProps) {
  const { t } = useTranslation('imoveis')
  const { floorPlans, uploadFiles, removeFloorPlan } = usePropertyFloorPlans(propertyId)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])

  function handleChange(files: File[]) {
    setPendingFiles(files)
    if (files.length > 0) {
      uploadFiles(files)
      setPendingFiles([])
    }
  }

  return (
    <div className="grid gap-4">
      <h3 className="text-sm font-semibold">{t('scheda.floorPlans.title')}</h3>

      <FileUpload
        label={t('scheda.floorPlans.uploadLabel')}
        value={pendingFiles}
        onChange={handleChange}
        accept="image/*,application/pdf"
        multiple
      />

      {floorPlans.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('scheda.floorPlans.empty')}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {floorPlans.map((plan) => (
            <div key={plan.id} className="overflow-hidden rounded-lg ring-1 ring-border">
              {plan.attachment?.mimeType?.startsWith('image/') && plan.attachment.url ? (
                <img
                  src={plan.attachment.url}
                  alt={plan.caption ?? ''}
                  loading="lazy"
                  decoding="async"
                  className="aspect-video w-full object-contain"
                />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-muted">
                  <FileTextIcon className="size-8 text-muted-foreground" />
                </div>
              )}

              <div className="flex items-center justify-between gap-2 p-2">
                <span className="truncate text-xs text-muted-foreground">
                  {plan.attachment?.originalName}
                </span>

                <div className="flex shrink-0 gap-1">
                  {plan.attachment?.url && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      nativeButton={false}
                      render={<a href={plan.attachment.url} target="_blank" rel="noreferrer" />}
                    >
                      <DownloadIcon className="size-4" />
                    </Button>
                  )}
                  <ConfirmDeleteButton
                    name={plan.attachment?.originalName ?? ''}
                    onConfirm={() => plan.id && removeFloorPlan(plan.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PropertyFloorPlans

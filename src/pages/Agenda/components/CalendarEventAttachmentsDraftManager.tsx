import { useTranslation } from 'react-i18next'
import FileUpload from '@/components/FileUpload'

type CalendarEventAttachmentsDraftManagerProps = {
  files: File[]
  onChange: (files: File[]) => void
}

function CalendarEventAttachmentsDraftManager({
  files,
  onChange,
}: CalendarEventAttachmentsDraftManagerProps) {
  const { t } = useTranslation('agenda')

  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium">{t('agenda:attachmentsManager.title')}</p>
      <FileUpload value={files} onChange={onChange} multiple />
    </div>
  )
}

export default CalendarEventAttachmentsDraftManager

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import FileUpload from '@/components/FileUpload'
import ComponentSection from '@/pages/Componentes/components/ComponentSection'

function FileUploadSection() {
  const { t } = useTranslation('componentes')
  const [files, setFiles] = useState<File[]>([])

  return (
    <ComponentSection
      id="file-upload"
      title={t('fileUpload.title')}
      description={t('fileUpload.description')}
    >
      <div className="max-w-md">
        <FileUpload
          label={t('fileUpload.label')}
          value={files}
          onChange={setFiles}
          multiple
          hint={t('fileUpload.hint')}
        />
      </div>
    </ComponentSection>
  )
}

export default FileUploadSection

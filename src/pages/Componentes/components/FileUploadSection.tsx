import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import ComponentSection from '@/pages/Componentes/components/ComponentSection'

function FileUploadSection() {
  const [files, setFiles] = useState<File[]>([])

  return (
    <ComponentSection
      id="file-upload"
      title="File Upload"
      description="Area di caricamento con drag & drop e lista dei file selezionati."
    >
      <div className="max-w-md">
        <FileUpload
          label="Documenti dell'immobile"
          value={files}
          onChange={setFiles}
          multiple
          hint="PDF, JPG o PNG fino a 10MB"
        />
      </div>
    </ComponentSection>
  )
}

export default FileUploadSection

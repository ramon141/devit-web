import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ControlledInput from '@/components/ControlledInput'
import { propertyControllerNextCode } from '@/api/generated/api'
import type { UseFormReturn } from 'react-hook-form'
import type { PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

type PropertyCodeFieldProps = {
  form: UseFormReturn<PropertyFormValues>
}

// Pede ao servidor o próximo código livre
function PropertyCodeField({ form }: PropertyCodeFieldProps) {
  const { t } = useTranslation('imoveis')
  const [isGenerating, setIsGenerating] = useState(false)

  async function handleGenerate() {
    setIsGenerating(true)

    try {
      const { code } = await propertyControllerNextCode()

      form.setValue('code', code, { shouldDirty: true, shouldValidate: true })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <ControlledInput
          control={form.control}
          name="code"
          placeholder={t('generalTab.codePlaceholder')}
        />
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        title={t('generalTab.generateCode')}
        disabled={isGenerating}
        onClick={handleGenerate}
      >
        <Wand2 />
      </Button>
    </div>
  )
}

export default PropertyCodeField

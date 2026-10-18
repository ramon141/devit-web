import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ControlledInput from '@/components/ControlledInput'
import { propertyControllerFind } from '@/api/generated/api'
import type { UseFormReturn } from 'react-hook-form'
import type { PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

const CODE_LENGTH = 6
const NUMERIC_CODE = /^\d{1,9}$/

type PropertyCodeFieldProps = {
  form: UseFormReturn<PropertyFormValues>
}

// Gera o próximo código sequencial a partir do maior código numérico já cadastrado
function PropertyCodeField({ form }: PropertyCodeFieldProps) {
  const { t } = useTranslation('imoveis')
  const [isGenerating, setIsGenerating] = useState(false)

  async function handleGenerate() {
    setIsGenerating(true)

    try {
      // Considera só códigos puramente numéricos (até 9 dígitos), para o próximo número não perder precisão
      const properties = await propertyControllerFind({
        filter: { fields: { code: true }, limit: 20000 },
      })

      const lastNumber = properties.reduce((max, property) => {
        const code = property.code ?? ''
        if (!NUMERIC_CODE.test(code)) return max
        return Math.max(max, Number(code))
      }, 0)
      const next = String(lastNumber + 1).padStart(CODE_LENGTH, '0')

      form.setValue('code', next, { shouldDirty: true, shouldValidate: true })
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

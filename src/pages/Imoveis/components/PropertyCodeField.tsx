import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ControlledInput from '@/components/ControlledInput'
import { propertyControllerFind } from '@/api/generated/api'
import type { UseFormReturn } from 'react-hook-form'
import type { PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

const CODE_LENGTH = 6

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
      // `order: ['code DESC']` ordena como texto ("T1" > "R-…" > "000002"),
      // então o maior código numérico real nunca aparecia no topo e o
      // gerador sempre devolvia "000002" (repetindo um código já usado).
      // Busca só o campo `code` de todos os imóveis e calcula o maior
      // número no cliente.
      const properties = await propertyControllerFind({
        filter: { fields: { code: true }, limit: 20000 },
      })

      const lastNumber = properties.reduce((max, property) => {
        const digits = property.code?.replace(/\D/g, '') ?? ''
        if (!digits) return max
        return Math.max(max, Number(digits))
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

import { XIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import SearchableSelect, { type SearchableSelectOption } from '@/components/SearchableSelect'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { Badge } from '@/components/ui/badge'

type MultiSelectFieldProps = {
  options: SearchableSelectOption[]
  values: string[]
  onChange: (values: string[]) => void
  label: string
  required?: boolean
  placeholder?: string
  searchPlaceholder?: string
  error?: string
}

// Seleção múltipla: SearchableSelect para adicionar + chips removíveis para os selecionados
function MultiSelectField({
  options,
  values,
  onChange,
  label,
  required,
  placeholder,
  searchPlaceholder,
  error,
}: MultiSelectFieldProps) {
  const { t } = useTranslation('common')

  const available = options.filter((option) => !values.includes(option.value))
  const selectedOptions = values
    .map((value) => options.find((option) => option.value === value))
    .filter((option): option is SearchableSelectOption => !!option)

  function add(value: string) {
    if (value && !values.includes(value)) {
      onChange([...values, value])
    }
  }

  function remove(value: string) {
    onChange(values.filter((current) => current !== value))
  }

  return (
    <FormFieldWrapper label={label} required={required} error={error}>
      <SearchableSelect
        options={available}
        value={undefined}
        onValueChange={add}
        placeholder={placeholder ?? t('multiSelectField.placeholder')}
        searchPlaceholder={searchPlaceholder}
      />

      {selectedOptions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selectedOptions.map((option) => (
            <Badge key={option.value} variant="secondary" className="gap-1">
              {option.label}
              <button type="button" onClick={() => remove(option.value)} aria-label={t('multiSelectField.remove')}>
                <XIcon className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </FormFieldWrapper>
  )
}

export default MultiSelectField

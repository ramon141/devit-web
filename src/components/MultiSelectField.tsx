import { useTranslation } from 'react-i18next'
import Select, { type MultiValue } from 'react-select'
import type { SearchableSelectOption } from '@/components/SearchableSelect'
import FormFieldWrapper from '@/components/FormFieldWrapper'

type MultiSelectFieldProps = {
  options: SearchableSelectOption[]
  values: string[]
  onChange: (values: string[]) => void
  label: string
  required?: boolean
  placeholder?: string
  searchPlaceholder?: string
  error?: string
  triggerVariant?: 'outline' | 'secondary'
  onSearchChange?: (search: string) => void
  isLoading?: boolean
}

// Seleção múltipla com react-select: chips dentro do campo
function MultiSelectField({
  options,
  values,
  onChange,
  label,
  required,
  placeholder,
  error,
  onSearchChange,
  isLoading,
}: MultiSelectFieldProps) {
  const { t } = useTranslation('common')

  const selected = values
    .map((value) => options.find((option) => option.value === value))
    .filter((option): option is SearchableSelectOption => !!option)

  function handleChange(next: MultiValue<SearchableSelectOption>) {
    onChange(next.map((option) => option.value))
  }

  return (
    <FormFieldWrapper label={label} required={required} error={error}>
      <Select<SearchableSelectOption, true>
        isMulti
        options={options}
        value={selected}
        onChange={handleChange}
        placeholder={placeholder ?? t('multiSelectField.placeholder')}
        isLoading={isLoading}
        onInputChange={(input) => onSearchChange?.(input)}
        filterOption={onSearchChange ? () => true : undefined}
        closeMenuOnSelect={false}
        noOptionsMessage={() => t('searchableSelect.emptyText')}
        loadingMessage={() => t('searchableSelect.loading')}
        classNames={{
          control: ({ isFocused }) =>
            [
              '!min-h-10 !rounded-lg !bg-card !text-sm !shadow-none',
              '!transition-[border-color,box-shadow] !duration-200 !ease-out',
              isFocused
                ? '!border-ring !ring-3 !ring-ring/50'
                : '!border-input',
            ].join(' '),
          multiValue: () =>
            '!rounded-md !border !border-amber-300 !bg-amber-100 !text-sm',
          multiValueLabel: () => '!px-2 !py-0.5 !text-sm !font-medium !text-foreground',
          multiValueRemove: () =>
            '!rounded-r-md !px-1.5 !text-foreground hover:!bg-amber-300 hover:!text-foreground',
          option: ({ isFocused, isSelected }) =>
            `!text-sm ${isFocused || isSelected ? '!bg-accent !text-foreground' : ''}`,
        }}
        menuPortalTarget={document.body}
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      />
    </FormFieldWrapper>
  )
}

export default MultiSelectField

import SearchableSelect, { type SearchableSelectProps } from '@/components/SearchableSelect'
import MultiSelectField from '@/components/MultiSelectField'
import { usePersonSearchOptions, usePersonSearchOptionsMulti } from '@/hooks/usePersonSearchOptions'
import { usePropertySearchOptions } from '@/hooks/usePropertySearchOptions'
import { useLeadSearchOptions } from '@/hooks/useLeadSearchOptions'
import { useProposalSearchOptions } from '@/hooks/useProposalSearchOptions'
import type { PersonRole } from '@/api/generated/models'

type RemoteProps = Omit<SearchableSelectProps, 'options' | 'onSearchChange' | 'isLoading'>

// Selects com busca no servidor: carregam poucos registros e só os campos exibidos
export function PersonSelect({ role, ...props }: RemoteProps & { role?: PersonRole }) {
  const { options, isLoading, setSearch } = usePersonSearchOptions(props.value, role)

  return <SearchableSelect {...props} options={options} isLoading={isLoading} onSearchChange={setSearch} />
}

export function PropertySelect(props: RemoteProps) {
  const { options, isLoading, setSearch } = usePropertySearchOptions(props.value)

  return <SearchableSelect {...props} options={options} isLoading={isLoading} onSearchChange={setSearch} />
}

export function LeadSelect(props: RemoteProps) {
  const { options, isLoading, setSearch } = useLeadSearchOptions(props.value)

  return <SearchableSelect {...props} options={options} isLoading={isLoading} onSearchChange={setSearch} />
}

export function ProposalSelect(props: RemoteProps) {
  const { options, isLoading, setSearch } = useProposalSearchOptions(props.value)

  return <SearchableSelect {...props} options={options} isLoading={isLoading} onSearchChange={setSearch} />
}

type PersonMultiSelectProps = {
  values: string[]
  onChange: (values: string[]) => void
  label: string
  required?: boolean
  placeholder?: string
  searchPlaceholder?: string
  error?: string
}

export function PersonMultiSelect({ values, ...props }: PersonMultiSelectProps) {
  const { options, isLoading, setSearch, selectedOptions } = usePersonSearchOptionsMulti(values)

  return (
    <MultiSelectField
      {...props}
      values={values}
      options={[...selectedOptions, ...options]}
      isLoading={isLoading}
      onSearchChange={setSearch}
    />
  )
}

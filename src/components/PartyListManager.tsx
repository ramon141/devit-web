import { PlusIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SearchableSelect from '@/components/SearchableSelect'
import FormFieldWrapper from '@/components/FormFieldWrapper'

type Option = { value: string; label: string }

type PartyListManagerProps = {
  label: string
  options: Option[]
  personIds: string[]
  onChange: (ids: string[]) => void
  placeholder?: string
  addLabel?: string
}

// Gerenciador de lista de pessoas (proprietari/inquilini/acquirenti plurais) —
// mantém sempre pelo menos 1 slot, o primeiro é a parte "principal".
function PartyListManager({
  label,
  options,
  personIds,
  onChange,
  placeholder,
  addLabel = '+',
}: PartyListManagerProps) {
  const ids = personIds.length > 0 ? personIds : ['']

  function updateAt(index: number, value: string) {
    const next = [...ids]
    next[index] = value
    onChange(next)
  }

  function removeAt(index: number) {
    const next = ids.filter((_, i) => i !== index)
    onChange(next.length > 0 ? next : [''])
  }

  return (
    <div className="grid gap-2 sm:col-span-2">
      <FormFieldWrapper label={label}>
        <div className="grid gap-2">
          {ids.map((id, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1">
                <SearchableSelect
                  options={options}
                  value={id}
                  onValueChange={(value) => updateAt(index, value)}
                  placeholder={placeholder}
                />
              </div>
              {ids.length > 1 && (
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeAt(index)}>
                  <XIcon className="size-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </FormFieldWrapper>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit gap-1.5"
        onClick={() => onChange([...ids, ''])}
      >
        <PlusIcon className="size-4" />
        {addLabel}
      </Button>
    </div>
  )
}

export default PartyListManager

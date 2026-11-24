import { useTranslation } from 'react-i18next'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import { LeadSelect, PropertySelect } from '@/components/RemoteSelects'
import { getFeedbackTypeOptions } from '@/pages/Clientes/Feedback/schemas/feedbackSchema'

type FeedbackFiltersProps = {
  typeFilter: string
  onTypeChange: (value: string) => void
  propertyFilter: string
  onPropertyChange: (value: string) => void
  leadFilter: string
  onLeadChange: (value: string) => void
}

function FeedbackFilters({
  typeFilter,
  onTypeChange,
  propertyFilter,
  onPropertyChange,
  leadFilter,
  onLeadChange,
}: FeedbackFiltersProps) {
  const { t } = useTranslation('clientes')

  return (
    <>
      <div className="w-full sm:min-w-40 sm:flex-1">
        <FormFieldWrapper label={t('feedbackFilters.type')}>
          <SelectField
            value={typeFilter}
            onValueChange={onTypeChange}
            options={getFeedbackTypeOptions(t)}
            placeholder={t('feedbackFilters.typeAll')}
          />
        </FormFieldWrapper>
      </div>

      <div className="w-full sm:min-w-40 sm:flex-1">
        <FormFieldWrapper label={t('feedbackFilters.property')}>
          <PropertySelect
            value={propertyFilter}
            onValueChange={onPropertyChange}
            placeholder={t('feedbackFilters.propertyAll')}
            searchPlaceholder={t('feedbackFormModal.propertySearch')}
          />
        </FormFieldWrapper>
      </div>

      <div className="w-full sm:min-w-40 sm:flex-1">
        <FormFieldWrapper label={t('feedbackFilters.lead')}>
          <LeadSelect
            value={leadFilter}
            onValueChange={onLeadChange}
            placeholder={t('feedbackFilters.leadAll')}
            searchPlaceholder={t('feedbackFormModal.leadSearch')}
          />
        </FormFieldWrapper>
      </div>
    </>
  )
}

export default FeedbackFilters

import { useTranslation } from 'react-i18next'
import { CALENDAR_EVENT_TYPE_KEYS } from '@/pages/Agenda/components/eventTypeKeys'

// Lista cada tipo de compromisso com o nome em destaque e a explicação abaixo
function EventTypeHint() {
  const { t } = useTranslation('agenda')

  return (
    <ul className="visible-scrollbar grid max-h-80 gap-2 overflow-y-scroll -mr-2 pr-4 text-left">
      {CALENDAR_EVENT_TYPE_KEYS.map(key => (
        <li key={key}>
          <span className="block font-semibold">{t(`eventTypeOptions.${key}`)}</span>
          <span className="block opacity-80">{t(`eventTypeDescriptions.${key}`)}</span>
        </li>
      ))}
    </ul>
  )
}

export default EventTypeHint

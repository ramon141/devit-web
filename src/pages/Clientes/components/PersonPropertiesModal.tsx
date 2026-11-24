import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import PersonPropertiesList from '@/pages/Clientes/components/PersonPropertiesList'
import type { PersonWithRelations } from '@/api/generated/models'

type PersonPropertiesModalProps = {
  person: PersonWithRelations | null
  onOpenChange: (open: boolean) => void
}

// Lista os imóveis ligados a um cliente sem sair da listagem
function PersonPropertiesModal({ person, onOpenChange }: PersonPropertiesModalProps) {
  const { t } = useTranslation('clientes')

  return (
    <ModalRegister
      open={!!person}
      onOpenChange={onOpenChange}
      title={t('personPropertiesModal.title', { name: person?.name })}
      wide
    >
      {person?.id && <PersonPropertiesList personId={person.id} />}
    </ModalRegister>
  )
}

export default PersonPropertiesModal

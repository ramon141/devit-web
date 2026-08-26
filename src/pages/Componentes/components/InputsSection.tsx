import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ComponentSection from '@/pages/Componentes/components/ComponentSection'

function InputsSection() {
  const { t } = useTranslation('componentes')
  const [name, setName] = useState('')

  return (
    <ComponentSection
      id="input"
      title={t('inputs.title')}
      description={t('inputs.description')}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="demo-name">{t('inputs.nameLabel')}</Label>
          <Input
            id="demo-name"
            placeholder={t('inputs.namePlaceholder')}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="demo-email">{t('inputs.emailLabel')}</Label>
          <Input id="demo-email" type="email" placeholder="tu@devit.it" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="demo-disabled">{t('inputs.disabledLabel')}</Label>
          <Input id="demo-disabled" disabled value={t('inputs.disabledValue')} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="demo-invalid">{t('inputs.invalidLabel')}</Label>
          <Input id="demo-invalid" aria-invalid defaultValue={t('inputs.invalidValue')} />
          <p className="text-sm text-destructive">{t('inputs.requiredError')}</p>
        </div>
      </div>
    </ComponentSection>
  )
}

export default InputsSection

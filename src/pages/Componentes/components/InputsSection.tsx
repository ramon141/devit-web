import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ComponentSection from '@/pages/Componentes/components/ComponentSection'

function InputsSection() {
  const [name, setName] = useState('')

  return (
    <ComponentSection
      id="input"
      title="Input"
      description="Campo di testo standard, usato con il register del react-hook-form."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="demo-name">Nome</Label>
          <Input
            id="demo-name"
            placeholder="Inserisci il tuo nome"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="demo-email">E-mail</Label>
          <Input id="demo-email" type="email" placeholder="tu@devit.it" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="demo-disabled">Disabilitato</Label>
          <Input id="demo-disabled" disabled value="Non modificabile" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="demo-invalid">Con errore</Label>
          <Input id="demo-invalid" aria-invalid defaultValue="valore non valido" />
          <p className="text-sm text-destructive">Campo obbligatorio.</p>
        </div>
      </div>
    </ComponentSection>
  )
}

export default InputsSection

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ComponentSection from '@/pages/Componentes/components/ComponentSection'

function ButtonsSection() {
  return (
    <ComponentSection
      id="button"
      title="Button"
      description="Varianti e dimensioni del pulsante standard del sistema."
    >
      <div className="flex flex-wrap items-center gap-3">
        <Button>Primario</Button>
        <Button variant="secondary">Secondario</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">
          <Trash2 />
          Elimina
        </Button>
        <Button variant="link">Link</Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">Piccolo</Button>
        <Button size="default">Standard</Button>
        <Button size="lg">Grande</Button>
        <Button size="icon" variant="outline">
          <Trash2 />
        </Button>
        <Button disabled>Disabilitato</Button>
      </div>
    </ComponentSection>
  )
}

export default ButtonsSection

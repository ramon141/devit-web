import { AppLayout } from '@/components/layout'
import LayoutSection from '@/pages/Componentes/components/LayoutSection'
import ButtonsSection from '@/pages/Componentes/components/ButtonsSection'
import InputsSection from '@/pages/Componentes/components/InputsSection'
import SelectSection from '@/pages/Componentes/components/SelectSection'
import SearchableSelectSection from '@/pages/Componentes/components/SearchableSelectSection'
import InputMoneySection from '@/pages/Componentes/components/InputMoneySection'
import FileUploadSection from '@/pages/Componentes/components/FileUploadSection'
import FormSection from '@/pages/Componentes/components/FormSection'
import BreadcrumbSection from '@/pages/Componentes/components/BreadcrumbSection'
import ConfirmPopupSection from '@/pages/Componentes/components/ConfirmPopupSection'
import TableSection from '@/pages/Componentes/components/TableSection'

function Componentes() {
  return (
    <AppLayout
      title="Componenti"
      description="Catalogo vivo dei componenti del design system Devit"
    >
      <div className="grid gap-4">
        <LayoutSection />
        <ButtonsSection />
        <InputsSection />
        <SelectSection />
        <SearchableSelectSection />
        <InputMoneySection />
        <FileUploadSection />
        <FormSection />
        <BreadcrumbSection />
        <ConfirmPopupSection />
        <TableSection />
      </div>
    </AppLayout>
  )
}

export default Componentes

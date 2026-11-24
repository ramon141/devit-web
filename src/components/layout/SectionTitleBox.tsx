import { usePageHeader } from '@/contexts/PageHeaderContext'

type SectionTitleBoxProps = {
  title: string
  description?: string
}

// Título da seção: rola junto com o conteúdo (só a barra superior é fixa).
// A ação da página (ex: Exportar) entra no slot da direita via PageHeaderAction.
function SectionTitleBox({ title, description }: SectionTitleBoxProps) {
  const { setActionSlot } = usePageHeader()

  return (
    <div className="mt-px mb-4 hidden shrink-0 flex-wrap items-center justify-between gap-2 rounded-xl bg-card px-4 py-4 ring-1 ring-border lg:flex">
      <div id="page-section-title" className="min-w-0">
        <h1 className="mb-2 truncate text-base font-bold text-foreground">
          {title}
        </h1>
        {description && (
          <p className="truncate text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <div ref={setActionSlot} className="shrink-0" />
    </div>
  )
}

export default SectionTitleBox

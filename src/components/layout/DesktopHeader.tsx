import GlobalSearch from '@/components/layout/GlobalSearch'
import HeaderActions from '@/components/layout/HeaderActions'
import SessionInfo from '@/components/layout/SessionInfo'

// Barra superior fixa: busca, usuário e ações
function DesktopHeader() {
  return (
    <div className="mt-4 mb-4 hidden h-16 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl bg-card px-4 ring-1 ring-border lg:grid">
      <div />

      <GlobalSearch />

      <div className="flex items-center justify-end gap-3">
        <SessionInfo className="text-right" />
        <HeaderActions hideSearch className="flex items-center gap-1" />
      </div>
    </div>
  )
}

export default DesktopHeader

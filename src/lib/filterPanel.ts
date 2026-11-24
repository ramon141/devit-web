// Painel padrão dos filtros de listagem: card branco, sombra suave e campos de 40px
export const filterPanelClass = [
  'rounded-xl border border-border bg-card p-4',
  'shadow-[0_4px_16px_rgba(11,11,11,0.06)]',
  '[&_input]:h-10 [&_[data-slot=select-trigger]]:h-10',
  '[&_button[aria-haspopup=dialog]]:h-10 [&_label.h-8]:h-10',
].join(' ')

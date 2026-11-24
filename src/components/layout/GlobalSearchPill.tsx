type GlobalSearchPillProps = {
  children: string
}

// Etiqueta arredondada à direita de cada resultado
function GlobalSearchPill({ children }: GlobalSearchPillProps) {
  return (
    <span className="ml-2 inline-flex h-[22px] shrink-0 items-center rounded-full border border-sidebar/20 bg-sidebar/10 px-2 text-[0.7rem] font-medium text-sidebar">
      {children}
    </span>
  )
}

export default GlobalSearchPill

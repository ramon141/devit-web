import type { ReactNode } from 'react'

function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="mb-5 font-site-mono text-[0.72rem] uppercase tracking-[0.16em] text-site-ink">
      {children}
    </h2>
  )
}

export default SectionTitle

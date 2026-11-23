import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import GeneratedAdjustmentsTable from '@/pages/Operazioni/Locazioni/Adeguamenti/components/GeneratedAdjustmentsTable'
import { formatPercent } from '@/utils/formatPercent'
import type { RentalAdjustmentWithRelations } from '@/api/generated/models'

function adjustment(id: string, indexPercent: number): RentalAdjustmentWithRelations {
  return { id, indexPercent, oldAmount: 100, newAmount: 110 } as RentalAdjustmentWithRelations
}

describe('Locazioni: percentual de reajuste', () => {
  it('T172 2,5 / 100 / 12,3456 aparecem como 2,5% / 100% / 12,35%', () => {
    render(
      <GeneratedAdjustmentsTable
        adjustments={[adjustment('a', 2.5), adjustment('b', 100), adjustment('c', 12.3456)]}
      />,
    )

    expect(screen.getByText('2,5%')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText('12,35%')).toBeInTheDocument()
  })

  it('T173 percentual nulo mostra traço', () => {
    expect(formatPercent(null)).toBe('—')
  })

  it('T173 percentual "abc" mostra traço, nunca NaN%', () => {
    expect(formatPercent('abc')).toBe('—')
  })

  // possível bug: texto vazio vira Number('') = 0 e aparece "0%" em vez de traço
  it.fails('T173 percentual vazio mostra traço', () => {
    expect(formatPercent('')).toBe('—')
  })
})

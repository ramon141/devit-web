import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders, screen, userEvent, waitFor } from '@/test'
import ConfirmDeleteButton from '@/components/ConfirmDeleteButton'

describe('T298 confirmação de exclusão', () => {
  it('cancelar fecha a janela e não exclui', async () => {
    const onConfirm = vi.fn()
    const user = userEvent.setup()

    renderWithProviders(<ConfirmDeleteButton name="doc.pdf" onConfirm={onConfirm} />)
    await user.click(screen.getByRole('button'))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Annulla' }))

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('só confirmar executa a exclusão, uma única vez', async () => {
    const onConfirm = vi.fn()
    const user = userEvent.setup()

    renderWithProviders(<ConfirmDeleteButton name="doc.pdf" onConfirm={onConfirm} />)
    await user.click(screen.getByRole('button'))
    await user.click(await screen.findByRole('button', { name: /elimina|conferma/i }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})

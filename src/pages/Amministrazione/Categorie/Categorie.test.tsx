import { afterEach, describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import {
  getPropertyCategoryControllerCountMockHandler,
  getPropertyCategoryControllerFindMockHandler,
} from '@/api/generated/api.msw'
import { screen, server, userEvent } from '@/test'
import { renderAdmin } from '@/pages/Amministrazione/adminTestUtils'
import Categorie from '@/pages/Amministrazione/Categorie'

const KIND_LABELS = {
  it: ['Residenziale', 'Commerciale', 'Industriale', 'Terreno', 'Pertinenza', 'Cantiere'],
  pt: ['Residencial', 'Comercial', 'Industrial', 'Terreno', 'Anexo', 'Canteiro de obras'],
}

async function openKindOptions(newLabel: string, kindPlaceholder: string) {
  const user = userEvent.setup()

  await user.click(await screen.findByRole('button', { name: newLabel }))
  await user.click(await screen.findByText(kindPlaceholder))

  return screen.findAllByRole('option')
}

describe('Tela de categorias', () => {
  afterEach(async () => {
    await i18n.changeLanguage('it')
  })

  it('T251 lista os 6 tipos de categoria com rótulos em italiano', async () => {
    server.use(
      getPropertyCategoryControllerFindMockHandler([]),
      getPropertyCategoryControllerCountMockHandler({ count: 0 }),
    )
    renderAdmin(<Categorie />)

    const options = await openKindOptions('Nuova categoria', 'Seleziona il tipo')

    expect(options.map((option) => option.textContent)).toEqual(KIND_LABELS.it)
  })

  it('T251 lista os 6 tipos de categoria com rótulos em português', async () => {
    await i18n.changeLanguage('pt')
    server.use(
      getPropertyCategoryControllerFindMockHandler([]),
      getPropertyCategoryControllerCountMockHandler({ count: 0 }),
    )
    renderAdmin(<Categorie />)

    const options = await openKindOptions('Nova categoria', 'Selecione o tipo')

    expect(options.map((option) => option.textContent)).toEqual(KIND_LABELS.pt)
  })
})

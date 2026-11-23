import { describe, expect, it } from 'vitest'
import { render, screen } from '@/test'
import { stripHtml } from '@/utils/stripHtml'
import { toLikePattern } from '@/utils/toLikePattern'

describe('T291 texto de busca com curingas', () => {
  it.each([
    ['%', '%\\%%'],
    ['_', '%\\_%'],
    ['\\', '%\\\\%'],
    ['50%_a\\b', '%50\\%\\_a\\\\b%'],
  ])('escapa %s', (term, expected) => {
    expect(toLikePattern(term)).toBe(expected)
  })

  it('remove espaços das pontas antes de montar o padrão', () => {
    expect(toLikePattern('  rossi  ')).toBe('%rossi%')
  })
})

describe('T292 HTML digitado em campo livre', () => {
  const payload = '<img src=x onerror="window.__xss = true"><script>window.__xss = true</script>'

  it('aparece como texto e não executa nada', () => {
    render(<p data-testid="note">{payload}</p>)

    expect(screen.getByTestId('note').textContent).toBe(payload)
    expect(screen.getByTestId('note').querySelector('img, script')).toBeNull()
    expect((window as Window & { __xss?: boolean }).__xss).toBeUndefined()
  })

  it('stripHtml remove as marcas e não executa scripts', () => {
    expect(stripHtml('<b>Ciao</b> <i>mondo</i>')).toBe('Ciao mondo')
    expect(stripHtml('<script>window.__xss = true</script>')).not.toContain('<')
    expect((window as Window & { __xss?: boolean }).__xss).toBeUndefined()
  })
})

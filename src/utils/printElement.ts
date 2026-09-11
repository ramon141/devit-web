// imprime só o conteúdo de um elemento, reaproveitando os estilos da página
export function printElement(element: HTMLElement) {
  const frame = document.createElement('iframe')
  frame.style.position = 'fixed'
  frame.style.right = '100%'
  frame.style.bottom = '100%'

  document.body.appendChild(frame)

  const doc = frame.contentDocument

  if (!doc) {
    frame.remove()
    return
  }

  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((node) => node.outerHTML)
    .join('')

  doc.open()
  doc.write(`<html><head>${styles}</head><body>${element.outerHTML}</body></html>`)
  doc.close()

  frame.contentWindow?.addEventListener('afterprint', () => frame.remove())

  // espera os estilos carregarem antes de abrir o diálogo
  frame.onload = () => {
    frame.contentWindow?.focus()
    frame.contentWindow?.print()
  }
}

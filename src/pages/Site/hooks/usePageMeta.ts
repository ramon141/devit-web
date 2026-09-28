import { useEffect } from 'react'

const SUFFIX = 'Devit Immobiliare'

function metaDescription() {
  let tag = document.head.querySelector<HTMLMetaElement>('meta[name="description"]')

  if (!tag) {
    tag = document.createElement('meta')
    tag.name = 'description'
    document.head.appendChild(tag)
  }

  return tag
}

// Título e descrição da aba por página; ao sair, devolve o que estava antes
export function usePageMeta(title: string | undefined, description?: string) {
  useEffect(() => {
    if (!title) return

    const previousTitle = document.title
    const tag = metaDescription()
    const previousDescription = tag.content

    document.title = `${title} | ${SUFFIX}`
    if (description) tag.content = description.slice(0, 300)

    return () => {
      document.title = previousTitle
      tag.content = previousDescription
    }
  }, [title, description])
}

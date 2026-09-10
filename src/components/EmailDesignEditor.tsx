import type { RefObject } from 'react'
import EmailEditor, { type EditorRef } from 'react-email-editor'

const EDITOR_LOCALE = 'it-IT'
const EDITOR_MIN_HEIGHT = '65vh'
const EDITOR_CUSTOM_CSS = ['.blockbuilder-branding { display: none !important; }']
// Medidas do rodapé de marca do painel lateral do Unlayer (1.468.0)
const BRANDING_WIDTH = 425
const BRANDING_HEIGHT = 50
const BRANDING_BACKGROUND = '#f9f9f9'

type UnlayerEditor = NonNullable<EditorRef['editor']>
type EmailDesign = Parameters<UnlayerEditor['loadDesign']>[0]

export type EmailEditorRef = RefObject<EditorRef | null>

export type EmailExport = {
  html: string
  design: string
}

// design é guardado serializado (string) no backend, no campo CommunicationTemplate.design
export function loadEmailDesign(editorRef: EmailEditorRef, design?: string | null) {
  const editor = editorRef.current?.editor

  if (!editor || !design) return

  editor.loadDesign(JSON.parse(design) as EmailDesign)
}

export function exportEmail(editorRef: EmailEditorRef): Promise<EmailExport | null> {
  const editor = editorRef.current?.editor

  if (!editor) return Promise.resolve(null)

  return new Promise((resolve) => {
    editor.exportHtml(({ html, design }) => {
      resolve({
        html,
        design: JSON.stringify(design),
      })
    })
  })
}

type EmailDesignEditorProps = {
  editorRef: EmailEditorRef
  design?: string | null
}

function EmailDesignEditor({ editorRef, design }: EmailDesignEditorProps) {
  return (
    <div className="relative">
      <EmailEditor
        ref={editorRef}
        minHeight={EDITOR_MIN_HEIGHT}
        options={{ locale: EDITOR_LOCALE, customCSS: EDITOR_CUSTOM_CSS }}
        onReady={() => loadEmailDesign(editorRef, design)}
      />

      {/* O editor roda em iframe de outro domínio, então o customCSS acima só vale
          com projeto Unlayer pago: essa faixa cobre o rodapé de marca do painel */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0"
        style={{ width: BRANDING_WIDTH, height: BRANDING_HEIGHT, background: BRANDING_BACKGROUND }}
      />
    </div>
  )
}

export default EmailDesignEditor

import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

type ModalRegisterProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  wide?: boolean
}

const DEFAULT_WIDTH_CLASS = 'w-full sm:max-w-full md:max-w-[700px]'
// Usado por conteúdos grandes (ex.: editor de e-mail)
const WIDE_WIDTH_CLASS = 'w-full sm:max-w-[95vw] max-h-[95vh] overflow-y-auto'

// Modal padrão pra telas de cadastro, com largura fixa (ou larga via `wide`)
function ModalRegister({
  open,
  onOpenChange,
  title,
  description,
  children,
  wide = false,
}: ModalRegisterProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={wide ? WIDE_WIDTH_CLASS : DEFAULT_WIDTH_CLASS}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="w-full">{children}</div>
      </DialogContent>
    </Dialog>
  )
}

export default ModalRegister

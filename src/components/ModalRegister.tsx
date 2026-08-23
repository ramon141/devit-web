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
}

// Modal padrão pra telas de cadastro, sempre com essa largura fixa
function ModalRegister({
  open,
  onOpenChange,
  title,
  description,
  children,
}: ModalRegisterProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-full md:max-w-[700px]">
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

import { ArrowLeftIcon } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

type NotFoundStateProps = {
  message: string
  backLabel: string
  backTo: string
}

function NotFoundState({ message, backLabel, backTo }: NotFoundStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>

      <Button variant="outline" nativeButton={false} render={<Link to={backTo} />}>
        <ArrowLeftIcon data-icon="inline-start" />
        {backLabel}
      </Button>
    </div>
  )
}

export default NotFoundState

import type { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type ComponentSectionProps = {
  id: string
  title: string
  description: string
  children: ReactNode
}

function ComponentSection({
  id,
  title,
  description,
  children,
}: ComponentSectionProps) {
  return (
    <Card id={id} className="scroll-mt-20">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
  )
}

export default ComponentSection

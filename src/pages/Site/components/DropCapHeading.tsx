import { cn } from '@/lib/utils'

type DropCapHeadingProps = {
  text: string
  as?: 'h1' | 'h2'
  className?: string
}

// Replica lo stile del sito originale: prima lettera in corsivo serif, resto in sans-serif
function DropCapHeading({ text, as = 'h2', className }: DropCapHeadingProps) {
  const Tag = as
  const firstLetter = text.charAt(0)
  const rest = text.slice(1)

  return (
    <Tag className={cn('font-heading', className)}>
      <span className="mr-0.5 font-serif text-[1.3em] italic" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
        {firstLetter}
      </span>
      {rest}
    </Tag>
  )
}

export default DropCapHeading

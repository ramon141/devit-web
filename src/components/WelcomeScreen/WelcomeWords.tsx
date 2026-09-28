type WelcomeWordsProps = {
  words: string[]
  visibleCount: number
}

function WelcomeWords({ words, visibleCount }: WelcomeWordsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-center">
      {words.map((word, index) => {
        const isLastWord = index === words.length - 1

        return (
          <span
            key={`${word}-${index}`}
            className={`pb-2 text-3xl font-bold opacity-0 sm:text-4xl md:text-5xl ${
              index < visibleCount ? 'animate-[wlc-word-in_0.5s_cubic-bezier(0.25,0.4,0.25,1)_forwards]' : ''
            } ${isLastWord ? 'bg-gradient-to-r from-primary via-amber-400 to-primary bg-clip-text text-transparent' : 'text-foreground'}`}
          >
            {word}
          </span>
        )
      })}
    </div>
  )
}

export default WelcomeWords

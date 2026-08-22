import devitFavicon from '@/assets/logos/devit-favicon.png'
import WaveBackground from '@/pages/Login/components/WaveBackground'

function LoginPanel() {
  return (
    <div className="relative flex min-h-[38dvh] flex-col items-center justify-center overflow-hidden bg-sidebar px-6 py-10 md:min-h-0 md:w-[46%] md:shrink-0 md:px-10 md:py-14">
      <WaveBackground />

      <div className="relative z-10 flex flex-col items-center text-center">
        <img
          src={devitFavicon}
          alt="Devit"
          className="mb-4 size-12 rounded-2xl md:mb-6 md:size-16"
        />
        <p className="mb-1 text-sm font-normal text-sidebar-foreground/70 md:text-base">
          Bentornato su
        </p>
        <h1 className="mb-3 text-2xl font-semibold tracking-wide text-sidebar-foreground md:mb-5 md:text-3xl">
          Devit
        </h1>
        <p className="hidden max-w-[220px] text-sm leading-relaxed text-sidebar-foreground/50 md:block">
          Gestisci le tue proprietà in modo semplice ed efficiente
        </p>
      </div>
    </div>
  )
}

export default LoginPanel

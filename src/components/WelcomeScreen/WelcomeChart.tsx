const HOUSE = 'M40,150 L40,90 L100,35 L160,90 L160,150 Z'
const DOOR = 'M85,150 L85,105 L115,105 L115,150'
const GROUND = 'M20,150 L180,150 L180,160 L20,160 Z'
const WINDOWS = [
  { x: 54, y: 100, delay: 0.3 },
  { x: 128, y: 100, delay: 0.5 },
]

function WelcomeChart() {
  return (
    <div className="animate-[wlc-card-in_0.5s_cubic-bezier(0.34,1.56,0.64,1)_forwards] rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b0b0b] to-[#1c1c1c] p-6 opacity-0 shadow-2xl shadow-primary/20">
      <svg width="240" height="170" viewBox="0 0 200 170" fill="none" className="overflow-visible">
        <defs>
          <linearGradient id="wlcGround" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--devit-yellow)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--devit-yellow)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wlcHouseStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="60%" stopColor="var(--devit-yellow)" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        <path
          d={GROUND}
          fill="url(#wlcGround)"
          className="animate-[wlc-fade-in_0.8s_ease-out_forwards]"
          style={{ animationDelay: '1s', opacity: 0 }}
        />

        {WINDOWS.map((w) => (
          <rect
            key={w.x}
            x={w.x}
            y={w.y}
            width="18"
            height="18"
            rx="2"
            fill="rgba(250,204,21,0.35)"
            className="origin-center animate-[wlc-bar-grow_0.5s_ease-out_forwards]"
            style={{ transformBox: 'fill-box', animationDelay: `${w.delay}s`, transform: 'scaleY(0)' }}
          />
        ))}

        <path
          d={HOUSE}
          stroke="url(#wlcHouseStroke)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          className="animate-[wlc-draw-line_1.4s_ease-in-out_forwards]"
          style={{ strokeDashoffset: 1 }}
        />

        <path
          d={DOOR}
          stroke="url(#wlcHouseStroke)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          className="animate-[wlc-draw-line_0.6s_ease-in-out_forwards]"
          style={{ strokeDashoffset: 1, animationDelay: '1.1s' }}
        />

        <circle
          cx="108"
          cy="128"
          r="7"
          fill="var(--devit-yellow)"
          className="animate-[wlc-dot-pulse_1.6s_ease-in-out_1.7s_infinite]"
          style={{ transformOrigin: '108px 128px', opacity: 0 }}
        />
        <circle
          cx="108"
          cy="128"
          r="3.5"
          fill="var(--devit-yellow)"
          className="animate-[wlc-dot-in_0.4s_ease-out_forwards]"
          style={{ transformOrigin: '108px 128px', animationDelay: '1.6s', opacity: 0 }}
        />
      </svg>
    </div>
  )
}

export default WelcomeChart

const WAVE_PATH_1 =
  'M144 0c40 60 55 340-55 420-70 55-70 100 65 180l1286 0 0-600z'
const WAVE_PATH_2 =
  'M196 0c40 55 50 300-50 380-65 50-65 110 60 220l1234 0 0-600z'

function WaveBackground() {
  return (
    <svg
      viewBox="0 0 1440 600"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 size-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="devit-login-wave-0" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a3a66" stopOpacity="1" />
          <stop offset="100%" stopColor="#004274" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="devit-login-wave-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a3a66" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#004274" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      <path d={WAVE_PATH_1} fill="url(#devit-login-wave-0)" transform="scale(-1,1) translate(-1440,0)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,-15; 0,0"
          dur="4400ms"
          repeatCount="indefinite"
          additive="sum"
        />
      </path>

      <path d={WAVE_PATH_2} fill="url(#devit-login-wave-1)" fillOpacity="0.85" transform="scale(-1,1) translate(-1440,0)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,-15; 0,0"
          dur="4400ms"
          begin="880ms"
          repeatCount="indefinite"
          additive="sum"
        />
      </path>
    </svg>
  )
}

export default WaveBackground

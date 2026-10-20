/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BASE_API_URL: string
  readonly VITE_TURNSTILE_SITE_KEY?: string
  readonly VITE_APP_METRICS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

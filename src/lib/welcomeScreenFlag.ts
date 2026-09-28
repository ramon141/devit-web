const WELCOME_SESSION_KEY = 'devit:show-welcome-screen'

export function markWelcomeScreenPending() {
  sessionStorage.setItem(WELCOME_SESSION_KEY, '1')
}

export function consumeWelcomeScreenPending(): boolean {
  const isPending = sessionStorage.getItem(WELCOME_SESSION_KEY) === '1'

  if (isPending) sessionStorage.removeItem(WELCOME_SESSION_KEY)

  return isPending
}

export function stripHtml(html: string): string {
  const parsed = new DOMParser().parseFromString(html, 'text/html')

  return (parsed.body.textContent ?? '').replace(/\s+/g, ' ').trim()
}

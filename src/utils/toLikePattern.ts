export function toLikePattern(term: string): string {
  const escaped = term.trim().replace(/[\\%_]/g, (char) => `\\${char}`)

  return `%${escaped}%`
}

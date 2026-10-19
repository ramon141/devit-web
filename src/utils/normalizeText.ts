// Minúsculas e sem acentos, pra comparar textos digitados pelo usuário
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

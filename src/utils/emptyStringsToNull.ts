// Converte campos string vazios em null antes de enviar pra API
// (o devit-api rejeita string vazia em campos de formato como data, mas aceita null)
export function emptyStringsToNull<T extends object>(values: T): T {
  const result = { ...values }

  for (const key of Object.keys(result) as Array<keyof T>) {
    if (result[key] === '') {
      result[key] = null as T[typeof key]
    }
  }

  return result
}

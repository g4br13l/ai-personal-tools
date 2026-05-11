


export function strToDate(value: string | undefined | null) {
  return value && value !== 'Not found'
    ? new Date(value)
    : null
}

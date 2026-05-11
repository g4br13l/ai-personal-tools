

export function timeUtils() {

  function secToSrtTimestamp(sec: number) {
    const clamped = Math.max(0, sec)
    const totalMs = Math.round(clamped * 1000)
    const h = Math.floor(totalMs / 3600000)
    const m = Math.floor((totalMs % 3600000) / 60000)
    const s = Math.floor((totalMs % 60000) / 1000)
    const ms = totalMs % 1000
    return (
      `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},` +
      `${String(ms).padStart(3, '0')}`
    )
  }


  return { secToSrtTimestamp }
}

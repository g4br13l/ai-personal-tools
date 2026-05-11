import { useEffect, useState } from 'react'



export const useInputReady = (delayMs = 50) => {
  const [isInputReady, setIsInputReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInputReady(true)
    }, delayMs)

    return () => clearTimeout(timer)
  }, [delayMs])

  return isInputReady
}

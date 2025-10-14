import { useState, useEffect } from "react"

export const useLoading = (isLoading: boolean, delay = 100) => {
  const [showLoader, setShowLoader] = useState(false)
  const [isMounted, setIsMounted] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

  useEffect(() => {
    let timeoutId: number

    if (isLoading) {
      timeoutId = setTimeout(() => {
        if (isMounted) setShowLoader(true)
      }, delay)
    } else {
      setShowLoader(false)
    }

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isLoading, delay, isMounted])

  return showLoader
}

import { useLayoutEffect } from 'react'

export const useScrollTop = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])
}

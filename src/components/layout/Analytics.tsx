import { useEffect, useRef } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { trackPageview } from '~/lib/analytics'

/** Reports client-side route changes to GoatCounter; the first page load is counted by the script. */
export function Analytics() {
  const path = useRouterState({ select: (s) => s.location.pathname })
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    trackPageview(path)
  }, [path])
  return null
}

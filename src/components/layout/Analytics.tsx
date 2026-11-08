import { useEffect, useRef } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { trackPageview, trackVisitPlace } from '~/lib/analytics'

/** Reports client-side route changes to GoatCounter (the script counts the first load) and the visitor's city once per session. */
export function Analytics() {
  const path = useRouterState({ select: (s) => s.location.pathname })
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      trackVisitPlace()
    } else {
      // The title at this point is usually still the previous page's.
      trackPageview(path, document.title)
    }
  }, [path])
  return null
}

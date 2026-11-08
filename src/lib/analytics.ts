// GoatCounter: cookie-free visitor stats (country, city, referrer, device). It ignores localhost.
export const GOATCOUNTER_ENDPOINT = 'https://arjunsharma.goatcounter.com/count'

type GoatCounter = { count?: (vars: { path: string; title?: string; event?: boolean }) => void }

const gc = () => (typeof window === 'undefined' ? undefined : (window as Window & { goatcounter?: GoatCounter }).goatcounter)

/** Counts a page view after a client-side navigation (the script counts the first load itself). */
export function trackPageview(path: string) {
  gc()?.count?.({ path })
}

/** Counts a named event, such as a resume download, shown separately from page views in the dashboard. */
export function trackEvent(name: string, title = name) {
  gc()?.count?.({ path: name, title, event: true })
}

// GoatCounter: cookie-free visitor stats (country, region, referrer, device). It ignores localhost.
export const GOATCOUNTER_ENDPOINT = 'https://arjunsharma.goatcounter.com/count'

// GoatCounter stops at country and region, so the city comes from GeoJS (free, no key) and is sent
// to GoatCounter as an event. The visitor's browser asks GeoJS once per session.
const GEO_URL = 'https://get.geojs.io/v1/ip/geo.json'
const PLACE_KEY = 'gc-place'
const VISIT_KEY = 'gc-place-counted'

type GoatCounter = { count?: (vars: { path: string; title?: string; event?: boolean }) => void }

const gc = () => (typeof window === 'undefined' ? undefined : (window as Window & { goatcounter?: GoatCounter }).goatcounter)

const session = {
  get: (k: string) => {
    try {
      return sessionStorage.getItem(k)
    } catch {
      return null
    }
  },
  set: (k: string, v: string) => {
    try {
      sessionStorage.setItem(k, v)
    } catch {
      /* private mode: just look it up again next time */
    }
  },
}

let placeRequest: Promise<string | null> | undefined

/** "City, Region, Country" for this visitor, or null if the lookup fails or is blocked. */
function place(): Promise<string | null> {
  const cached = session.get(PLACE_KEY)
  if (cached) return Promise.resolve(cached)
  placeRequest ??= fetch(GEO_URL)
    .then((r) => (r.ok ? r.json() : null))
    .then((d: { city?: string; region?: string; country?: string } | null) => {
      const label = d ? [d.city, d.region, d.country].filter(Boolean).join(', ') : ''
      if (!label) return null
      session.set(PLACE_KEY, label)
      return label
    })
    .catch(() => null)
  return placeRequest
}

/** Waits for count.js, which loads async. */
function whenReady(fn: (g: Required<GoatCounter>) => void, tries = 40) {
  const g = gc()
  if (g?.count) return fn(g as Required<GoatCounter>)
  if (tries > 0) setTimeout(() => whenReady(fn, tries - 1), 250)
}

/** Counts a page view after a client-side navigation (the script counts the first load itself). */
export function trackPageview(path: string, previousTitle: string) {
  // The new page's <title> lands a moment after the route changes; wait for it (up to 1s) so the
  // view isn't recorded under the previous page's title.
  let tries = 20
  const send = () => {
    if (document.title === previousTitle && tries-- > 0) return void setTimeout(send, 50)
    gc()?.count?.({ path, title: document.title })
  }
  send()
}

/** Records the visitor's city once per session, as an event named after the place. */
export function trackVisitPlace() {
  if (session.get(VISIT_KEY)) return
  place().then((p) => {
    if (!p) return
    whenReady((g) => {
      g.count({ path: `visit · ${p}`, title: `Visit from ${p}`, event: true })
      session.set(VISIT_KEY, '1')
    })
  })
}

/** Counts a named event, such as a resume download, with the visitor's city when it is known. */
export function trackEvent(name: string, title = name) {
  const p = session.get(PLACE_KEY)
  gc()?.count?.({ path: p ? `${name} · ${p}` : name, title: p ? `${title} from ${p}` : title, event: true })
}

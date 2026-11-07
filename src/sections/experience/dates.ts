const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Months since year 0, counting the end month as worked (so Jul–Sep is 3). */
export const toIndex = (ym: string) => {
  const [y, m] = ym.split('-').map(Number)
  return y * 12 + (m - 1)
}

export const formatMonth = (ym: string) => {
  const [y, m] = ym.split('-').map(Number)
  return `${MONTHS[m - 1]} ${y}`
}

export const duration = (start: string, end: string) => {
  const n = toIndex(end) - toIndex(start) + 1
  const y = Math.floor(n / 12)
  const m = n % 12
  return [y && `${y} yr${y > 1 ? 's' : ''}`, m && `${m} mo${m > 1 ? 's' : ''}`].filter(Boolean).join(' ')
}

import { createFileRoute } from '@tanstack/react-router'
import { Nav, SkipLink } from '~/components/layout'
import { getProject, projectHead } from '~/lib/projectHead'
import { Contact } from '~/sections/contact/Contact'
import { ReductxnPage } from '~/sections/reductxn/ReductxnPage'

// Its own route, so each page's visuals ship in their own chunk.
export const Route = createFileRoute('/work/reductxn')({
  head: () => projectHead('reductxn'),
  component: Page,
})

function Page() {
  return (
    <>
      <SkipLink />
      <Nav />
      <main id="main">
        <ReductxnPage project={getProject('reductxn')} />
        <Contact />
      </main>
    </>
  )
}

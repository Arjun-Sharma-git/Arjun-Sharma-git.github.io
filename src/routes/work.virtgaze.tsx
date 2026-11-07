import { createFileRoute } from '@tanstack/react-router'
import { Nav, SkipLink } from '~/components/layout'
import { getProject, projectHead } from '~/lib/projectHead'
import { Contact } from '~/sections/contact/Contact'
import { VirtGazePage } from '~/sections/virtgaze/VirtGazePage'

// Its own route, so each page's visuals ship in their own chunk.
export const Route = createFileRoute('/work/virtgaze')({
  head: () => projectHead('virtgaze'),
  component: Page,
})

function Page() {
  return (
    <>
      <SkipLink />
      <Nav />
      <main id="main">
        <VirtGazePage project={getProject('virtgaze')} />
        <Contact />
      </main>
    </>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { Nav, SkipLink } from '~/components/layout'
import { getProject, projectHead } from '~/lib/projectHead'
import { Contact } from '~/sections/contact/Contact'
import { SentinelPage } from '~/sections/sentinel/SentinelPage'

// Its own route, so each page's visuals ship in their own chunk.
export const Route = createFileRoute('/work/sentinel-vault')({
  head: () => projectHead('sentinel-vault'),
  component: Page,
})

function Page() {
  return (
    <>
      <SkipLink />
      <Nav />
      <main id="main">
        <SentinelPage project={getProject('sentinel-vault')} />
        <Contact />
      </main>
    </>
  )
}

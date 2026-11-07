import { createFileRoute } from '@tanstack/react-router'
import { Nav, SkipLink } from '~/components/layout'
import { getProject, proofHead } from '~/lib/projectHead'
import { Contact } from '~/sections/contact/Contact'
import { ProofPage } from '~/sections/reductxn/ProofPage'

export const Route = createFileRoute('/work/reductxn_/proof')({
  head: () => proofHead('reductxn'),
  component: Page,
})

function Page() {
  return (
    <>
      <SkipLink />
      <Nav />
      <main id="main">
        <ProofPage project={getProject('reductxn')} />
        <Contact />
      </main>
    </>
  )
}

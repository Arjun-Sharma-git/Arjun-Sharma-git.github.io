import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '~/components/layout'

// Prerendered to /404.html, which GitHub Pages serves (with a 404 status) for unknown URLs.
// No route-specific head: the client hydrates that file as the root notFoundComponent, so markup must match.
export const Route = createFileRoute('/404')({
  component: NotFound,
})

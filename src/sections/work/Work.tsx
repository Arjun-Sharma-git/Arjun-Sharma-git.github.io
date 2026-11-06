import { useRef } from 'react'
import { sectionIds } from '~/config/navigation'
import { projects } from '~/content'
import { SectionHeading } from '~/components/ui'
import { useScrollReveal } from '~/hooks/useScrollReveal'
import { ProjectCard } from './ProjectCard'

export function Work() {
  const scope = useRef<HTMLElement>(null)
  useScrollReveal(scope)

  return (
    <section ref={scope} id={sectionIds.work} className="px-4 py-24 sm:py-32">
      <SectionHeading eyebrow="Selected work" title="Two systems," accent="built in depth.">
        One reads your eyes through a webcam. The other settles a group's debts in the fewest possible transfers.
      </SectionHeading>
      <div className="mx-auto mt-14 grid max-w-6xl gap-5 lg:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  )
}

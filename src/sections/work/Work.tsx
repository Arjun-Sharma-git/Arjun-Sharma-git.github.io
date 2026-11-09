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
      <SectionHeading eyebrow="Selected work" title="Three systems," accent="built in depth.">
        One reads your eyes through a webcam. One settles a group's debts in the fewest possible transfers. One answers
        questions from company documents, only from what each person may read.
      </SectionHeading>
      <div className="mx-auto mt-14 grid max-w-6xl gap-5 lg:grid-cols-2">
        {projects.map((p, i) => (
          // An odd last card spans the row instead of leaving a hole beside it.
          <div key={p.slug} className={i === projects.length - 1 && projects.length % 2 ? 'lg:col-span-2' : undefined}>
            <ProjectCard project={p} />
          </div>
        ))}
      </div>
    </section>
  )
}

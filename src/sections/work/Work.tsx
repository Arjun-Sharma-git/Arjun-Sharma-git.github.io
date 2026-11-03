import { useRef } from 'react'
import { sectionIds } from '~/config/navigation'
import { projects } from '~/content'
import { SectionHeading } from '~/components/ui'
import { useScrollReveal } from '~/hooks/useScrollReveal'
import { ProjectCard } from './ProjectCard'
import { useHorizontalScroll } from './useHorizontalScroll'

export function Work() {
  const scope = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  useScrollReveal(scope)
  useHorizontalScroll(scope, pin, track)

  return (
    <section ref={scope} id={sectionIds.work} className="overflow-hidden py-24 sm:py-32">
      <div className="px-4">
        <SectionHeading eyebrow="Selected work" title="Things I've" accent="built & shipped.">
          From a webcam gaze tracker to full-stack web apps in production.
        </SectionHeading>
      </div>
      <div ref={pin} className="mt-14">
        <div ref={track} className="flex flex-col gap-5 px-4 lg:w-max lg:flex-row lg:px-8">
          {projects.map((p) => (
            <ProjectCard key={p.name} project={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

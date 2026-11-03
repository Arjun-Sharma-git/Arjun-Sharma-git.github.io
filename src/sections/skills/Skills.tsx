import { useRef, useState } from 'react'
import { sectionIds } from '~/config/navigation'
import { skillGroups } from '~/content'
import { SectionHeading } from '~/components/ui'
import { useScrollReveal } from '~/hooks/useScrollReveal'
import { SkillPanel } from './SkillPanel'
import { SkillTabs } from './SkillTabs'

export function Skills() {
  const scope = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  useScrollReveal(scope)

  return (
    <section ref={scope} id={sectionIds.skills} className="px-4 py-24 sm:py-32">
      <SectionHeading eyebrow="Skills" title="Everything from pixels" accent="to production.">
        Drawn from what I've actually built on GitHub, not a list of buzzwords.
      </SectionHeading>
      <div data-reveal className="mx-auto mt-14 max-w-5xl">
        <SkillTabs groups={skillGroups} active={active} onSelect={setActive} />
        <SkillPanel group={skillGroups[active]} />
      </div>
    </section>
  )
}

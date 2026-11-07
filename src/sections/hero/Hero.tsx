import { useRef, useState } from 'react'
import { sectionIds } from '~/config/navigation'
import { profile } from '~/content'
import { ExternalLink } from '~/components/ui'
import { usePointerFollow } from '~/hooks/usePointerFollow'
import { GazeOrb } from './GazeOrb'
import { HeroScene } from './HeroScene'
import type { GazeScene } from './scene/gazeScene'
import { useHeroAnimation } from './useHeroAnimation'
import { useHeroScroll } from './useHeroScroll'

const headline = [
  ['I', 'build', 'software', 'that'],
  ['sees,', 'ships', 'and', 'scales.'],
]

export function Hero() {
  const scope = useRef<HTMLElement>(null)
  const [scene, setScene] = useState<GazeScene | null>(null)
  useHeroAnimation(scope)
  useHeroScroll(scope, scene)
  usePointerFollow(scope, '.pupil')

  return (
    <section ref={scope} id={sectionIds.top} className="relative motion-safe:h-[200svh]">
      <div className="top-0 px-3 pt-3 motion-safe:sticky sm:px-4 sm:pt-4">
        <div className="hero-card grid-bg relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden rounded-[28px] bg-gradient-to-b from-[#efe4d1] to-paper px-5 pb-16 pt-32 text-center">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgb(162_122_69/0.22),transparent_70%)]" />
          <HeroScene onReady={setScene} />
          <div className="eye-zoom pointer-events-none absolute inset-0">
            <GazeOrb hidden={!!scene} />
          </div>

          <div className="hero-content relative flex flex-col items-center">
            <h1 className="relative font-serif text-[clamp(2.9rem,9vw,7.5rem)] leading-[0.95] tracking-tight">
              <span className="sr-only">
                {profile.name}, {profile.role}.{' '}
              </span>
              {headline.map((line, i) => (
                <span key={i} aria-hidden className={`block ${i === 1 ? 'italic text-gold' : ''}`}>
                  {line.map((word) => (
                    <span key={word} className="hero-word inline-block overflow-hidden pb-[0.08em] align-bottom">
                      <span className="inline-block">{word}&nbsp;</span>
                    </span>
                  ))}
                </span>
              ))}
            </h1>

            <p className="relative mt-8 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
              I'm <strong className="font-semibold text-ink">{profile.name}</strong>, {profile.summary}
            </p>

            <div data-hero-fade className="relative mt-10 flex flex-wrap items-center justify-center gap-3">
              <a href={`#${sectionIds.work}`} className="group inline-flex items-center gap-3 rounded-full bg-ink py-2 pl-5 pr-2 text-sm font-medium text-paper">
                See selected work
                <span className="grid size-7 place-items-center rounded-full bg-paper/15 transition-transform group-hover:translate-x-0.5">→</span>
              </a>
              <ExternalLink
                href={profile.links.github}
                className="rounded-full border border-line bg-paper/70 px-5 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-ink"
              >
                GitHub profile
              </ExternalLink>
              {profile.links.resume && (
                <ExternalLink
                  href={profile.links.resume}
                  className="rounded-full border border-line bg-paper/70 px-5 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-ink"
                >
                  Download resume
                </ExternalLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

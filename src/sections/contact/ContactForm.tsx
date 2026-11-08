import { useState, type FormEvent } from 'react'
import { profile } from '~/content'
import { trackEvent } from '~/lib/analytics'

const field =
  'w-full rounded-2xl border border-paper/15 bg-paper/5 px-4 py-3 text-paper placeholder:text-paper/35 outline-none transition-colors focus:border-gold focus:bg-paper/10'

/** Builds a pre-filled email and opens it in the visitor's own mail app. No third party involved. */
function mailtoFor(name: string, email: string, message: string) {
  const subject = `Portfolio message from ${name}`
  const body = `${message}\n\n${name}\n${email}`
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function ContactForm() {
  const [opened, setOpened] = useState<string | null>(null)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const href = mailtoFor(String(data.get('name')), String(data.get('email')), String(data.get('message')))
    trackEvent('contact-send', 'Contact form sent')
    window.location.href = href
    setOpened(href)
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 text-left" aria-label="Message me">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-paper/70">
          Name
          <input name="name" required autoComplete="name" maxLength={100} className={field} placeholder="Your name" />
        </label>
        <label className="grid gap-2 text-sm text-paper/70">
          Email
          <input name="email" type="email" required autoComplete="email" maxLength={200} className={field} placeholder="you@example.com" />
        </label>
      </div>
      <label className="grid gap-2 text-sm text-paper/70">
        Message
        <textarea name="message" required rows={5} maxLength={1500} className={`${field} resize-y`} placeholder="What are you working on?" />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition-transform hover:scale-[1.03] sm:text-base"
        >
          Send
        </button>
        <p aria-live="polite" className="text-sm text-paper/60">
          {opened && (
            <>
              Your email app should open with the message ready to send. Nothing opened?{' '}
              <a className="text-gold underline underline-offset-4" href={opened}>
                Try again
              </a>{' '}
              or write to {profile.email}.
            </>
          )}
        </p>
      </div>
    </form>
  )
}

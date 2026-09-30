import { ArrowRight, CalendarCheck, HeartHandshake, TrendingUp } from 'lucide-react'

const BENEFITS = [
  {
    icon: TrendingUp,
    title: 'Reach engaged couples',
    body: 'Get discovered by couples actively searching for rustic venues across Ontario.',
  },
  {
    icon: CalendarCheck,
    title: 'Direct inquiries',
    body: 'Enquiries land straight in your inbox — no middleman, no booking commissions.',
  },
  {
    icon: HeartHandshake,
    title: 'Local, niche & trusted',
    body: 'A curated directory built exclusively for barns, farms and greenhouses.',
  },
]

export function ListWithUs() {
  return (
    <section id="list-with-us" className="scroll-mt-20 px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-2xl bg-primary text-primary-foreground lg:grid-cols-[1.1fr_1fr]">
        <div className="p-8 sm:p-12 lg:p-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[oklch(0.82_0.08_75)]">
            For Ontario venue owners
          </p>
          <h2 className="mt-3 text-balance font-serif text-4xl font-semibold leading-tight sm:text-5xl">
            Why List With Us
          </h2>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-primary-foreground/80">
            Own a barn, farm or greenhouse that deserves to host unforgettable celebrations? Join
            the province&apos;s dedicated rustic wedding directory and fill your calendar with the
            couples who are looking for exactly what you offer.
          </p>

          <ul className="mt-8 grid gap-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <li key={title}>
                <span className="flex size-10 items-center justify-center rounded-full bg-primary-foreground/10 text-[oklch(0.82_0.08_75)]">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-primary-foreground/70">{body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="/submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Submit Your Venue
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="/claim"
              className="inline-flex h-12 items-center justify-center rounded-full border border-primary-foreground/30 px-7 text-sm font-semibold transition-colors hover:bg-primary-foreground/10"
            >
              Claim an Existing Listing
            </a>
          </div>
        </div>

        <div
          className="min-h-72 bg-cover bg-center lg:min-h-full"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80)',
          }}
          role="img"
          aria-label="Open barn doors looking out over an Ontario farm field at golden hour"
        />
      </div>
    </section>
  )
}

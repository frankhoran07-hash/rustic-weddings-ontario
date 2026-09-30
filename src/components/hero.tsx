import { VenueSearch } from '@/components/venue-search'

type HeroProps = {
  q?: string
  region?: string
  type?: string
}

export function Hero({ q, region, type }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=2000&q=80"
        alt=""
        className="absolute inset-0 -z-20 size-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(0.2_0.03_150/0.55)] via-[oklch(0.2_0.03_150/0.45)] to-[oklch(0.18_0.02_60/0.8)]"
      />

      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 pb-20 pt-24 text-center sm:px-6 sm:pt-32 lg:px-8 lg:pb-28 lg:pt-40">
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.3em] text-[oklch(0.9_0.05_80)]">
          Ontario&apos;s rustic wedding directory
        </p>
        <h1 className="max-w-4xl text-balance font-serif text-4xl font-semibold leading-[1.05] text-[oklch(0.97_0.014_85)] sm:text-6xl lg:text-7xl">
          Discover Ontario&apos;s Most Charming Rustic Wedding Venues
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-[oklch(0.93_0.02_85)] sm:text-lg">
          From heritage barns in the Ottawa Valley to vineyard farms in the County, find a
          one-of-a-kind setting for your day — hand-picked, locally loved and ready to book.
        </p>

        <div className="mt-10 w-full max-w-4xl">
          <VenueSearch defaultQuery={q} defaultRegion={region} defaultType={type} />
        </div>
      </div>
    </section>
  )
}

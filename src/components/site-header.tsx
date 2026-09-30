import { Menu, Wheat } from 'lucide-react'

const NAV_LINKS = [
  { href: '#featured', label: 'Venues' },
  { href: '#regions', label: 'Regions' },
  { href: '#list-with-us', label: 'Claim a Listing' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2 text-primary">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Wheat className="size-5" aria-hidden="true" />
          </span>
          <span className="font-serif text-xl font-semibold leading-none tracking-tight text-foreground sm:text-2xl">
            Rustic Weddings <span className="text-primary">Ontario</span>
          </span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#list-with-us"
            className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Submit Venue
          </a>
          <details className="relative md:hidden">
            <summary
              className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full border border-border text-foreground [&::-webkit-details-marker]:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" aria-hidden="true" />
            </summary>
            <nav
              aria-label="Mobile"
              className="absolute right-0 top-12 flex w-48 flex-col rounded-lg border border-border bg-card p-2 shadow-lg"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}

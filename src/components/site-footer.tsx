import { Wheat } from 'lucide-react'
import { REGIONS } from '@/lib/venues'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr] lg:px-8">
        <div>
          <a href="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Wheat className="size-5" aria-hidden="true" />
            </span>
            <span className="font-serif text-2xl font-semibold">Rustic Weddings Ontario</span>
          </a>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            A curated directory of barn, farm and greenhouse wedding venues across Ontario.
          </p>
        </div>

        <nav aria-label="Regions">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">Regions</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {REGIONS.map((region) => (
              <li key={region}>
                <a
                  href={`/?region=${encodeURIComponent(region)}#featured`}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {region}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Venue owners">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">Venue Owners</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/submit" className="text-muted-foreground transition-colors hover:text-primary">
                Submit a Venue
              </a>
            </li>
            <li>
              <a href="/claim" className="text-muted-foreground transition-colors hover:text-primary">
                Claim a Listing
              </a>
            </li>
            <li>
              <a
                href="mailto:hello@rusticweddingsontario.ca"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} RusticWeddingsOntario.ca. Made with care in Ontario.
        </p>
      </div>
    </footer>
  )
}

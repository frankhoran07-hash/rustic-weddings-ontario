import { REGIONS, VENUE_TYPES } from '@/lib/venues'
import { Button } from '@/components/button'

type VenueSearchProps = {
  defaultQuery?: string
  defaultRegion?: string
  defaultType?: string
}

export function VenueSearch({ defaultQuery, defaultRegion, defaultType }: VenueSearchProps) {
  return (
    <form
      action="/#featured"
      method="get"
      className="grid gap-3 rounded-2xl bg-background/95 p-4 text-left shadow-lg ring-1 ring-border backdrop-blur sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:p-3"
    >
      <label className="flex flex-col gap-1">
        <span className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Search
        </span>
        <input
          name="q"
          type="search"
          defaultValue={defaultQuery}
          placeholder="Barn, farm, greenhouse…"
          className="h-11 rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-ring"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Region
        </span>
        <select
          name="region"
          defaultValue={defaultRegion ?? ''}
          className="h-11 rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-ring"
        >
          <option value="">All regions</option>
          {REGIONS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Type
        </span>
        <select
          name="type"
          defaultValue={defaultType ?? ''}
          className="h-11 rounded-xl border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-ring"
        >
          <option value="">All types</option>
          {VENUE_TYPES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-end">
        <Button className="h-11 w-full rounded-xl lg:w-auto">Find venues</Button>
      </div>
    </form>
  )
}

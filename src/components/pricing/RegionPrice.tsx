import { CountUp } from "@/components/ui/CountUp";
import { formatPrice, regionList, type RegionalPrice } from "@/data/pricing";

/**
 * A package's "from" price in both currencies, one per [data-show] span; the
 * CSS in globals.css shows the visitor's. Rendered on the server, so the page
 * stays static and a visitor without JavaScript sees the international price.
 */
export function RegionPrice({ price }: { price: RegionalPrice }) {
  return (
    <>
      {regionList.map((region) => {
        const formatted = formatPrice(price[region], region);
        return (
          <span key={region} data-show={region}>
            {formatted ? <CountUp value={formatted} /> : <span className="text-sm">Quote on request</span>}
          </span>
        );
      })}
    </>
  );
}

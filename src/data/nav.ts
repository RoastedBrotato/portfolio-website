import { NavLink } from "@/types";

/*
 * Primary nav: the pages that sell, the reviews that back them up, and the
 * blog, which gets posted to often enough that readers should reach it in one
 * click. Lab lives in the footer and on /about, and comes back here once it has
 * three or more real entries, so an ad visitor never lands on an empty page.
 */
export const navLinks: NavLink[] = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Reviews", href: "/reviews" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

import { NavLink } from "@/types";

/*
 * Primary nav: only pages that sell. Lab, Reviews and Blog live in the footer
 * and on /about. Lab and Reviews come back here once each has three or more
 * real entries, so an ad visitor never lands on an empty page from the nav.
 */
export const navLinks: NavLink[] = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

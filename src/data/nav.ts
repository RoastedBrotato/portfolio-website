import { NavLink } from "@/types";

/*
 * Primary nav: the pages that sell, plus the blog, which gets posted to often
 * enough that readers should reach it in one click. Lab and Reviews live in the
 * footer and on /about, and come back here once each has three or more real
 * entries, so an ad visitor never lands on an empty page from the nav.
 */
export const navLinks: NavLink[] = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

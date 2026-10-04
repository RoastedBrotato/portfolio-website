import { ViewTransition } from "react";

/*
 * Page transitions. A template remounts on every navigation (a layout does
 * not), so this boundary exits with the old page and enters with the new one,
 * and the browser animates between the two snapshots. The `page` class is
 * styled in globals.css. Browsers without the View Transitions API just swap
 * pages, as before.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}

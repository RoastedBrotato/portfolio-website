import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  // A short list rather than every intrinsic element: React Three Fiber adds
  // its own (mesh, group…) to JSX.IntrinsicElements, which breaks the union.
  as?: "div" | "section" | "header" | "footer" | "nav" | "article";
}) {
  return <Tag className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</Tag>;
}

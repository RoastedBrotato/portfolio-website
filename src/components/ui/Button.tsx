import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary: "bg-accent text-accent-foreground hover:bg-accent-hover",
  secondary:
    "border border-border-strong bg-transparent text-foreground hover:border-foreground/40 hover:bg-background-elevated",
  ghost: "text-foreground-muted hover:text-foreground",
};

const sizeStyles: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-[3.25rem] px-7 text-base",
};

type BaseProps = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

/** Analytics hooks (see lib/analytics.ts) — passed straight through to the anchor. */
type DataAttributes = { [key: `data-${string}`]: string | undefined };

type ButtonAsLink = BaseProps &
  DataAttributes & {
    href: string;
    external?: boolean;
    onClick?: () => void;
  };

type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

/**
 * The one button. Primary is the red fill and is reserved for the ask
 * ("Start a project"); secondary is a hairline; ghost is a text link that
 * happens to sit in a button row. 150ms colour transitions, no movement.
 */
export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { children, variant = "primary", size = "md", className } = props;

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-[-0.01em] whitespace-nowrap transition-colors duration-150",
    "focus-visible:ring-accent focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, external, onClick } = props;
    const data = Object.fromEntries(
      Object.entries(props).filter(([key]) => key.startsWith("data-")),
    );
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          onClick={onClick}
          {...data}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={onClick} {...data}>
        {children}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    className: _c,
    href: _h,
    ...buttonProps
  } = props as ButtonAsButton;
  void _v;
  void _s;
  void _c;
  void _h;

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

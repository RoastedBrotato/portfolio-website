import Link from "next/link";
import { Magnetic } from "@/components/ui/Magnetic";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-foreground hover:bg-accent/90 shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset]",
  secondary:
    "bg-transparent text-foreground border border-border-strong hover:border-foreground-muted hover:bg-background-elevated",
  ghost: "bg-transparent text-foreground-muted hover:text-foreground",
};

const sizeStyles: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-base",
};

type BaseProps = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonAsLink = BaseProps & {
  href: string;
  external?: boolean;
  onClick?: () => void;
};

type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { children, variant = "primary", size = "md", className } = props;

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  // "w-full" needs to reach the wrapper too, or the magnetic span (inline-block, content-sized)
  // won't stretch to match a caller that expects the button to fill its container.
  const wrapperClassName = className?.includes("w-full") ? "w-full" : undefined;

  if ("href" in props && props.href) {
    const { href, external, onClick } = props;
    if (external) {
      return (
        <Magnetic className={wrapperClassName}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={classes}
            onClick={onClick}
          >
            {children}
          </a>
        </Magnetic>
      );
    }
    return (
      <Magnetic className={wrapperClassName}>
        <Link href={href} className={classes} onClick={onClick}>
          {children}
        </Link>
      </Magnetic>
    );
  }

  const { variant: _v, size: _s, className: _c, href: _h, ...buttonProps } =
    props as ButtonAsButton;
  void _v;
  void _s;
  void _c;
  void _h;

  return (
    <Magnetic className={wrapperClassName}>
      <button className={classes} {...buttonProps}>
        {children}
      </button>
    </Magnetic>
  );
}

import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/config";
import { trackAttrs } from "@/lib/analytics";

/**
 * "Book a call", pointed at siteConfig.bookingUrl. Renders nothing until that
 * is set — a button to nowhere is worse than one fewer button.
 */
export function BookCallButton({
  placement,
  variant = "secondary",
  size = "lg",
  className,
  onClick,
}: {
  /** Reported with the click, to tell the hero from the pricing page. */
  placement: string;
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
}) {
  if (!siteConfig.bookingUrl) return null;

  return (
    <Button
      href={siteConfig.bookingUrl}
      external
      variant={variant}
      size={size}
      className={className}
      onClick={onClick}
      {...trackAttrs("booking_click", placement)}
    >
      Book a call
      <CalendarDays size={16} />
    </Button>
  );
}

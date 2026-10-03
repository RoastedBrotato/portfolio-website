import { GithubIcon, InstagramIcon, LinkedinIcon, XIcon } from "@/components/ui/icons";
import { siteConfig } from "@/data/config";
import { trackAttrs } from "@/lib/analytics";

type Profile = {
  label: string;
  href: string;
  Icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
};

/* Client-facing order: the push is Instagram-first, so it leads. Profiles with
   no URL in siteConfig are dropped, so an empty slot never renders a dead icon. */
const profiles: Profile[] = (
  [
    { label: "Instagram", href: siteConfig.instagram, Icon: InstagramIcon },
    { label: "X", href: siteConfig.x, Icon: XIcon },
    { label: "LinkedIn", href: siteConfig.linkedin, Icon: LinkedinIcon },
    { label: "GitHub", href: siteConfig.github, Icon: GithubIcon },
  ] satisfies Profile[]
).filter((profile) => profile.href);

/** The social profile icons, each tracked as an outbound `social_click`. */
export function SocialLinks({
  linkClassName,
  iconClassName = "h-[18px] w-[18px]",
}: {
  linkClassName: string;
  iconClassName?: string;
}) {
  return (
    <>
      {profiles.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={linkClassName}
          {...trackAttrs("social_click", label)}
        >
          <Icon className={iconClassName} />
        </a>
      ))}
    </>
  );
}

import type { MDXComponents } from "mdx/types";
import type { Options as PrettyCodeOptions } from "rehype-pretty-code";

/**
 * Shiki runs at build time (blog pages are statically generated), so none of
 * this ships to the client. Both themes are emitted as CSS variables and
 * switched in globals.css off [data-theme] — see the `.prose pre` rules there.
 */
export const prettyCodeOptions: PrettyCodeOptions = {
  theme: { dark: "github-dark-default", light: "github-light-default" },
  // Stops empty lines collapsing to zero height inside a code block.
  keepBackground: false,
  defaultLang: "text",
};

/**
 * Markdown images render as a captioned figure: `![Caption text](/images/blog/…)`.
 * The alt doubles as the caption, so one line of Markdown gets you both.
 *
 * These are plain <img> rather than next/image on purpose — next/image needs
 * intrinsic dimensions, which would mean either hardcoding width/height in every
 * post or reading them off disk at build. Lazy loading covers the common case;
 * swap in next/image if a post ever has a heavy above-the-fold hero.
 */
function PostImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;

  return (
    <figure className="my-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? ""}
        loading="lazy"
        decoding="async"
        className="border-border-strong brutal w-full border-2"
      />
      {alt ? (
        <figcaption className="text-foreground-subtle mt-4 font-mono text-xs tracking-[0.08em] uppercase">
          {alt}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Anything in here is available to every post without an import. */
export const mdxComponents: MDXComponents = {
  img: PostImage,
  a: ({ href, children, ...props }) => {
    const external = href?.startsWith("http");
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      >
        {children}
      </a>
    );
  },
};

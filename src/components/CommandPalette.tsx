"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "cmdk";
import { FileText, Folder, Hash } from "lucide-react";
import { navLinks } from "@/data/nav";
import { projects } from "@/data/projects";
import { BlogPostMeta } from "@/types";
import { cn } from "@/lib/utils";

type CommandPaletteContextValue = { open: boolean; setOpen: (open: boolean) => void };
const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

/** Lets any component (e.g. a navbar search button) open the palette. */
export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) throw new Error("useCommandPalette must be used within CommandPaletteProvider");
  return ctx;
}

const groupHeadingClass = [
  "px-2",
  "pb-1.5",
  "pt-3",
  "font-mono",
  "text-[11px]",
  "font-medium",
  "uppercase",
  "tracking-[0.15em]",
  "text-foreground-subtle",
  "first:pt-1",
]
  .map((c) => `[&_[cmdk-group-heading]]:${c}`)
  .join(" ");

const itemClass = cn(
  "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm text-foreground-muted outline-none",
  "data-[selected=true]:bg-background-elevated-hover data-[selected=true]:text-foreground"
);

export function CommandPaletteProvider({
  children,
  posts,
}: {
  children: ReactNode;
  posts: BlogPostMeta[];
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <CommandPaletteContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        label="Search"
        overlayClassName="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        contentClassName="fixed left-1/2 top-24 z-[101] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-background-elevated shadow-2xl outline-none sm:top-[20vh]"
        shouldFilter
        loop
      >
        <CommandInput
          placeholder="Search sections, projects, blog..."
          className="w-full border-b border-border bg-transparent px-4 py-3.5 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none"
        />
        <CommandList className="max-h-80 overflow-y-auto p-2">
          <CommandEmpty className="py-10 text-center text-sm text-foreground-subtle">
            No results found.
          </CommandEmpty>

          <CommandGroup heading="Sections" className={groupHeadingClass}>
            {navLinks.map((link) => (
              <CommandItem
                key={link.href}
                value={link.label}
                onSelect={() => go(link.href)}
                className={itemClass}
              >
                <Hash size={15} className="shrink-0 text-foreground-subtle" />
                {link.label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Projects" className={groupHeadingClass}>
            {projects.map((project) => (
              <CommandItem
                key={project.slug}
                value={`${project.title} ${project.category}`}
                onSelect={() => go(`/work/${project.slug}`)}
                className={itemClass}
              >
                <Folder size={15} className="mt-0.5 shrink-0 self-start text-foreground-subtle" />
                <div className="flex flex-col">
                  <span className="text-foreground">{project.title}</span>
                  <span className="text-xs text-foreground-subtle">{project.category}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          {posts.length > 0 && (
            <CommandGroup heading="Blog" className={groupHeadingClass}>
              {posts.map((post) => (
                <CommandItem
                  key={post.slug}
                  value={`${post.title} ${post.description} ${(post.tags ?? []).join(" ")}`}
                  onSelect={() => go(`/blog/${post.slug}`)}
                  className={itemClass}
                >
                  <FileText size={15} className="mt-0.5 shrink-0 self-start text-foreground-subtle" />
                  <div className="flex flex-col">
                    <span className="text-foreground">{post.title}</span>
                    <span className="text-xs text-foreground-subtle">{post.description}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </CommandPaletteContext.Provider>
  );
}

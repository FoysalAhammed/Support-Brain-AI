import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Knowledge base", href: "/#how-it-works" },
      { label: "Channels", href: "/#channels" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "RAG engine", href: "/#how-it-works" },
      { label: "AI agent", href: "/#features" },
      { label: "Human handoff", href: "/#features" },
      { label: "Analytics", href: "/#features" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/register" },
      { label: "Customer chat", href: "/chat" },
      { label: "Admin", href: "/admin" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              RAG-enabled multi-agent SaaS for intelligent omnichannel customer
              support.
            </p>
          </div>
          {columns.map((column) => (
            <div key={column.title} className="space-y-3">
              <p className="text-sm font-semibold">{column.title}</p>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} SupportBrain AI. University demonstration project.</p>
          <p>Built with Next.js, TypeScript and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-48 left-1/2 -z-10 h-[28rem] w-[44rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 right-[-6rem] -z-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />

      <div className="mb-6 flex w-full max-w-md items-center justify-between">
        <Link href="/" aria-label="SupportBrain AI home">
          <Logo />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to site
        </Link>
      </div>

      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo />
      <div className="space-y-2">
        <p className="font-mono text-6xl font-semibold text-gradient">404</p>
        <h1 className="text-xl font-semibold">We couldn&apos;t find that page</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          The page you are looking for may have been moved or no longer exists.
        </p>
      </div>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}

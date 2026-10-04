"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/components/providers/auth-provider";
import {
  DEMO_EMAIL,
  DEMO_PASSWORD,
  DEVELOPER_EMAIL,
  DEVELOPER_PASSWORD,
  MODERATOR_EMAIL,
  MODERATOR_PASSWORD,
} from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login, session, ready } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (ready && session) router.replace("/dashboard");
  }, [ready, session, router]);

  const submit = async (nextEmail = email, nextPassword = password) => {
    if (loading) return;
    setError(null);
    setLoading(true);
    const result = await login(nextEmail, nextPassword);
    setLoading(false);
    if (result.ok) {
      router.replace("/dashboard");
      return;
    }
    setError(result.error ?? "Unable to sign in.");
  };

  return (
    <Card className="p-6 shadow-lg shadow-primary/5 sm:p-8">
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your SupportBrain workspace.
        </p>
      </div>

      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="pl-9"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-destructive-soft px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Spinner /> : null}
          Sign in
          {!loading && <ArrowRight />}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        OR
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={loading}
        onClick={() => {
          setEmail(DEMO_EMAIL);
          setPassword(DEMO_PASSWORD);
          submit(DEMO_EMAIL, DEMO_PASSWORD);
        }}
      >
        <Sparkles />
        Continue with demo account
      </Button>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => {
            setEmail(DEVELOPER_EMAIL);
            setPassword(DEVELOPER_PASSWORD);
            submit(DEVELOPER_EMAIL, DEVELOPER_PASSWORD);
          }}
        >
          Developer owner
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => {
            setEmail(MODERATOR_EMAIL);
            setPassword(MODERATOR_PASSWORD);
            submit(MODERATOR_EMAIL, MODERATOR_PASSWORD);
          }}
        >
          Moderator
        </Button>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Create one
        </Link>
      </p>

      <div className="mt-5 space-y-1 rounded-lg border border-border bg-muted/40 px-3 py-2 text-center font-mono text-[0.7rem] text-muted-foreground">
        <p>demo@supportbrain.ai · demo123</p>
        <p>admin@supportbrain.ai · admin123</p>
        <p>developer@supportbrain.ai · developer123</p>
        <p>moderator@supportbrain.ai · moderator123</p>
      </div>
    </Card>
  );
}

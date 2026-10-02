"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/components/providers/auth-provider";

export default function RegisterPage() {
  const router = useRouter();
  const { register, session, ready } = useAuth();
  const [form, setForm] = React.useState({
    name: "",
    organization: "",
    email: "",
    password: "",
  });
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (ready && session) router.replace("/dashboard");
  }, [ready, session, router]);

  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);
    const result = await register(form);
    setLoading(false);
    if (result.ok) {
      router.replace("/dashboard");
      return;
    }
    setError(result.error ?? "Unable to create your account.");
  };

  return (
    <Card className="p-6 shadow-lg shadow-primary/5 sm:p-8">
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight">Create your workspace</h1>
        <p className="text-sm text-muted-foreground">
          Start building your AI support agent in minutes.
        </p>
      </div>

      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                value={form.name}
                onChange={update("name")}
                placeholder="Alex Morgan"
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="organization"
                value={form.organization}
                onChange={update("organization")}
                placeholder="Northwind Commerce"
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="you@company.com"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={update("password")}
              placeholder="At least 6 characters"
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
          Create account
          {!loading && <ArrowRight />}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </Card>
  );
}

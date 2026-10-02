"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { authService } from "@/services/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const submit = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);
    const result = await authService.requestPasswordReset(email);
    setLoading(false);
    if (result.ok) {
      setMessage(result.message);
      return;
    }
    setError(result.error);
  };

  return (
    <Card className="p-6 shadow-lg shadow-primary/5 sm:p-8">
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight">Reset your password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {message ? (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-success/30 bg-success-soft/50 p-4">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
          <p className="text-sm">{message}</p>
        </div>
      ) : (
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
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
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
            Send reset link
          </Button>
        </form>
      )}

      <Link
        href="/login"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="size-3.5" />
        Back to sign in
      </Link>
    </Card>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import { demoOrganization } from "@/data/mock-organizations";
import { hasPermission, type Permission } from "@/lib/permissions";
import type { AuthSession, User, UserRole } from "@/types/user";
import type { Organization } from "@/types/organization";

interface AuthContextValue {
  session: AuthSession | null;
  user: User | null;
  organization: Organization;
  organizations: Organization[];
  ready: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isDeveloper: boolean;
  role: UserRole | null;
  can: (permission: Permission) => boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (input: {
    name: string;
    email: string;
    password: string;
    organization: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  switchOrganization: (id: string) => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  organizations,
}: {
  children: React.ReactNode;
  organizations: Organization[];
}) {
  const router = useRouter();
  const [session, setSession] = React.useState<AuthSession | null>(null);
  const [ready, setReady] = React.useState(false);
  const [organizationId, setOrganizationId] = React.useState<string>(
    demoOrganization.id,
  );

  React.useEffect(() => {
    const stored = authService.getSession();
    if (stored) {
      setSession(stored);
      setOrganizationId(stored.organizationId);
    }
    setReady(true);
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    const result = await authService.login(email, password);
    if (!result.ok) return { ok: false, error: result.error };
    authService.persist(result.session);
    setSession(result.session);
    setOrganizationId(result.session.organizationId);
    return { ok: true };
  }, []);

  const register = React.useCallback(
    async (input: { name: string; email: string; password: string; organization: string }) => {
      const result = await authService.register(input);
      if (!result.ok) return { ok: false, error: result.error };
      authService.persist(result.session);
      setSession(result.session);
      return { ok: true };
    },
    [],
  );

  const logout = React.useCallback(() => {
    authService.logout();
    setSession(null);
    router.push("/login");
  }, [router]);

  const switchOrganization = React.useCallback((id: string) => {
    setOrganizationId(id);
  }, []);

  const organization =
    organizations.find((item) => item.id === organizationId) ?? demoOrganization;

  const value = React.useMemo<AuthContextValue>(() => {
    const user = session?.user ?? null;
    return {
      session,
      user,
      organization,
      organizations,
      ready,
      isAdmin: Boolean(
        user && (user.organizationId === "org_platform" || user.email.startsWith("admin@")),
      ),
      isOwner: user?.role === "owner",
      isDeveloper: user?.platformRole === "developer",
      role: user?.role ?? null,
      can: (permission: Permission) =>
        user?.platformRole === "developer"
          ? true
          : hasPermission(user?.role ?? null, permission),
      login,
      register,
      logout,
      switchOrganization,
    };
  }, [session, organization, organizations, ready, login, register, logout, switchOrganization]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

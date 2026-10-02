import { DEMO_EMAIL, DEMO_PASSWORD, adminUser, demoUser } from "@/data/mock-users";
import type { AuthSession, User } from "@/types/user";

const STORAGE_KEY = "supportbrain.session";

const delay = (ms = 420) => new Promise((resolve) => setTimeout(resolve, ms));

function createSession(user: User): AuthSession {
  return {
    token: `demo.${btoa(user.id)}.${Date.now()}`,
    user,
    organizationId: user.organizationId,
    issuedAt: Date.now(),
  };
}

export const authService = {
  isBrowser() {
    return typeof window !== "undefined";
  },

  getSession(): AuthSession | null {
    if (!this.isBrowser()) return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as AuthSession;
    } catch {
      return null;
    }
  },

  persist(session: AuthSession | null) {
    if (!this.isBrowser()) return;
    if (!session) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  },

  async login(
    email: string,
    password: string,
  ): Promise<{ ok: true; session: AuthSession } | { ok: false; error: string }> {
    await delay(600);
    const normalized = email.trim().toLowerCase();

    if (normalized === DEMO_EMAIL && password === DEMO_PASSWORD) {
      return { ok: true, session: createSession(demoUser) };
    }

    if (normalized === "admin@supportbrain.ai" && password === "admin123") {
      return { ok: true, session: createSession(adminUser) };
    }

    if (!normalized || !password) {
      return { ok: false, error: "Please enter your email and password." };
    }

    if (password.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }

    return {
      ok: false,
      error: "No account found for those credentials. Try the demo account below.",
    };
  },

  async register(input: {
    name: string;
    email: string;
    password: string;
    organization: string;
  }): Promise<{ ok: true; session: AuthSession } | { ok: false; error: string }> {
    await delay(700);
    if (!input.name || !input.email || !input.password) {
      return { ok: false, error: "All fields are required." };
    }
    if (input.password.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }
    const user: User = {
      ...demoUser,
      id: `usr_${Date.now()}`,
      name: input.name,
      email: input.email,
      organizationId: "org_northwind",
      title: "Owner",
    };
    return { ok: true, session: createSession(user) };
  },

  async requestPasswordReset(
    email: string,
  ): Promise<{ ok: true; message: string } | { ok: false; error: string }> {
    await delay(600);
    if (!email.includes("@")) {
      return { ok: false, error: "Enter a valid email address." };
    }
    return {
      ok: true,
      message: `If an account exists for ${email}, a reset link is on its way.`,
    };
  },

  logout() {
    this.persist(null);
  },
};

export { DEMO_EMAIL, DEMO_PASSWORD };

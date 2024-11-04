/// <reference types="astro/client" />
/// <reference types="@clerk/astro/env" />

import type { Provider as AuthProvider } from "./auth/Provider";

interface ImportMetaEnv {
  readonly ADMIN_USER_EMAIL: string;
  readonly PUBLIC_CLERK_PUBLISHABLE_KEY: string;
  readonly CLERK_SECRET_KEY: string;
  readonly OPEN_AI_API_KEY?: string;
  readonly OPEN_AI_API_MODEL?: string;
  readonly TURSO_DATABASE_URL: string;
  readonly TURSO_AUTH_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace App {
    interface Locals {
      authProvider: AuthProvider;
    }
  }
}

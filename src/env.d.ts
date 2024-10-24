/// <reference types="astro/client" />
/// <reference types="@clerk/astro/env" />

interface ImportMetaEnv {
  readonly PUBLIC_CLERK_PUBLISHABLE_KEY: string;
  readonly CLERK_SECRET_KEY: string;
  readonly OPEN_AI_API_KEY?: string;
  readonly OPEN_AI_API_MODEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

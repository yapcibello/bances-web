/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** ID del container de Google Tag Manager (opcional; si falta, GTM no se inyecta). */
  readonly PUBLIC_GTM_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

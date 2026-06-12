import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://clinicadentalbances.com',
  integrations: [
    tailwind({
      // El base de estilos lo gobierna el global.css de la app.
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
  output: 'static',
  compressHTML: true,
  trailingSlash: 'always',
  // Puerto fijo dev — convención SMedialab. bances: www = 4320.
  server: { port: 4320, host: true },
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    // Calidad por defecto y formatos para imágenes optimizadas.
    // Patrón heredado de logopedajessica-web / villena-web.
    domains: [],
    remotePatterns: [],
  },
  vite: {
    optimizeDeps: {
      // Evita pre-bundling de paquetes del workspace (hot-reload cross-package).
      exclude: ['@bances/config', '@bances/seo'],
    },
  },
});

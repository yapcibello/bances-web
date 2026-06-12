import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

/** @type {import('tailwindcss').Config} */
export default {
  presets: [require('@bances/config/tailwind-preset')],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  plugins: [require('@tailwindcss/typography')],
};

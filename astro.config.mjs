// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // site: 'https://fulton-ring.github.io',
  // base: 'landing-page',
  site: 'https://www.fultonring.com',
  vite: {
    plugins: [tailwindcss()],
  },
});

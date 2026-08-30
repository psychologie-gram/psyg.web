// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.psychologie-gram.at',
  output: 'static',
  adapter: cloudflare({ imageService: 'compile' }),
  session: false,
  vite: {
    plugins: [tailwindcss(), tinaAdminDevRedirect()],
    ssr: {
      noExternal: ['@tinacms/astro', '@tinacms/bridge']
    }
  },

  integrations: [sitemap(), tina()]
});
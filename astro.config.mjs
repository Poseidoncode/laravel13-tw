// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://laravel13-tw.example.com',

  integrations: [
    mdx(),
    sitemap(),
  ],

  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      langs: ['php', 'javascript', 'typescript', 'bash', 'json', 'blade', 'sql', 'html', 'css'],
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
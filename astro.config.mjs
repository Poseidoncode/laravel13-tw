// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://laravel13-zh-tw.hulstem.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },

  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404/'),
      serialize(item) {
        const isHome = item.url === 'https://laravel13-zh-tw.hulstem.com/';
        item.lastmod = new Date();
        item.changefreq = isHome ? 'daily' : 'weekly';
        item.priority = isHome ? 1.0 : 0.7;
        return item;
      },
    }),
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
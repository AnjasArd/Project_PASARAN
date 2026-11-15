import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Ganti `site` dengan domain produksi sebelum deploy (dipakai untuk sitemap dan URL kanonis).
export default defineConfig({
  site: 'https://pasaran.id',
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  // Halaman dibuat sebagai fitur.html (bukan fitur/index.html) agar /fitur langsung terbuka
  // tanpa redirect di Cloudflare, sama dengan tautan di navigasi.
  build: { format: 'file' },
  trailingSlash: 'never',
});

import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { VitePWA } from 'vite-plugin-pwa'

// Relative base so the build works from any subpath (e.g. GitHub Pages
// project sites at username.github.io/repo-name/) without hardcoding the repo name.
export default defineConfig({
  base: './',
  plugins: [
    preact(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'favicon-32.png'],
      manifest: {
        name: 'Padel Buddy',
        short_name: 'Padel Buddy',
        description: 'A mobile-friendly padel companion: a tactics whiteboard and a round-robin tournament organizer.',
        theme_color: '#0f2e2b',
        background_color: '#0f2e2b',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
})

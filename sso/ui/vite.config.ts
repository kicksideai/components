import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { wippyComponentPlugin } from '@wippy-fe/vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), wippyComponentPlugin()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': '{}',
  },
  build: {
    target: 'esnext',
    // Build into the module's own served directory so kickside/sso ships and
    // serves its own UI bundle (no dependency on the app to host it).
    outDir: resolve(__dirname, '../static'),
    emptyOutDir: true,
    lib: {
      // Three elements ship from this package: the login surface (index →
      // kickside-sso), the admin shell (admin → kickside-sso-admin), and the
      // generic provider card (provider → kickside-sso-provider) the shell mounts
      // once per discovered provider, configured entirely from the registry. The
      // provider set is declarative — no per-provider build entry.
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        admin: resolve(__dirname, 'src/admin.ts'),
        provider: resolve(__dirname, 'src/provider.ts'),
      },
      name: 'KicksideSso',
      formats: ['es'],
    },
    rollupOptions: {
      preserveEntrySignatures: false,
      input: {
        index: resolve(__dirname, 'src/index.ts'),
        admin: resolve(__dirname, 'src/admin.ts'),
        provider: resolve(__dirname, 'src/provider.ts'),
      },
      external: ['vue', '@iconify/vue', '@wippy-fe/proxy'],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]',
      },
    },
    sourcemap: true,
  },
})

// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { wippyComponentPlugin } from '@wippy-fe/vite-plugin'
import { defineConfig } from 'vite'
import hostImportMap from './web-host.import-map.snapshot.json'

const moduleRoot = fileURLToPath(new URL('.', import.meta.url))

const shellProvided = Object.keys(hostImportMap.imports)

export default defineConfig({
  plugins: [vue({ template: { compilerOptions: { isCustomElement: (t) => t.startsWith('wc-') || t.startsWith('kickside-') } } }), wippyComponentPlugin()],
  // Lib builds don't auto-replace process.env; provide it so deps that read
  // NODE_ENV don't throw "process is not defined" in the browser/shadow DOM.
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': '{}',
  },
  build: {
    target: 'esnext',
    lib: {
      entry: { admin: resolve(moduleRoot, 'src/admin.ts'), settings: resolve(moduleRoot, 'src/settings.ts') },
      name: 'KicksidePimAdmin',
      formats: ['es'],
    },
    rollupOptions: {
      external: [...shellProvided, /^primevue\//, /^@primevue\//, /^@primeuix\//],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]',
      },
      preserveEntrySignatures: false,
    },
    sourcemap: false,
  },
})

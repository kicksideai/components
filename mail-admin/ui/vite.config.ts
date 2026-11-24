// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { wippyComponentPlugin } from '@wippy-fe/vite-plugin'
import { defineConfig } from 'vite'
import { wcRuntimeChunk } from '../../wc-build'
import hostImportMap from './web-host.import-map.snapshot.json'

const moduleRoot = fileURLToPath(new URL('.', import.meta.url))
const shellProvided = Object.keys(hostImportMap.imports)

export default defineConfig({
  plugins: [vue({ template: { compilerOptions: { isCustomElement: tag => tag.startsWith('wc-') || tag.startsWith('kickside-') } } }), wippyComponentPlugin()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': '{}',
  },
  build: {
    target: 'esnext',
    lib: {
      entry: { admin: resolve(moduleRoot, 'src/admin.ts'), delivery: resolve(moduleRoot, 'src/delivery.ts') },
      name: 'KicksideMailAdmin',
      formats: ['es'],
    },
    rollupOptions: {
      external: [...shellProvided, /^primevue\//],
      output: {
        manualChunks: wcRuntimeChunk,
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]',
      },
      preserveEntrySignatures: false,
    },
    sourcemap: true,
  },
})

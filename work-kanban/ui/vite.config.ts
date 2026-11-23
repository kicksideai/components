// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { wippyComponentPlugin } from '@wippy-fe/vite-plugin'
import { defineConfig } from 'vite'
import { wcRuntimeChunk } from '../../wc-build'
import importMap from './wippy-import-map.json'

const entry = fileURLToPath(new URL('./src/app/index.ts', import.meta.url))

export default defineConfig({
  base: '',
  plugins: [
    vue({ template: { compilerOptions: { isCustomElement: tag => tag.startsWith('wc-') } } }),
    wippyComponentPlugin({ required: true }),
  ],
  build: {
    target: 'es2022',
    lib: { entry, formats: ['es'], fileName: 'index' },
    rollupOptions: {
      external: Object.keys(importMap.imports),
      preserveEntrySignatures: 'strict',
      output: {
        manualChunks(id, graph) {
          // The host associates define(import.meta.url) with index.js. Keep
          // exports shared by eager and lazy UI out of the registration entry.
          if (id.endsWith('/app/KanbanPage.vue')) return 'kanban-page'
          if (wcRuntimeChunk(id, graph)) return 'kanban-page'
        },
      },
    },
  },
})

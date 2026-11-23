// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { wippyComponentPlugin } from '@wippy-fe/vite-plugin'
import { defineConfig } from 'vite'
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
    },
  },
})

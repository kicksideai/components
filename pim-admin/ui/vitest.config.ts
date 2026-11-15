// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
export default defineConfig({
  plugins: [vue({ template: { compilerOptions: { isCustomElement: t => t.startsWith('wc-') || t.startsWith('kickside-') } } })],
  resolve: { dedupe: ['@iconify/vue', 'vue', '@wippy-fe/proxy', '@wippy-fe/webcomponent-vue'], alias: { vue: fileURLToPath(new URL('./node_modules/vue/dist/vue.esm-bundler.js', import.meta.url)) } },
  test: { server: { deps: { inline: [/primevue/, /@primevue/, /@primeuix/] } }, environment: 'happy-dom', include: ['test/**/*.test.ts', 'src/**/*.test.ts'], setupFiles: ['./src/test/setup.ts'], restoreMocks: true },
})

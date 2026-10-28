// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
export default defineConfig({ plugins: [vue({ template: { compilerOptions: { isCustomElement: t => t.startsWith('wc-') } } })], test: { server: { deps: { inline: ['@wippy-fe/webcomponent-vue', '@wippy-fe/webcomponent-core'] } }, environment: 'happy-dom', include: ['src/**/*.spec.ts'] } })

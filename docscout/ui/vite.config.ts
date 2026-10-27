// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { wippyComponentPlugin } from '@wippy-fe/vite-plugin'
import { defineConfig } from 'vite'
export default defineConfig({
 plugins: [vue({ template: { compilerOptions: { isCustomElement: t => t.startsWith('wc-') } } }), wippyComponentPlugin()],
 define: { 'process.env.NODE_ENV': JSON.stringify('production'), 'process.env': '{}' },
 build: { target: 'esnext', outDir: resolve(__dirname, '../static'), emptyOutDir: true,
 lib: { entry: { index: resolve(__dirname, 'src/manage.ts'), create: resolve(__dirname, 'src/create.ts'), page: resolve(__dirname, 'src/page.ts') }, formats: ['es'] },
 rollupOptions: { external: ['vue', '@iconify/vue', '@wippy-fe/proxy'], output: { banner: '/*! SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0 */', entryFileNames: '[name].js', chunkFileNames: '[name]-[hash].js' } }, sourcemap: false },
})

import {resolve} from 'node:path'
import vue from '@vitejs/plugin-vue'
import {wippyComponentPlugin} from '@wippy-fe/vite-plugin'
import {defineConfig} from 'vite'
export default defineConfig({
  plugins:[vue({template:{compilerOptions:{isCustomElement:(tag)=>tag.startsWith('wc-')||tag==='wc-agent-trait-picker'}}}),wippyComponentPlugin()],
  define:{'process.env.NODE_ENV':JSON.stringify('production')},
  build:{target:'esnext',outDir:resolve(__dirname,'../static'),emptyOutDir:true,
    lib:{entry:resolve(__dirname,'src/index.ts'),name:'AgentOnboarding',fileName:'index',formats:['es']},
    rollupOptions:{preserveEntrySignatures:'strict',external:['vue','@iconify/vue','@wippy-fe/proxy'],
      output:{entryFileNames:'[name].js',chunkFileNames:'[name]-[hash].js',assetFileNames:'[name]-[hash][extname]'}},sourcemap:false},
})

import {resolve} from 'node:path'
import vue from '@vitejs/plugin-vue'
import {wippyComponentPlugin} from '@wippy-fe/vite-plugin'
import {defineConfig} from 'vite'
import {hostExternals, wcRuntimeChunk} from '../../wc-build'
export default defineConfig({
  plugins:[vue({template:{compilerOptions:{isCustomElement:(tag)=>tag.startsWith('wc-')||tag==='wc-agent-trait-picker'}}}),wippyComponentPlugin()],
  define:{'process.env.NODE_ENV':JSON.stringify('production')},
  build:{target:'esnext',outDir:resolve(__dirname,'../static'),emptyOutDir:true,
    lib:{entry:resolve(__dirname,'src/index.ts'),name:'AgentOnboarding',fileName:'index',formats:['es']},
    rollupOptions:{preserveEntrySignatures:'strict',external:hostExternals,
      output:{entryFileNames:'[name].js',chunkFileNames:'[name]-[hash].js',assetFileNames:'[name]-[hash][extname]',manualChunks:wcRuntimeChunk}},sourcemap:false},
})

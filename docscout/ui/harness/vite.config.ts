// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {resolve} from 'node:path'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({root:__dirname,plugins:[vue({template:{compilerOptions:{isCustomElement:t=>t.startsWith('wc-')}}})],resolve:{alias:{'@wippy-fe/proxy':resolve(__dirname,'proxy.ts')}},server:{host:'127.0.0.1',port:18194,strictPort:true}})

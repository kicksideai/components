// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {createApp} from 'vue'
import {PrimeVuePlugin} from '@wippy-fe/theme/primevue-plugin'
import Preview from './Preview.vue'
import '../src/styles.css'
import '@wippy-fe/theme/primevue/tailwind.css'
const theme=new URLSearchParams(location.search).get('theme')==='dark'?'dark':'light'
document.documentElement.className=`w-theme-${theme}`
class PreviewWidget extends HTMLElement{
 connectedCallback(){
  const root=this.attachShadow({mode:'open'}),control=document.createElement('button')
  control.type='button';control.textContent=this.tagName==='WC-MODEL-PICKER'?this.getAttribute('value')||'Choose model':'Choose an upload'
  const style=document.createElement('style');style.textContent=':host{display:block}button{width:100%;text-align:left;padding:9px 11px;border:1px solid var(--p-content-border-color);border-radius:var(--p-form-field-border-radius);background:var(--p-content-background);color:var(--p-text-color);font:inherit}'
  root.append(style,control)
 }
}
customElements.define('wc-model-picker',class extends PreviewWidget{})
customElements.define('wc-multiselect',class extends PreviewWidget{})
createApp(Preview).use(PrimeVuePlugin).mount('#app')

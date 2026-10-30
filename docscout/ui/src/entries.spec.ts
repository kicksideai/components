// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
const index=readFileSync(resolve('../src/_index.yaml'),'utf8')
import {expect,it} from 'vitest'

it('announces and auto-registers the navigation page with its served entry',()=>{
 const page=index.split('- name: page_view\n')[1].split('\n- name:')[0]
 expect(page).toContain('announced: true')
 expect(page).toContain('auto_register: true')
 expect(page).toContain('tag_name: kickside-docscout-page')
 expect(page).toContain('entry_point: page.js')
 expect(index).toContain('component_tag: kickside-docscout-page')
})

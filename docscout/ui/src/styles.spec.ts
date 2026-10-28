// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
const css=readFileSync(resolve('src/styles.css'),'utf8')
import {parse} from 'postcss'
import {describe,expect,it} from 'vitest'

const styles=parse(css)
function declarations(selector:string){
 const values:Record<string,string>={}
 styles.walkRules(rule=>{if(rule.selector===selector)rule.walkDecls(decl=>{values[decl.prop]=decl.value})})
 return values
}

describe('Surface style contract',()=>{
 it('gives the full-height page and create form their own scrolling',()=>{
  expect(declarations('.docscout')).toMatchObject({height:'100%','min-height':'0','overflow-y':'auto'})
  expect(declarations('.create-pane')).toMatchObject({'max-height':'100%','overflow-y':'auto'})
 })
 it('uses semantic tokens for colors and shadows',()=>{
  expect(css).not.toMatch(/#[\da-f]{3,8}\b|rgba?\(|hsla?\(|--p-[\w-]+-\d{2,3}\b/i)
 })
 it('uses shared controls and focus treatments',()=>{
  expect(css).toContain("@import '@kickside/ui-kit/kx-controls.css'")
  expect(css).toContain("@import '@kickside/ui-kit/focus.css'")
  expect(declarations('.icon-btn')).toEqual({})
  expect(declarations('.btn')).toEqual({})
  styles.walkRules(rule=>{
   if(!rule.selector.includes(':focus'))return
   rule.walkDecls(decl=>{expect(['outline','outline-offset','box-shadow']).not.toContain(decl.prop)})
  })
 })
 it('responds to panel width while retaining reduced-motion preferences',()=>{
  const media:string[]=[]
  styles.walkAtRules('media',rule=>{media.push(rule.params)})
  expect(media).toEqual(['(prefers-reduced-motion:reduce)'])
  expect(declarations('.docscout')['container-type']).toBe('inline-size')
 })
})

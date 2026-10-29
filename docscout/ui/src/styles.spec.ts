// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
const css=readFileSync(resolve('src/styles.css'),'utf8')
import {parse} from 'postcss'
import {describe,expect,it} from 'vitest'

const styles=parse(css)
function declarations(selector:string,context?:string){
 const values:Record<string,string>={}
 styles.walkRules(rule=>{
  if(!context&&rule.parent?.type!=='root')return
  if(context&&!(rule.parent?.type==='atrule'&&'params' in rule.parent&&rule.parent.params===context))return
  if(rule.selector===selector)rule.walkDecls(decl=>{values[decl.prop]=decl.value})})
 return values
}

describe('Surface style contract',()=>{
 it('gives the full-height page and create form their own scrolling',()=>{
  expect(declarations('.docscout')).toMatchObject({height:'100%','min-height':'0','overflow-y':'auto'})
  expect(declarations('.create-pane')).toMatchObject({'max-height':'100%','overflow-y':'auto'})
 })
 it('uses the shared product font pair',()=>{
  expect(declarations('.docscout')['font-family']).toBe('var(--kx-font-body)')
  expect(declarations('h1,h2,h3,h4')['font-family']).toBe('var(--kx-font-heading)')
 })
 it('uses one shared geometry scale for card inset, hierarchy and row rhythm',()=>{
  expect(css).toContain('--docscout-space:calc(var(--kx-row-height)/8)')
  expect(declarations('#fields-body')['padding']).toBe('calc(var(--docscout-space)*4)')
  expect(declarations('.group-content')['padding-inline-start']).toBe('calc(var(--docscout-space)*4 - 1px)')
  expect(declarations('.shape-tree-node .row-main')['min-height']).toBe('calc(var(--kx-row-height)*2)')
  expect(declarations('.shape-tree-node .row-main','fields (max-width:400px)')['min-height']).toBe('calc(var(--kx-row-height)*2 + var(--docscout-space)*4)')
  expect(declarations('.shape-tree-node .row-name')['font-family']).toBe('var(--kx-font-body)')
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

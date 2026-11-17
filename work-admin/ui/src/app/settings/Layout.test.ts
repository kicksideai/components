// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { afterEach, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FieldsEditor from './FieldsEditor.vue'
import styles from '../../styles.css?inline'
let sheet: HTMLStyleElement | undefined
afterEach(() => sheet?.remove())
it('aligns code and title controls at the shared control height', async () => {
  sheet = document.createElement('style'); sheet.textContent = ':root { --kx-control-height: 34px; }' + styles.replace(/@import[^;]+;/g, '').replace(/:host,\s*:root/g, ':root'); document.head.append(sheet)
  const target = document.createElement('div'); target.className = 'work-pane'; document.body.append(target)
  const w = mount(FieldsEditor, { attachTo: target, props: { draft: { fields: [{ code: 'points', form: 'int' }] } } })
  await w.get('[aria-expanded]').trigger('click')
  const [code, title] = w.findAll<HTMLInputElement>('.work-field-properties input')
  expect(getComputedStyle(code.element).minHeight).toBe('34px')
  expect(code.classes()).toContain('p-inputtext')
  expect(title.classes()).toContain('p-inputtext')
  expect(styles).toContain('var(--kx-control-height)')
  expect(getComputedStyle(code.element).minHeight).toBe(getComputedStyle(title.element).minHeight)
  expect(getComputedStyle(code.element).marginTop).toBe(getComputedStyle(title.element).marginTop)
  w.unmount(); target.remove()
})

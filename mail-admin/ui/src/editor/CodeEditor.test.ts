// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

// This file runs the real CodeMirror editor, not the plain field the other tests use.
vi.unmock('./CodeEditor.vue')
const { default: CodeEditor } = await import('./CodeEditor.vue')

// Browsers queue selectionchange as a task; happy-dom fires it inside the selection change itself. The editor's
// listeners get the browser timing here.
const add = document.addEventListener.bind(document)
document.addEventListener = ((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
  if (type !== 'selectionchange' || typeof listener !== 'function') return add(type, listener, options)
  return add(type, (event: Event) => { setTimeout(() => listener(event)) }, options)
}) as typeof document.addEventListener

describe('Code editor', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('wraps long lines, and indents a wrapped line under its own indentation', async () => {
    const wrapper = mount(CodeEditor, { props: { modelValue: '<p>\n    <span>' + 'long words '.repeat(40) + '</span>\n</p>', label: 'Body' }, attachTo: document.body })
    await flushPromises()
    expect(wrapper.find('.cm-content').classes()).toContain('cm-lineWrapping')
    const lines = wrapper.findAll('.cm-line')
    expect(lines[1].attributes('style')).toContain('padding-left: calc(6ch + 6px)')
    expect(lines[1].attributes('style')).toContain('text-indent: -6ch')
    expect(lines[0].attributes('style') ?? '').toContain('padding-left: calc(2ch + 6px)')
    expect(wrapper.find('.cm-content').attributes('aria-label')).toBe('Body')
    wrapper.unmount()
  })

  it('inserts at the cursor, leaves the cursor after the inserted text and reports the new text', async () => {
    const wrapper = mount(CodeEditor, { props: { modelValue: 'Hello world', label: 'Body' }, attachTo: document.body })
    await flushPromises()
    const editor = wrapper.vm as unknown as { insert: (text: string) => void }
    editor.insert('{{ first_name }} ')
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['{{ first_name }} Hello world'])
    editor.insert('dear ')
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['{{ first_name }} dear Hello world'])
    wrapper.unmount()
  })
})

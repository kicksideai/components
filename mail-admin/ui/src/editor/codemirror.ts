// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { html } from '@codemirror/lang-html'
import { liquid } from '@codemirror/lang-liquid'
import { HighlightStyle, bracketMatching, syntaxHighlighting } from '@codemirror/language'
import { EditorState, RangeSetBuilder, type Extension } from '@codemirror/state'
import {
  Decoration, EditorView, ViewPlugin, drawSelection, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers,
  type DecorationSet, type ViewUpdate,
} from '@codemirror/view'
import { tags } from '@lezer/highlight'

// Template tags `{{ … }}` share Liquid's delimiters, so the Liquid grammar over HTML highlights
// Jet-in-HTML: markup, attributes and template expressions each in their own colour.
const highlight = HighlightStyle.define([
  { tag: [tags.tagName, tags.angleBracket], color: 'var(--mail-code-tag)' },
  { tag: tags.attributeName, color: 'var(--mail-code-attribute)' },
  { tag: [tags.attributeValue, tags.string], color: 'var(--mail-code-string)' },
  { tag: [tags.keyword, tags.controlKeyword, tags.operatorKeyword, tags.definitionKeyword], color: 'var(--mail-code-keyword)', fontWeight: '600' },
  { tag: [tags.brace, tags.special(tags.brace), tags.processingInstruction], color: 'var(--mail-code-delimiter)', fontWeight: '600' },
  { tag: [tags.variableName, tags.propertyName], color: 'var(--mail-code-variable)' },
  { tag: [tags.number, tags.bool, tags.null], color: 'var(--mail-code-number)' },
  { tag: [tags.comment, tags.blockComment], color: 'var(--p-text-muted-color)', fontStyle: 'italic' },
  { tag: tags.invalid, color: 'var(--p-danger-500)' },
])

const theme = EditorView.theme({
  '&': { color: 'var(--p-text-color)', backgroundColor: 'var(--p-content-background)', fontSize: '12.5px', height: '100%' },
  '.cm-content': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', caretColor: 'var(--p-text-color)', padding: '10px 0' },
  '.cm-scroller': { lineHeight: '1.6', overflow: 'auto' },
  '.cm-gutters': { backgroundColor: 'var(--p-content-background)', color: 'var(--p-text-muted-color)', border: 'none' },
  '.cm-lineNumbers .cm-gutterElement': { padding: '0 12px 0 10px', minWidth: '36px' },
  '.cm-activeLine': { backgroundColor: 'color-mix(in srgb, var(--p-text-color) 4%, transparent)' },
  '.cm-activeLineGutter': { backgroundColor: 'transparent', color: 'var(--p-text-color)' },
  '&.cm-focused': { outline: 'none' },
  '&.cm-focused .cm-cursor': { borderLeftColor: 'var(--p-text-color)' },
  '.cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection': {
    backgroundColor: 'color-mix(in srgb, var(--p-primary-color) 24%, transparent) !important',
  },
  '.cm-matchingBracket': { backgroundColor: 'color-mix(in srgb, var(--p-primary-color) 18%, transparent)', outline: 'none' },
})

// Long lines wrap; a wrapped continuation lines up under its line's own indentation, two characters further in,
// so nested markup keeps its shape.
function hangingIndent(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>()
  for (const { from, to } of view.visibleRanges) {
    for (let position = from; position <= to;) {
      const line = view.state.doc.lineAt(position)
      const indent = (/^[ \t]*/.exec(line.text)?.[0] ?? '').replace(/\t/g, '  ').length + 2
      builder.add(line.from, line.from, Decoration.line({ attributes: { style: `padding-left: calc(${indent}ch + 6px); text-indent: -${indent}ch` } }))
      position = line.to + 1
    }
  }
  return builder.finish()
}
const wrappedIndent = ViewPlugin.fromClass(class {
  decorations: DecorationSet
  constructor(view: EditorView) { this.decorations = hangingIndent(view) }
  update(update: ViewUpdate) { if (update.docChanged || update.viewportChanged) this.decorations = hangingIndent(update.view) }
}, { decorations: plugin => plugin.decorations })

export interface EditorOptions {
  doc: string
  label: string
  readOnly: boolean
  root: Document | ShadowRoot
  parent: HTMLElement
  onChange: (value: string) => void
}

export function language(): Extension {
  return liquid({ base: html({ autoCloseTags: false }) })
}

export function baseExtensions(label: string, readOnly: boolean): Extension[] {
  return [
    lineNumbers(), highlightActiveLineGutter(), drawSelection(), highlightActiveLine(), bracketMatching(),
    syntaxHighlighting(highlight), theme, language(), EditorView.lineWrapping, wrappedIndent,
    EditorState.readOnly.of(readOnly), EditorView.editable.of(!readOnly),
    EditorView.contentAttributes.of({ 'aria-label': label, 'aria-multiline': 'true', role: 'textbox' }),
  ]
}

export function createEditor(options: EditorOptions): EditorView {
  return new EditorView({
    root: options.root,
    parent: options.parent,
    state: EditorState.create({
      doc: options.doc,
      extensions: [
        ...baseExtensions(options.label, options.readOnly),
        history(), keymap.of([...defaultKeymap, ...historyKeymap]),
        EditorView.updateListener.of(update => { if (update.docChanged) options.onChange(update.state.doc.toString()) }),
      ],
    }),
  })
}

export function replaceDoc(view: EditorView, value: string): void {
  if (view.state.doc.toString() === value) return
  view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } })
}

export function insertAtCursor(view: EditorView, text: string): void {
  const { from, to } = view.state.selection.main
  view.dispatch({ changes: { from, to, insert: text }, selection: { anchor: from + text.length }, scrollIntoView: true })
  view.focus()
}

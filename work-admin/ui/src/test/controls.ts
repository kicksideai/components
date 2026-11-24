// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import Select from 'primevue/select'
export function selectControl(wrapper: VueWrapper, label: string) {
  const control = wrapper.findAllComponents(Select).find(control => control.props('ariaLabel') === label)
  if (!control) throw new Error('Select is missing: ' + label)
  return control
}

export function getButton(scope: Pick<VueWrapper | DOMWrapper<Element>, 'findAll'>, label: string) {
  const matches = scope.findAll('button').filter(button => button.text() === label || button.attributes('aria-label') === label)
  if (matches.length !== 1) throw new Error(`Expected one button "${label}", found ${matches.length}`)
  return matches[0]
}

export async function editNumber(control: { vm: { $emit: (event: 'input', value: import('primevue/inputnumber').InputNumberInputEvent) => void } }, value: number) {
  control.vm.$emit('input', { originalEvent: new Event('input'), value, formattedValue: String(value) })
  await nextTick()
}

// The mounted shared schema form: its JSON attributes and the events it emits.
export function schemaForm(scope: Pick<VueWrapper | DOMWrapper<Element>, 'findAll'>, index = 0) {
  const element = scope.findAll('wc-schema-form')[index]
  if (!element) throw new Error('Schema form is missing')
  const json = (name: string) => JSON.parse(element.attributes(name) ?? 'null')
  return {
    element,
    schema: () => json('schema'),
    config: () => json('config'),
    choices: () => json('choices'),
    disabled: () => element.attributes('disabled') !== undefined && element.attributes('disabled') !== 'false',
    change: async (value: Record<string, unknown>) => { await element.trigger('config-changed', { detail: value }) },
    report: async (errors: Record<string, string> = {}) => { await element.trigger('validity-changed', { detail: { valid: !Object.keys(errors).length, errors } }) },
  }
}

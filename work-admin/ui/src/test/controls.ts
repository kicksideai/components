// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
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

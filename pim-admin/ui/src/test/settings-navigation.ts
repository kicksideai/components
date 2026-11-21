// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { flushPromises, type VueWrapper } from '@vue/test-utils'

export async function settingsTab(wrapper: VueWrapper, name: string) {
  const entry = wrapper.get('.kx-settings-rail').findAll('.kx-settings-rail-item').find(option => option.text() === name)!
  if (entry.attributes('aria-current') !== 'true') await entry.trigger('click')
  await flushPromises()
}

export async function openTechnicalSchema(wrapper: VueWrapper) {
  await settingsTab(wrapper, 'Overview')
  await wrapper.get('.kx-disclosure-toggle').trigger('click')
  await wrapper.get('button[aria-label="Open declaration"]').trigger('click')
  await flushPromises()
}

export async function closeTechnicalSchema(wrapper: VueWrapper) {
  await wrapper.get('dialog[aria-label="Technical schema"] button[aria-label="Close"]').trigger('click')
  await flushPromises()
}

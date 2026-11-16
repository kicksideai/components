// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { durationParts, durationValue } from './duration'
it('round trips day, hour and minute controls and clears an optional duration', () => {
  for (const value of ['P2D', 'PT2H', 'PT15M']) {
    const parts = durationParts(value)!
    expect(durationValue(parts.amount, parts.unit)).toBe(value)
  }
  expect(durationParts('P1DT2H', 'hours')!.amount).toBe(26)
  expect(durationValue(null, 'minutes')).toBeUndefined()
})

it('reads weeks and fractional seconds and refuses unsupported durations', () => {
  expect(durationParts('P1W')).toEqual({ amount: 7, unit: 'days' })
  expect(durationValue(0.5, 'minutes')).toBe('PT30S')
  expect(durationValue(1.5, 'days')).toBe('PT129600S')
  expect(durationParts('PT0.5S', 'minutes')?.amount).toBe(0.5 / 60)
  for (const value of ['invalid', 'P', 'PT', 'P0D', 'PT0S', 'PT0.5M', 'P1W1D', 'PT1M1H']) expect(durationParts(value)).toBeUndefined()
})

it('serializes small and large positive control values without exponent notation', () => {
  for (const amount of [1e-12, 1e22]) {
    const value = durationValue(amount, 'minutes')!
    expect(durationParts(value)).toBeDefined()
  }
})

import { mount } from '@vue/test-utils'
import InputNumber from 'primevue/inputnumber'
import DurationControl from './DurationControl.vue'
it('reports duration validity for invalid edits, unsupported storage, correction and removal', async () => {
  const w = mount(DurationControl, { props: { label: 'Deadline', modelValue: 'PT1H' } })
  expect(w.emitted('validity')?.at(-1)?.slice(0, 1)).toEqual([true])
  await w.getComponent(InputNumber).setValue(0)
  expect(w.emitted('validity')?.at(-1)?.slice(0, 1)).toEqual([false])
  expect(w.emitted('update:modelValue')).toBeUndefined()
  await w.getComponent(InputNumber).setValue(2)
  expect(w.emitted('validity')?.at(-1)?.slice(0, 1)).toEqual([true])
  await w.setProps({ modelValue: 'unsupported' })
  expect(w.emitted('validity')?.at(-1)?.slice(0, 1)).toEqual([false])
  w.unmount(); expect(w.emitted('validity')?.at(-1)?.slice(0, 1)).toEqual([true])
})

it('reports an unparseable attempted duration without clearing the stored value', async () => {
  const w = mount(DurationControl, { props: { label: 'Deadline', modelValue: 'PT1H' } })
  w.getComponent(InputNumber).vm.$emit('input', { value: '-', formattedValue: '-' })
  expect(w.emitted('validity')?.at(-1)?.slice(0, 1)?.[0]).toBe(false)
  w.getComponent(InputNumber).vm.$emit('update:modelValue', null)
  expect(w.emitted('validity')?.at(-1)?.[0]).toBe(false)
  expect(w.emitted('update:modelValue')).toBeUndefined(); w.unmount()
})

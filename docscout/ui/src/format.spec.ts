// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import {describe,it,expect} from 'vitest'
import {when} from './format'
describe('when',()=>{
 const now=new Date('2026-10-28T15:00:00')
 it('shows only the time for today',()=>{expect(when('2026-10-28T09:05:00',now)).toBe(new Date('2026-10-28T09:05:00').toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'}))})
 it('shows the day and time within the year, and the year otherwise',()=>{
  expect(when('2026-03-02T09:05:00',now)).toBe(new Date('2026-03-02T09:05:00').toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}))
  expect(when('2025-03-02T09:05:00',now)).toBe(new Date('2025-03-02T09:05:00').toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}))
 })
})

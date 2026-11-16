// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { expect, it } from 'vitest'
import { installGraphStyles } from './processGraphStyles'
it('installs map styles synchronously in each owning shadow root, once', () => {
  const host = document.createElement('div'), root = host.attachShadow({ mode: 'open' }), target = document.createElement('div')
  document.body.append(host)
  root.append(target)
  installGraphStyles(target)
  expect(root.querySelector('style')?.textContent).toContain('.work-state-card')
  installGraphStyles(target)
  expect(root.querySelectorAll('style')).toHaveLength(1)
  host.remove()
})

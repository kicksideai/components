// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import styles from './processGraph.css?inline'
const roots = new WeakSet<ShadowRoot>()
export function installGraphStyles(element: HTMLElement) {
  const root = element.getRootNode()
  if (root instanceof ShadowRoot && !roots.has(root)) {
    const sheet = element.ownerDocument.createElement('style')
    sheet.textContent = styles
    root.append(sheet)
    roots.add(root)
  }
}

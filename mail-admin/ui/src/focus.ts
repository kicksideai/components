// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { nextTick, watch } from 'vue'

// The focused element, looking through open shadow roots.
export function focusedElement(): HTMLElement | null {
  let active: Element | null = document.activeElement
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement
  return active instanceof HTMLElement ? active : null
}

// Focus goes back to the control that opened an overlay when it closes.
export function useReturnFocus(visible: () => boolean) {
  let opener: HTMLElement | null = null
  watch(visible, open => {
    if (open) { opener = focusedElement(); return }
    const target = opener
    opener = null
    void nextTick(() => { if (target?.isConnected) target.focus() })
  })
}

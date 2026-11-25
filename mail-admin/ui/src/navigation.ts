// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
export function navigate(target: EventTarget | null | undefined, path: string): void {
  target?.dispatchEvent(new CustomEvent('navigate', { detail: { path }, bubbles: true, composed: true }))
}

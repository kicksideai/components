// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
export function requestGeneration() {
  let generation = 0
  return { begin: () => ++generation, current: (value: number) => value === generation }
}

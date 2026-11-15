// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
export type Dec = { m: number; e: number }
export function decimalText(d: Dec): string {
  const digits = Math.abs(d.m).toString()
  const sign = d.m < 0 ? '-' : ''
  if (d.e >= 0) return sign + digits + '0'.repeat(d.e)
  const scale = -d.e
  const padded = digits.padStart(scale + 1, '0')
  return sign + padded.slice(0, padded.length - scale) + '.' + padded.slice(padded.length - scale)
}

// humanize turns an attribute or term code into a label: "net_weight" -> "Net weight".
export function humanize(code: string): string {
  const last = code.includes('.') ? code.slice(code.indexOf('.') + 1) : code
  const words = last.replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').trim()
  return words ? words[0].toUpperCase() + words.slice(1) : code
}

export function termLabel(term: { code: string; labels: Record<string, string> }): string {
  return term.labels.en ?? Object.values(term.labels)[0] ?? term.code
}

// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
export type DurationUnit = 'seconds' | 'minutes' | 'hours' | 'days'
const seconds: Record<DurationUnit, number> = { seconds: 1, minutes: 60, hours: 3600, days: 86400 }
export function durationParts(value: string, unit?: DurationUnit): { amount: number; unit: DurationUnit } | undefined {
  const weeks = /^P(\d+)W$/.exec(value)
  const match = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?)?$/.exec(value)
  if (!weeks && (!match || value === 'P' || value.endsWith('T'))) return undefined
  const total = weeks ? Number(weeks[1]) * 604800 : Number(match![1] ?? 0) * 86400 + Number(match![2] ?? 0) * 3600 + Number(match![3] ?? 0) * 60 + Number(match![4] ?? 0)
  if (!Number.isFinite(total) || total <= 0) return undefined
  const chosen = unit ?? (total % 86400 === 0 ? 'days' : total % 3600 === 0 ? 'hours' : total < 60 ? 'seconds' : 'minutes')
  return { amount: total / seconds[chosen], unit: chosen }
}
export function durationValue(amount: number | null | undefined, unit: DurationUnit): string | undefined {
  if (amount == null) return undefined
  if (!Number.isFinite(amount * seconds[unit]) || amount <= 0) throw new Error('Enter a positive duration.')
  const text = (value: number) => value.toLocaleString('en-US', { useGrouping: false, maximumSignificantDigits: 21 })
  if (!Number.isInteger(amount)) return `PT${text(amount * seconds[unit])}S`
  const suffix = { seconds: 'S', minutes: 'M', hours: 'H', days: 'D' }[unit]
  return (unit === 'days' ? 'P' : 'PT') + text(amount) + suffix
}

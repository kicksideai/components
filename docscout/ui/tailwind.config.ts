// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import themePreset from '@wippy-fe/theme/tailwind.config'

// Preflight supplies the base styles used by the theme's PrimeVue rules.
export default {
  presets: [themePreset],
  content: ['./src/**/*.{vue,ts}'],
}

import type { Mode } from './time'

type Pal = 'cream' | 'sand' | 'green' | 'ink' | 'night'

/** Each section's palette by time of day. After the kitchen shuts, nothing is light. */
const SURFACES: Record<string, Record<Mode, Pal>> = {
  hero: { day: 'cream', evening: 'green', late: 'night' },
  week: { day: 'sand', evening: 'ink', late: 'ink' },
  food: { day: 'cream', evening: 'cream', late: 'green' },
  weekends: { day: 'green', evening: 'sand', late: 'ink' },
  late: { day: 'night', evening: 'night', late: 'night' },
  pub: { day: 'cream', evening: 'green', late: 'green' },
  history: { day: 'sand', evening: 'ink', late: 'ink' },
  reviews: { day: 'cream', evening: 'cream', late: 'green' },
  parties: { day: 'green', evening: 'green', late: 'ink' },
  find: { day: 'ink', evening: 'ink', late: 'night' },
  menu: { day: 'cream', evening: 'cream', late: 'ink' },
}

export const pal = (section: keyof typeof SURFACES | string, mode: Mode) =>
  `pal-${SURFACES[section]?.[mode] ?? 'cream'}`

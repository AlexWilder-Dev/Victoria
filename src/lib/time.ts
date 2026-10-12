import { BAR_HOURS, DEALS, KITCHEN_HOURS, SERVICES, WEEK, type Deal, type DayKey, type Span } from '../data/venue'

const JS_DAYS: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

/** Before this hour, the clock still belongs to the previous night. */
const NIGHT_ROLLOVER = 6 * 60

export interface CalDate {
  y: number
  m: number
  d: number
}

export interface Clock {
  /** Calendar weekday in London. */
  day: DayKey
  /** Minutes since midnight, London. */
  minutes: number
  date: CalDate
  overridden: boolean
}

export type Mode = 'day' | 'evening' | 'late'
export type ShiftState = 'before' | 'open' | 'after'

export interface Status {
  clock: Clock
  /** The trading day this moment belongs to: 1am Saturday is Friday night. */
  day: DayKey
  /** Minutes since midnight of the trading day (can run past 1440). */
  minutes: number
  bar: { state: ShiftState; span: Span }
  kitchen: { state: ShiftState; span: Span }
  mode: Mode
  deals: Deal[]
}

export const prevDay = (d: DayKey): DayKey => WEEK[(WEEK.indexOf(d) + 6) % 7]
export const nextDay = (d: DayKey): DayKey => WEEK[(WEEK.indexOf(d) + 1) % 7]

export function addDays(date: CalDate, n: number): CalDate {
  const t = new Date(Date.UTC(date.y, date.m - 1, date.d + n))
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() }
}

export function weekdayOf(date: CalDate): DayKey {
  return JS_DAYS[new Date(Date.UTC(date.y, date.m - 1, date.d)).getUTCDay()]
}

export const dateKey = (d: CalDate) => `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}`

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const monthShort = (d: CalDate) => MONTHS[d.m - 1]

export function londonClock(now = new Date()): Clock {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'short',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(now)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '0'
  const day = get('weekday').toLowerCase().slice(0, 3) as DayKey
  return {
    day,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
    date: {
      y: Number(get('year')),
      m: Number(get('month')),
      d: Number(get('day')),
    },
    overridden: false,
  }
}

/**
 * Demo override, e.g. ?at=fri-21:30, ?at=sat-01:00, ?at=sun-1pm.
 * The date becomes the next one (or today) that falls on that weekday.
 */
export function parseAt(raw: string | null, real: Clock): Clock | null {
  if (!raw) return null
  const m = raw
    .trim()
    .toLowerCase()
    .match(/^(mon|tue|wed|thu|fri|sat|sun)[a-z]*[-_ ]?(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)?$/)
  if (!m) return null
  const day = m[1] as DayKey
  let hour = Number(m[2])
  const minute = Number(m[3] ?? 0)
  if (m[4] === 'pm' && hour < 12) hour += 12
  if (m[4] === 'am' && hour === 12) hour = 0
  if (hour > 23 || minute > 59) return null
  const ahead = (WEEK.indexOf(day) - WEEK.indexOf(real.day) + 7) % 7
  return {
    day,
    minutes: hour * 60 + minute,
    date: addDays(real.date, ahead),
    overridden: true,
  }
}

export function readAtParam(): string | null {
  const fromSearch = new URLSearchParams(window.location.search).get('at')
  if (fromSearch) return fromSearch
  const hashQuery = window.location.hash.split('?')[1]
  return hashQuery ? new URLSearchParams(hashQuery).get('at') : null
}

const stateOf = (span: Span, minutes: number): ShiftState =>
  minutes < span.open ? 'before' : minutes < span.close ? 'open' : 'after'

export function dealsOn(day: DayKey): Deal[] {
  return DEALS.filter((d) => d.days.includes(day))
}

export function statusAt(clock: Clock): Status {
  const late = clock.minutes < NIGHT_ROLLOVER
  const day = late ? prevDay(clock.day) : clock.day
  const minutes = late ? clock.minutes + 1440 : clock.minutes
  const barSpan = BAR_HOURS[day]
  const kitchenSpan = KITCHEN_HOURS[day]
  const bar = stateOf(barSpan, minutes)
  const kitchen = stateOf(kitchenSpan, minutes)

  let mode: Mode = 'day'
  if (bar === 'after' || (bar === 'open' && kitchen === 'after')) mode = 'late'
  else if (minutes >= 17 * 60) mode = 'evening'

  return {
    clock,
    day,
    minutes,
    bar: { state: bar, span: barSpan },
    kitchen: { state: kitchen, span: kitchenSpan },
    mode,
    deals: dealsOn(day),
  }
}

/* ---------- Formatting ---------- */

const pad = (n: number) => String(n).padStart(2, '0')

/** 1050 -> "5:30pm", 720 -> "noon", 1440 -> "midnight", 1560 -> "2am". */
export function fmtTime(min: number, { words = true } = {}): string {
  const m = ((min % 1440) + 1440) % 1440
  if (words && m === 0) return 'midnight'
  if (words && m === 720) return 'noon'
  const h = Math.floor(m / 60)
  const mm = m % 60
  const suffix = h < 12 ? 'am' : 'pm'
  const h12 = h % 12 || 12
  return `${h12}${mm ? `:${pad(mm)}` : ''}${suffix}`
}

/** "till 10", "till 2", "till midnight": how the bar staff would say it. */
export function fmtTill(min: number): string {
  const m = ((min % 1440) + 1440) % 1440
  if (m === 0) return 'midnight'
  if (m === 720) return 'noon'
  const h = Math.floor(m / 60) % 12 || 12
  const mm = m % 60
  return mm ? `${h}:${pad(mm)}` : `${h}`
}

/** 1050..1320 -> "5:30–10pm"; 960..1440 -> "4pm–midnight"; with noon: 720..1560 -> "noon–2am". */
export function fmtRange(a: number, b: number, { noon = false } = {}): string {
  const end = fmtTime(b)
  const am = ((a % 1440) + 1440) % 1440
  if (noon && am === 720) return `noon–${end}`
  const startFull = fmtTime(a, { words: false })
  const endIsWord = end === 'midnight' || end === 'noon'
  const sameHalf = !endIsWord && startFull.slice(-2) === end.slice(-2)
  return `${sameHalf ? startFull.slice(0, -2) : startFull}–${end}`
}

/** 24h clock string for the live readout, e.g. "21:30". */
export const fmtClock = (min: number) => `${pad(Math.floor(min / 60) % 24)}:${pad(min % 60)}`

/* ---------- What's on ---------- */

export type DealState = 'now' | 'later' | 'done'

export function dealState(deal: { start: number; end: number }, minutes: number): DealState {
  return minutes < deal.start ? 'later' : minutes < deal.end ? 'now' : 'done'
}

/** The next day (after `from`) with a food or drink deal. */
export function nextDealAfter(from: DayKey): { day: DayKey; deal: Deal } {
  let d = nextDay(from)
  for (let i = 0; i < 7; i++) {
    const deal = dealsOn(d)[0]
    if (deal) return { day: d, deal }
    d = nextDay(d)
  }
  return { day: 'mon', deal: DEALS[0] }
}

export function servicesOn(day: DayKey) {
  return Object.entries(SERVICES)
    .filter(([, s]) => s.days.includes(day))
    .map(([id, s]) => ({ id, ...s }))
}

/* ---------- Booking slots ---------- */

export interface Occasion {
  id: 'brunch' | 'boozy' | 'roast' | 'birthday' | 'dinner'
  label: string
  days?: DayKey[]
  start?: number
  end?: number
  rule?: string
}

export const OCCASIONS: Occasion[] = [
  {
    id: 'brunch',
    label: 'Brunch',
    days: ['sat'],
    start: 12 * 60,
    end: 16 * 60,
    rule: 'Saturdays, 12–4pm',
  },
  {
    id: 'boozy',
    label: 'Boozy lunch',
    days: ['sat', 'sun'],
    start: 12 * 60,
    end: 15 * 60,
    rule: 'Sat & Sun, 12–3pm',
  },
  {
    id: 'roast',
    label: 'Sunday roast',
    days: ['sun'],
    start: 12 * 60,
    end: 21 * 60,
    rule: 'Sundays, 12–9pm',
  },
  { id: 'birthday', label: 'Birthday' },
  { id: 'dinner', label: 'Dinner' },
]

export const occasionFits = (o: Occasion, day: DayKey) => !o.days || o.days.includes(day)

/** Half-hourly slots that sit inside kitchen hours (and the occasion's window). */
export function slotsFor(day: DayKey, occasion?: Occasion | null): number[] {
  const k = KITCHEN_HOURS[day]
  const start = Math.max(k.open, occasion?.start ?? 0)
  const end = Math.min(k.close, occasion?.end ?? Infinity)
  const out: number[] = []
  for (let t = start; t + 30 <= end; t += 30) out.push(t)
  return out
}

import { BAR_HOURS, DAY_NAMES, DEALS, SERVICES, type DayKey } from '../data/venue'
import type { Occasion } from './time'
import { dealState, fmtRange, fmtTill, fmtTime, nextDay, nextDealAfter, type DealState, type Status } from './time'

export interface Line {
  text: string
  tone?: 'good' | 'warn' | 'off'
}

/** When the bar next opens after this trading day. */
const nextOpen = (day: DayKey) => BAR_HOURS[nextDay(day)].open

export function barLine(s: Status): Line {
  const { state, span } = s.bar
  if (state === 'open') return { text: `Open till ${fmtTime(span.close)}`, tone: 'good' }
  if (state === 'before') return { text: `Opens at ${fmtTime(span.open)}`, tone: 'warn' }
  return { text: `Closed. Back at ${fmtTime(nextOpen(s.day))}`, tone: 'off' }
}

export function kitchenLine(s: Status): Line {
  const { state, span } = s.kitchen
  if (state === 'open') return { text: `Open till ${fmtTill(span.close)}`, tone: 'good' }
  if (state === 'before') return { text: `From ${fmtTime(span.open)}`, tone: 'warn' }
  return { text: `Closed. Back at ${fmtTime(nextOpen(s.day))}`, tone: 'off' }
}

export interface OnItem {
  id: string
  name: string
  start: number
  end: number
  price?: string
}

/** Everything that's on for a trading day: deals and weekend food services together. */
export function whatsOn(day: DayKey): OnItem[] {
  const items: OnItem[] = DEALS.filter((d) => d.days.includes(day)).map((d) => ({
    id: d.id,
    name: d.name,
    start: d.start,
    end: d.end,
    price: d.id === 'boozy-lunch' ? '+£25 for 7 drinks' : d.id === 'happy-friday' ? '2 frozen cocktails £12' : d.price,
  }))
  if (SERVICES.brunch.days.includes(day))
    items.push({
      id: 'brunch',
      name: 'Saturday Brunch',
      start: SERVICES.brunch.start,
      end: SERVICES.brunch.end,
    })
  if (SERVICES.roast.days.includes(day))
    items.push({
      id: 'roast',
      name: 'Sunday Roast',
      start: SERVICES.roast.start,
      end: SERVICES.roast.end,
    })
  return items
}

const PRIORITY = ['burger', 'steak', 'happy-friday', 'boozy-lunch', 'roast', 'brunch', 'spritz']

/** "Tomorrow", "Thursday", or "Today" when it's already past midnight. */
export function relDay(target: DayKey, s: Status): string {
  if (s.minutes >= 1440 && target === s.clock.day) return 'Today'
  if (target === nextDay(s.day)) return 'Tomorrow'
  return DAY_NAMES[target]
}

export interface OnNow {
  state: DealState | 'none'
  label: string
  title: string
  detail: string
}

export function onTonight(s: Status): OnNow {
  const items = whatsOn(s.day).sort((a, b) => PRIORITY.indexOf(a.id) - PRIORITY.indexOf(b.id))
  const priced = (i: OnItem) => (i.price ? ` · ${i.price}` : '')
  const now = items.find((i) => dealState(i, s.minutes) === 'now')
  if (now)
    return {
      state: 'now',
      label: 'On now',
      title: now.name,
      detail: `Till ${fmtTime(now.end)}${priced(now)}`,
    }
  const later = items.filter((i) => s.minutes < i.start).sort((a, b) => a.start - b.start)[0]
  if (later)
    return {
      state: 'later',
      label: later.start >= 17 * 60 ? 'Tonight' : 'Today',
      title: later.name,
      detail: `${fmtRange(later.start, later.end)}${priced(later)}`,
    }
  const next = nextDealAfter(s.day)
  const nextItem = whatsOn(next.day).find((i) => i.id === next.deal.id)!
  return {
    state: items.length ? 'done' : 'none',
    label: items.length ? 'Next up' : 'No deal tonight · next up',
    title: `${relDay(next.day, s)}: ${next.deal.name}`,
    detail: `${fmtRange(nextItem.start, nextItem.end)}${priced(nextItem)}`,
  }
}

/* ---------- Hero ---------- */

export interface HeroCopy {
  lines: string[]
  /** Index of the line set in italic. */
  em?: number
  sub: string
  book: { label: string; occasion?: Occasion['id'] }
  more: { label: string; to: string }
  tile: 'outside' | 'burger' | 'steak' | 'frozen' | 'home' | 'screens'
  tileCaption: string
}

const STAY_LATE = ['Eat well.', 'Drink better.', 'Stay late.']

export function heroCopy(s: Status): HeroCopy {
  const { day, mode, minutes } = s
  const barOpen = s.bar.state === 'open'
  const kClose = fmtTill(s.kitchen.span.close)
  const doors = fmtTime(s.bar.span.open)

  if (mode === 'late') {
    if (!barOpen) {
      const next = nextDealAfter(day)
      return {
        lines: ["We're closed.", `Back at ${fmtTime(nextOpen(day))}.`],
        em: 1,
        sub: `Get some sleep. ${relDay(next.day, s)} it's ${next.deal.name}${next.deal.price && !next.deal.price.startsWith('+') ? `, ${next.deal.price}` : ''}, and you can book it now.`,
        book: { label: 'Book a table' },
        more: { label: 'See the week', to: '#week' },
        tile: 'screens',
        tileCaption: 'See you tomorrow',
      }
    }
    const till = fmtTill(s.bar.span.close)
    const happy = day === 'fri' && minutes < 23 * 60
    return {
      lines: ["Kitchen's closed.", `Bar's open till ${till}.`],
      em: 1,
      sub: happy
        ? "Happy Friday's on till 11: 2 frozen cocktails £12, 2 Aperol Spritz £14, 2 seasonal spritz £16."
        : s.bar.span.close > 24 * 60
          ? 'Fizz on ice, the light-up Dom Pérignon if you mean it, and a dress code that asks for a sense of occasion.'
          : `Kitchen's back at ${fmtTime(nextOpen(day))} tomorrow. Until then, there's the bar.`,
      book: { label: 'Book a table' },
      more: { label: 'Late at The Vic', to: '#late' },
      tile: 'screens',
      tileCaption: `Open till ${fmtTime(s.bar.span.close)}`,
    }
  }

  if (mode === 'evening') {
    if (day === 'mon')
      return {
        lines: ['Burger Night.', '£13.95.'],
        em: 1,
        sub: `Any burger, wrap or hotdog with fries and a free drink. ${minutes < 17 * 60 + 30 ? 'From 5:30 till 10pm' : 'On now till 10pm'}.`,
        book: { label: 'Book Burger Night', occasion: 'dinner' },
        more: { label: 'See the burgers', to: '/menu/food#mains' },
        tile: 'burger',
        tileCaption: 'Burger Night · Mondays',
      }
    if (day === 'thu')
      return {
        lines: ['Steak Night.', '£18.95.'],
        em: 1,
        sub: `330g (10oz) Black Angus sirloin, chunky chips, trimmings and a free drink. ${minutes < 17 * 60 + 30 ? 'From 5:30 till 10pm' : 'On now till 10pm'}.`,
        book: { label: 'Book Steak Night', occasion: 'dinner' },
        more: { label: 'The full menu', to: '/menu/food' },
        tile: 'steak',
        tileCaption: 'Steak Night · Thursdays',
      }
    if (day === 'fri')
      return {
        lines: ['Happy', 'Friday.'],
        em: 1,
        sub: `${minutes < 20 * 60 ? 'From 8 till 11pm' : 'On now till 11pm'}: 2 frozen cocktails £12, 2 Aperol Spritz £14, 2 seasonal spritz £16, 30% off a bottle of prosecco, and shot deals. Kitchen till ${kClose}, bar till 2.`,
        book: { label: 'Book Friday', occasion: 'dinner' },
        more: { label: "What's on late", to: '#late' },
        tile: 'frozen',
        tileCaption: 'Happy Friday · 8–11pm',
      }
    if (day === 'sat')
      return {
        lines: ['Saturday night.', 'Bar till 2.'],
        em: 1,
        sub: `Kitchen's on till ${kClose}, the fizz is cold, and the dress code asks for a sense of occasion.`,
        book: { label: 'Book tonight', occasion: 'dinner' },
        more: { label: "What's on late", to: '#late' },
        tile: 'home',
        tileCaption: 'Saturday · open till 2am',
      }
    if (day === 'sun')
      return {
        lines: ["Roast's on", 'till 9.'],
        em: 1,
        sub: 'Pork belly & crackling, Black Angus sirloin, herb-roasted chicken or the plant-based roast. Yorkshire pudding comes as standard.',
        book: { label: 'Book a roast', occasion: 'roast' },
        more: { label: 'Roast menu', to: '/menu/roast' },
        tile: 'home',
        tileCaption: 'Sunday roast · 12–9pm',
      }
    return {
      lines: STAY_LATE,
      em: 2,
      sub: `Kitchen's on till ${kClose}: Wagyu burgers, Black Angus ribeye, truffle mac 'n' cheese. And Thursday is Steak Night.`,
      book: { label: 'Book tonight', occasion: 'dinner' },
      more: { label: 'The full menu', to: '/menu/food' },
      tile: 'home',
      tileCaption: `${DAY_NAMES[day]} · kitchen till ${kClose}`,
    }
  }

  // Daytime: lead with brunch, lunch and outside.
  const open = barOpen ? "We're open" : `Doors at ${doors}`
  if (day === 'sat')
    return {
      lines: ['Brunch.', 'Boozy lunch.', 'Then see.'],
      em: 2,
      sub: `${open}. Brunch 12–4pm. Boozy lunch 12–3pm: add £25 for 7 drinks, no time limit on drinking them. Seasonal spritzes 2 for £16 till 4.`,
      book: { label: 'Book brunch', occasion: 'brunch' },
      more: { label: 'Brunch menu', to: '/menu/brunch' },
      tile: 'outside',
      tileCaption: 'Outside · heaters & awnings',
    }
  if (day === 'sun')
    return {
      lines: ['Sunday roast,', 'served till 9.'],
      em: 1,
      sub: `${open}. Every roast comes with Yorkshire pudding, roast potatoes and chef's red wine jus. Boozy lunch 12–3pm, spritzes 2 for £16 till 4.`,
      book: { label: 'Book a roast', occasion: 'roast' },
      more: { label: 'Roast menu', to: '/menu/roast' },
      tile: 'outside',
      tileCaption: 'Outside · heaters & awnings',
    }
  if (day === 'fri')
    return {
      lines: ['Friday starts', 'at noon.'],
      em: 1,
      sub: `${open}. Lunch from noon, Happy Friday from 8, and the bar's open till 2am.`,
      book: { label: 'Book Friday', occasion: 'dinner' },
      more: { label: 'See the menu', to: '/menu/food' },
      tile: 'outside',
      tileCaption: 'Outside · heaters & awnings',
    }
  const tonight =
    day === 'mon'
      ? "Tonight it's Burger Night: any burger, wrap or hotdog with fries and a free drink, £13.95."
      : day === 'thu'
        ? "Tonight it's Steak Night: 330g Black Angus sirloin, chunky chips, trimmings and a free drink, £18.95."
        : `Kitchen's on 4–${kClose}pm. This weekend: brunch, boozy lunch and the Sunday roast.`
  return {
    lines: STAY_LATE,
    em: 2,
    sub: `${open}. ${tonight}`,
    book: {
      label: 'Book a table',
      occasion: day === 'mon' || day === 'thu' ? 'dinner' : undefined,
    },
    more: { label: 'See the week', to: '#week' },
    tile: 'outside',
    tileCaption: 'Outside · heaters & awnings',
  }
}

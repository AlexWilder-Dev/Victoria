import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTonight } from '../lib/tonight'
import { useBooking } from '../lib/booking'
import { pal } from '../lib/surface'
import { fmtRange } from '../lib/time'
import { Typewriter, type Segment } from '../components/Typewriter'
import { BAR_HOURS, DAY_NAMES, DAY_SHORT, KITCHEN_HOURS, WEEK, type DayKey } from '../data/venue'
import './Week.css'

interface DayPlan {
  tag: string
  title: string
  time?: string
  segments: Segment[]
  book: string
  occasion?: 'brunch' | 'boozy' | 'roast' | 'dinner'
}

const hours = (d: DayKey) =>
  `Kitchen ${fmtRange(KITCHEN_HOURS[d].open, KITCHEN_HOURS[d].close, { noon: true })} · Bar ${fmtRange(BAR_HOURS[d].open, BAR_HOURS[d].close, { noon: true })}`

const line = (text: string, className = 'tw-line'): Segment => ({
  text,
  className,
})

/** Every day, exactly as the pub runs it. */
const PLAN: Record<DayKey, DayPlan> = {
  mon: {
    tag: 'Burger Night',
    title: 'Burger Night',
    time: '5:30–10pm',
    segments: [
      line('Any burger, wrap or hotdog with fries and a free drink.'),
      { text: 'Burger Night, 5:30–10pm', end: '£13.95', className: 'tw-price' },
    ],
    book: 'Book Monday',
    occasion: 'dinner',
  },
  tue: {
    tag: 'Full menu',
    title: 'Just the Vic',
    segments: [
      line('No deal, no gimmicks. The full menu, the free games room out the back, and the bar till midnight.'),
      line("Steak Night's on Thursday, if you can wait.", 'tw-line tw-aside'),
    ],
    book: 'Book Tuesday',
    occasion: 'dinner',
  },
  wed: {
    tag: 'Full menu',
    title: 'Midweek',
    segments: [
      line('Halfway there. Wagyu burgers, Black Angus ribeye and truffle mac ’n’ cheese, kitchen till 10.'),
      line("Steak Night's tomorrow. Just saying.", 'tw-line tw-aside'),
    ],
    book: 'Book Wednesday',
    occasion: 'dinner',
  },
  thu: {
    tag: 'Steak Night',
    title: 'Steak Night',
    time: '5:30–10pm',
    segments: [
      line('330g (10oz) Black Angus sirloin, chunky chips, trimmings and a free drink.'),
      { text: 'Steak Night, 5:30–10pm', end: '£18.95', className: 'tw-price' },
    ],
    book: 'Book Thursday',
    occasion: 'dinner',
  },
  fri: {
    tag: 'Happy Friday',
    title: 'Happy Friday',
    time: '8–11pm',
    segments: [
      { text: '2 frozen cocktails', end: '£12' },
      { text: '2 Aperol Spritz', end: '£14' },
      { text: '2 seasonal spritz', end: '£16' },
      { text: 'Bottle of prosecco', end: '30% off' },
      line('Shot deals'),
      line('Then the bar stays open till 2am.', 'tw-line tw-aside'),
    ],
    book: 'Book Friday',
    occasion: 'dinner',
  },
  sat: {
    tag: 'Brunch · Boozy Lunch',
    title: 'Brunch & Boozy Lunch',
    time: 'from noon',
    segments: [
      { text: 'Saturday brunch', end: '12–4pm' },
      { text: 'Boozy lunch', end: '12–3pm' },
      line(
        'Any meal from the main, brunch or roast menu. Add £25 for 7 drinks from a selected list, no time limit on drinking them.',
        'tw-line tw-small',
      ),
      { text: 'Seasonal spritzes, 12–4pm', end: '2 for £16' },
      line('Bar till 2am.', 'tw-line tw-aside'),
    ],
    book: 'Book brunch',
    occasion: 'brunch',
  },
  sun: {
    tag: 'Roast · Boozy Lunch',
    title: 'Sunday Roast',
    time: '12–9pm',
    segments: [
      { text: 'Sunday roast', end: '12–9pm' },
      line(
        'Pork belly & crackling, Black Angus sirloin, herb-roasted chicken or the plant-based roast. Subject to availability.',
        'tw-line tw-small',
      ),
      { text: 'Boozy lunch: add £25 for 7 drinks', end: '12–3pm' },
      { text: 'Seasonal spritzes, 12–4pm', end: '2 for £16' },
    ],
    book: 'Book a roast',
    occasion: 'roast',
  },
}

export function Week() {
  const s = useTonight()
  const { open } = useBooking()
  const [picked, setPicked] = useState<DayKey | null>(null)
  const day = picked ?? s.day
  const plan = PLAN[day]

  return (
    <section id="week" className={`section week ${pal('week', s.mode)}`} aria-labelledby="week-title">
      <div className="wrap">
        <header className="week__head">
          <p className="label muted">The week</p>
          <h2 id="week-title" className="h2">
            Pick a <em className="serif-em">night.</em>
          </h2>
          <p className="lede muted">Tap a day and we'll type it up.</p>
        </header>

        <div className="week__days" role="tablist" aria-label="Days of the week">
          {WEEK.map((d) => {
            const isToday = d === s.day
            const on = d === day
            return (
              <button
                key={d}
                role="tab"
                id={`tab-${d}`}
                aria-selected={on}
                aria-controls="week-panel"
                className={`wd ${on ? 'is-on' : ''} ${isToday ? 'is-today' : ''}`}
                onClick={() => setPicked(d)}
              >
                <span className="wd__name">{DAY_SHORT[d]}</span>
                <span className="wd__tag label">{PLAN[d].tag}</span>
                {isToday && <span className="wd__today label">{s.minutes >= 1440 ? 'Tonight' : 'Today'}</span>}
                {on && (
                  <motion.span layoutId="wd-mark" className="wd__mark" aria-hidden="true">
                    <span />
                  </motion.span>
                )}
              </button>
            )
          })}
        </div>

        <div id="week-panel" className="week__panel" role="tabpanel" aria-labelledby={`tab-${day}`}>
          <div className="week__big" aria-hidden="true">
            <span>{DAY_NAMES[day]}</span>
          </div>
          <div className="docket">
            <p className="docket__meta label">
              {DAY_NAMES[day]}
              {plan.time ? ` · ${plan.time}` : ''}
              {day === s.day && <span className="docket__live"> · {s.minutes >= 1440 ? 'tonight' : 'today'}</span>}
            </p>
            <Typewriter
              key={day}
              className="docket__typed typed"
              duration={1500}
              onView
              holdCaret={false}
              segments={[{ text: `${plan.title}\n`, className: 'tw-title' }, ...plan.segments]}
            />
            <p className="docket__hours typed muted">{hours(day)}</p>
            <div className="docket__actions">
              <button className="btn" onClick={() => open({ day, occasion: plan.occasion })}>
                {plan.book}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

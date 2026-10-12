import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useBooking } from '../lib/booking'
import { useTonight } from '../lib/tonight'
import { useMedia } from '../lib/hooks'
import { useGoTo } from './GoLink'
import { Typewriter } from './Typewriter'
import {
  OCCASIONS,
  addDays,
  dateKey,
  fmtTime,
  monthShort,
  occasionFits,
  slotsFor,
  weekdayOf,
  type CalDate,
  type Occasion,
} from '../lib/time'
import { whatsOn } from '../lib/copy'
import { DAY_NAMES, DAY_SHORT, type DayKey } from '../data/venue'
import './BookingSheet.css'

const DAYS_AHEAD = 28
const MAX_GUESTS = 12

const SHORT_TAG: Record<string, string> = {
  burger: 'Burger Night',
  steak: 'Steak Night',
  'happy-friday': 'Happy Friday',
  brunch: 'Brunch',
  roast: 'Roast',
}

const LONG_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

interface DayOption {
  date: CalDate
  key: string
  day: DayKey
  slots: number[]
  tag?: string
}

export function BookingSheet() {
  const { isOpen, close, request, session } = useBooking()
  const s = useTonight()
  const desktop = useMedia('(min-width: 900px)')
  const reduce = useReducedMotion()
  const go = useGoTo()
  const panelRef = useRef<HTMLDivElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)

  const [occasion, setOccasion] = useState<Occasion | null>(null)
  const [dayKey, setDayKey] = useState<string>('')
  const [time, setTime] = useState<number | null>(null)
  const [guests, setGuests] = useState(2)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  /** Next four weeks, with only the slots still bookable today. */
  const days: DayOption[] = useMemo(() => {
    const out: DayOption[] = []
    for (let i = 0; i < DAYS_AHEAD; i++) {
      const date = addDays(s.clock.date, i)
      const day = weekdayOf(date)
      const all = slotsFor(day, occasion)
      const slots = i === 0 ? all.filter((t) => t > s.clock.minutes + 15) : all
      const on = whatsOn(day).find((o) => SHORT_TAG[o.id])
      out.push({
        date,
        key: dateKey(date),
        day,
        slots,
        tag: on ? SHORT_TAG[on.id] : undefined,
      })
    }
    return out
  }, [s.clock.date, s.clock.minutes, occasion])

  const chosen = days.find((d) => d.key === dayKey)

  /** Slots still open on a day for an occasion (today drops the ones already gone). */
  const openSlots = (d: DayOption, occ: Occasion | null) =>
    slotsFor(d.day, occ).filter((t) => d.key !== days[0].key || t > s.clock.minutes + 15)

  const firstFit = (occ: Occasion | null, weekday?: DayKey) =>
    days.find(
      (d) => (!weekday || d.day === weekday) && (!occ || occasionFits(occ, d.day)) && openSlots(d, occ).length > 0,
    )

  // Fresh sheet each time it opens, pre-set from wherever it was opened.
  useEffect(() => {
    if (!isOpen) return
    const occ = OCCASIONS.find((o) => o.id === request.occasion) ?? null
    setOccasion(occ)
    const first = firstFit(occ, request.day) ?? firstFit(occ)
    setDayKey(first?.key ?? days[0].key)
    setTime(null)
    setErrors({})
    setDone(false)
    setNote('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  // Keep time valid when the day or occasion changes.
  useEffect(() => {
    if (time !== null && chosen && !chosen.slots.includes(time)) setTime(null)
  }, [chosen, time])

  // Escape, focus, scroll lock.
  useEffect(() => {
    if (!isOpen) return
    lastFocus.current = document.activeElement as HTMLElement
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input, textarea, a[href]')
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>('.sheet__close')?.focus(), 80)
    return () => {
      html.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
      lastFocus.current?.focus?.()
    }
  }, [isOpen, close])

  const pickOccasion = (o: Occasion) => {
    const next = occasion?.id === o.id ? null : o
    setOccasion(next)
    if (next && chosen && (!occasionFits(next, chosen.day) || !openSlots(chosen, next).length)) {
      const fit = firstFit(next)
      if (fit) setDayKey(fit.key)
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!chosen) errs.date = 'Pick a day'
    if (time === null) errs.time = 'Pick a time'
    if (!occasion) errs.occasion = "What's the occasion?"
    if (name.trim().length < 2) errs.name = 'Who should we expect?'
    if (phone.replace(/\D/g, '').length < 10) errs.phone = 'A number we can reach you on, please'
    setErrors(errs)
    if (Object.keys(errs).length) {
      const firstErr = panelRef.current?.querySelector<HTMLElement>(`[data-field="${Object.keys(errs)[0]}"]`)
      firstErr?.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'center',
      })
      return
    }
    setDone(true)
  }

  const summary =
    chosen && time !== null
      ? `${DAY_SHORT[chosen.day]} ${chosen.date.d} ${monthShort(chosen.date)} · ${fmtTime(time)}`
      : null

  const variants = desktop ? { hidden: { x: '100%' }, shown: { x: 0 } } : { hidden: { y: '100%' }, shown: { y: 0 } }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="sheet-root">
          <motion.div
            className="sheet-scrim"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            ref={panelRef}
            className="sheet pal-cream"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
            variants={variants}
            initial="hidden"
            animate="shown"
            exit="hidden"
            transition={reduce ? { duration: 0 } : { type: 'spring', damping: 32, stiffness: 300 }}
          >
            <div className="sheet__head">
              <span className="sheet__grab" aria-hidden="true" />
              <h2 id="sheet-title" className="h3">
                {done ? "You're in." : 'Book a table'}
              </h2>
              <button className="sheet__close label" onClick={close}>
                Close
              </button>
            </div>

            {done && chosen && time !== null && occasion ? (
              <div className="sheet__body sheet__done">
                <div className="ticket">
                  <Typewriter
                    className="ticket__typed typed"
                    duration={1600}
                    segments={[
                      {
                        text: `TABLE FOR ${guests}\n`,
                        className: 'ticket__big',
                      },
                      {
                        text: `${DAY_NAMES[chosen.day]} ${chosen.date.d} ${LONG_MONTHS[chosen.date.m - 1]}\n`,
                      },
                      { text: `${fmtTime(time)} · ${occasion.label}\n` },
                      { text: `Under: ${name.trim()}\n` },
                      { text: `Phone: ${phone.trim()}` },
                    ]}
                  />
                </div>
                <p className="lede">
                  See you {chosen.key === days[0].key ? 'later' : DAY_NAMES[chosen.day]}, {name.trim().split(' ')[0]}.{' '}
                  {occasion.id === 'birthday'
                    ? 'Tell the team whose birthday it is when you arrive.'
                    : 'Dogs welcome, as ever.'}
                </p>
                <div className="sheet__done-actions">
                  <button className="btn" onClick={close}>
                    Done
                  </button>
                  <button className="btn btn--ghost" onClick={() => setDone(false)}>
                    Change it
                  </button>
                </div>
                <p className="sheet__fine label">Live version connects to your DesignMyNight bookings.</p>
              </div>
            ) : (
              <form className="sheet__body" onSubmit={submit} noValidate>
                <fieldset className="field" data-field="date">
                  <legend className="label">When</legend>
                  <div className="days" role="radiogroup" aria-label="Day">
                    {days.map((d, i) => {
                      const fits = !occasion || occasionFits(occasion, d.day)
                      const off = !fits || !d.slots.length
                      return (
                        <button
                          type="button"
                          key={d.key}
                          role="radio"
                          aria-checked={d.key === dayKey}
                          disabled={off}
                          className={`day ${d.key === dayKey ? 'is-on' : ''}`}
                          onClick={() => setDayKey(d.key)}
                        >
                          <span className="day__dow label">{i === 0 ? 'Today' : DAY_SHORT[d.day]}</span>
                          <span className="day__num">{d.date.d}</span>
                          <span className="day__mon label">{monthShort(d.date)}</span>
                          {d.tag && <span className="day__tag">{d.tag}</span>}
                        </button>
                      )
                    })}
                  </div>
                  {errors.date && <p className="field__err">{errors.date}</p>}
                </fieldset>

                <fieldset className="field" data-field="time">
                  <legend className="label">
                    Time{' '}
                    <span className="muted">
                      {occasion?.rule ? `· ${occasion.label}: ${occasion.rule}` : '· inside kitchen hours'}
                    </span>
                  </legend>
                  {chosen && chosen.slots.length ? (
                    <div className="slots" role="radiogroup" aria-label="Time">
                      {chosen.slots.map((t) => (
                        <button
                          type="button"
                          key={t}
                          role="radio"
                          aria-checked={time === t}
                          className={`slot typed ${time === t ? 'is-on' : ''}`}
                          onClick={() => setTime(t)}
                        >
                          {fmtTime(t, { words: false }).replace(/(am|pm)$/, '')}
                          <small>{t >= 720 ? 'pm' : 'am'}</small>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="muted">Kitchen's done for the day. Pick another one.</p>
                  )}
                  {errors.time && <p className="field__err">{errors.time}</p>}
                </fieldset>

                <fieldset className="field">
                  <legend className="label">Guests</legend>
                  <div className="stepper">
                    <button
                      type="button"
                      aria-label="Fewer guests"
                      disabled={guests <= 1}
                      onClick={() => setGuests((g) => g - 1)}
                    >
                      −
                    </button>
                    <output aria-live="polite">
                      <span className="stepper__n">{guests}</span> {guests === 1 ? 'guest' : 'guests'}
                    </output>
                    <button
                      type="button"
                      aria-label="More guests"
                      disabled={guests >= MAX_GUESTS}
                      onClick={() => setGuests((g) => g + 1)}
                    >
                      +
                    </button>
                  </div>
                  {guests >= 9 && (
                    <p className="field__hint">
                      Bigger than {MAX_GUESTS}?{' '}
                      <button
                        type="button"
                        className="inline-link"
                        onClick={() => {
                          close()
                          window.setTimeout(() => go('/#parties'), 250)
                        }}
                      >
                        Send a party enquiry
                      </button>{' '}
                      and we'll sort a big table.
                    </p>
                  )}
                </fieldset>

                <fieldset className="field" data-field="occasion">
                  <legend className="label">Occasion</legend>
                  <div className="occasions">
                    {OCCASIONS.map((o) => {
                      const fits = !chosen || occasionFits(o, chosen.day)
                      return (
                        <button
                          type="button"
                          key={o.id}
                          aria-pressed={occasion?.id === o.id}
                          className={`occ ${occasion?.id === o.id ? 'is-on' : ''} ${fits ? '' : 'is-elsewhere'}`}
                          onClick={() => pickOccasion(o)}
                        >
                          {o.label}
                          {o.rule && <small className="typed">{o.rule}</small>}
                        </button>
                      )
                    })}
                  </div>
                  {errors.occasion && <p className="field__err">{errors.occasion}</p>}
                </fieldset>

                <div className="field field--pair">
                  <label data-field="name">
                    <span className="label">Name</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
                    {errors.name && <span className="field__err">{errors.name}</span>}
                  </label>
                  <label data-field="phone">
                    <span className="label">Phone</span>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="07…"
                      required
                    />
                    {errors.phone && <span className="field__err">{errors.phone}</span>}
                  </label>
                </div>

                <label className="field">
                  <span className="label">
                    Anything we should know? <span className="muted">(optional)</span>
                  </span>
                  <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
                </label>

                <div className="sheet__foot">
                  <button className="btn sheet__submit" type="submit">
                    {summary ? `Book · ${summary}` : 'Book the table'}
                  </button>
                  <p className="sheet__fine label">Live version connects to your DesignMyNight bookings.</p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

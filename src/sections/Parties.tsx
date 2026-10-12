import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTonight } from '../lib/tonight'
import { pal } from '../lib/surface'
import { PHOTOS } from '../lib/media'
import { Pic, Wedge } from '../components/Media'
import { Typewriter } from '../components/Typewriter'
import { addDays, dateKey } from '../lib/time'
import './Parties.css'

const KINDS = ['birthday', 'big group', 'work do', 'leaving do', 'celebration']

type Field = 'name' | 'guests' | 'kind' | 'date' | 'phone' | 'email' | 'note'

/** The enquiry as one sentence: fill in the blanks. */
export function Parties() {
  const s = useTonight()
  const [form, setForm] = useState<Record<Field, string>>({
    name: '',
    guests: '',
    kind: 'birthday',
    date: '',
    phone: '',
    email: '',
    note: '',
  })
  const [errors, setErrors] = useState<Partial<Record<Field, boolean>>>({})
  const [sent, setSent] = useState(false)
  const min = dateKey(s.clock.date)
  const max = dateKey(addDays(s.clock.date, 365))
  const set = (k: Field) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: false }))
  }
  const bad = (k: Field) => (errors[k] ? 'blank is-bad' : 'blank')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: Partial<Record<Field, boolean>> = {
      name: form.name.trim().length < 2,
      guests: !(Number(form.guests) >= 2),
      date: !form.date,
      phone: form.phone.replace(/\D/g, '').length < 10,
      email: !/^\S+@\S+\.\S+$/.test(form.email),
    }
    setErrors(errs)
    if (!Object.values(errs).some(Boolean)) setSent(true)
  }

  const prettyDate = form.date
    ? new Date(`${form.date}T12:00:00`).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : ''
  const missing = Object.entries(errors).filter(([, v]) => v).length

  return (
    <section
      id="parties"
      className={`section edge-top parties ${pal('parties', s.mode)}`}
      aria-labelledby="parties-title"
    >
      <div className="wrap">
        <div className="parties__top">
          <div className="parties__intro">
            <p className="label muted">Parties &amp; big tables</p>
            <h2 id="parties-title" className="h2">
              Bring
              <br />
              <em className="serif-em">everyone.</em>
            </h2>
            <p className="lede">
              Birthdays, groups, the lot. Fill in the blanks and we'll come back to you with a plan.
            </p>
          </div>
          <Wedge className="parties__photo" cut={30}>
            <Pic photo={PHOTOS.terrace} sizes="(min-width: 1000px) 40vw, 100vw" position="45% 60%" />
          </Wedge>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              className="enquiry-done"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Typewriter
                className="enquiry-done__typed typed"
                duration={1600}
                segments={[
                  { text: 'ENQUIRY RECEIVED\n', className: 'tw-big' },
                  { text: `A ${form.kind} for ${form.guests}\n` },
                  { text: `${prettyDate}\n` },
                  {
                    text: `We'll be in touch, ${form.name.trim().split(' ')[0]}.`,
                  },
                ]}
              />
              <p className="label muted">Live version sends this straight to the team's inbox.</p>
              <button className="link-arrow" onClick={() => setSent(false)}>
                Send another <span aria-hidden="true">→</span>
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" className="madlib" onSubmit={submit} noValidate exit={{ opacity: 0 }}>
              <p className="madlib__text">
                Hi, I'm{' '}
                <input
                  className={bad('name')}
                  aria-label="Your name"
                  placeholder="your name"
                  value={form.name}
                  onChange={set('name')}
                  autoComplete="name"
                  size={10}
                />
                . There'll be{' '}
                <input
                  className={`${bad('guests')} blank--num`}
                  aria-label="Number of guests"
                  placeholder="20"
                  value={form.guests}
                  onChange={set('guests')}
                  inputMode="numeric"
                  size={3}
                />{' '}
                of us for a{' '}
                <span className="blank-select">
                  <select className="blank" aria-label="Occasion" value={form.kind} onChange={set('kind')}>
                    {KINDS.map((k) => (
                      <option key={k}>{k}</option>
                    ))}
                  </select>
                </span>{' '}
                on{' '}
                <input
                  className={`${bad('date')} blank--date`}
                  aria-label="Date"
                  type="date"
                  min={min}
                  max={max}
                  value={form.date}
                  onChange={set('date')}
                />
                . Call me on{' '}
                <input
                  className={bad('phone')}
                  aria-label="Phone"
                  placeholder="07…"
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  autoComplete="tel"
                  size={11}
                />{' '}
                or email{' '}
                <span className="nowrap">
                  <input
                    className={`${bad('email')} blank--wide`}
                    aria-label="Email"
                    placeholder="you@email.com"
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    autoComplete="email"
                    size={16}
                  />
                  .
                </span>
              </p>
              <label className="madlib__note">
                <span className="label muted">Anything else? (optional)</span>
                <textarea
                  rows={2}
                  value={form.note}
                  onChange={set('note')}
                  placeholder="Whose birthday, food, drinks, timings…"
                />
              </label>
              <div className="madlib__foot">
                <button className="btn" type="submit">
                  Send enquiry
                </button>
                {missing > 0 && (
                  <p className="madlib__err typed" role="alert">
                    {missing === 1 ? 'One blank to go.' : `${missing} blanks to go.`}
                  </p>
                )}
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

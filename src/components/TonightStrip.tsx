import { useTonight } from '../lib/tonight'
import { barLine, kitchenLine, onTonight } from '../lib/copy'
import { fmtClock } from '../lib/time'
import { DAY_SHORT, VENUE } from '../data/venue'
import { Typewriter } from './Typewriter'
import './TonightStrip.css'

/** Live: bar, kitchen and what's on, in London time. */
export function TonightStrip() {
  const s = useTonight()
  const bar = barLine(s)
  const kitchen = kitchenLine(s)
  const on = onTonight(s)
  const title = s.mode === 'day' && s.minutes < 17 * 60 ? 'Today at The Vic' : 'Tonight at The Vic'
  const stamp = `${DAY_SHORT[s.clock.day].toUpperCase()} ${fmtClock(s.clock.minutes)}`

  return (
    <aside className="strip" aria-label={title}>
      <div className="strip__head">
        <h2 className="strip__title">{title}</h2>
        <p className="strip__clock typed">
          <span className={`strip__live ${s.bar.state === 'open' ? 'is-open' : ''}`} aria-hidden="true" />
          <time>{stamp}</time> <span className="muted">London</span>
        </p>
      </div>

      <dl className="strip__cells" key={`${s.day}-${s.mode}-${on.title}`}>
        <div className={`strip__cell tone-${bar.tone}`}>
          <dt className="label">Bar</dt>
          <Typewriter as="dd" className="typed strip__val" segments={bar.text} duration={500} caret={false} />
        </div>
        <div className={`strip__cell tone-${kitchen.tone}`}>
          <dt className="label">Kitchen</dt>
          <Typewriter as="dd" className="typed strip__val" segments={kitchen.text} duration={500} caret={false} />
        </div>
        <div className={`strip__cell strip__cell--on state-${on.state}`}>
          <dt className="label">{on.label}</dt>
          <dd>
            <span className="strip__deal">{on.title}</span>
            <Typewriter className="typed strip__detail" segments={on.detail} duration={900} />
          </dd>
        </div>
      </dl>

      <p className="strip__foot typed">
        <span>Dogs welcome</span>
        <span>Walk-ins welcome</span>
        <a href={VENUE.directions} target="_blank" rel="noreferrer">
          {VENUE.street}, {VENUE.postcode} <span aria-hidden="true">→</span>
          <span className="sr-only">(directions, opens Google Maps)</span>
        </a>
      </p>
    </aside>
  )
}

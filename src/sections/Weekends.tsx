import { useTonight } from '../lib/tonight'
import { useBooking } from '../lib/booking'
import { pal } from '../lib/surface'
import { PHOTOS } from '../lib/media'
import { Pic, Reveal, Wedge } from '../components/Media'
import { GoLink } from '../components/GoLink'
import { BRUNCH, ROAST } from '../data/menu'
import './Weekends.css'

export function Weekends() {
  const s = useTonight()
  const { open } = useBooking()

  return (
    <section
      id="weekends"
      className={`section edge-top weekends ${pal('weekends', s.mode)}`}
      aria-labelledby="weekends-title"
    >
      <div className="wrap">
        <header className="weekends__head">
          <p className="label muted">Weekends</p>
          <h2 id="weekends-title" className="h2">
            Weekends start
            <br />
            <em className="serif-em">at noon.</em>
          </h2>
        </header>

        {/* Boozy lunch: the number does the selling */}
        <div className="boozy">
          <Wedge className="boozy__photo" cut={18}>
            <Pic photo={PHOTOS.cheers} sizes="(min-width: 900px) 45vw, 100vw" />
          </Wedge>
          <div className="boozy__copy">
            <p className="label">Boozy lunch · Sat &amp; Sun · 12–3pm</p>
            <p className="boozy__seven" aria-hidden="true">
              7
            </p>
            <p className="boozy__line">
              drinks for <span className="price">£25</span>
            </p>
            <p className="boozy__small">
              Any meal from the main, brunch or roast menu. Add £25 for 7 drinks from a selected list, with{' '}
              <strong>no time limit on drinking them</strong>.
            </p>
            <p className="boozy__spritz typed">+ Seasonal spritzes, Sat &amp; Sun 12–4pm: 2 for £16</p>
            <button className="btn" onClick={() => open({ occasion: 'boozy' })}>
              Book boozy lunch
            </button>
          </div>
        </div>

        <div className="wk-pair">
          {/* Brunch: typed, like the order pad */}
          <Reveal className="brunch">
            <div className="brunch__top">
              <h3 className="h3">Saturday brunch</h3>
              <p className="label">12–4pm</p>
            </div>
            <ul className="brunch__list typed">
              {BRUNCH.items.map((d) => (
                <li key={d.name} className={d.name === 'Slutty eggs' ? 'is-star' : ''}>
                  <span>{d.name}</span>
                  <span className="brunch__lead" aria-hidden="true" />
                  <span className="price">{d.price}</span>
                </li>
              ))}
            </ul>
            <div className="wk-actions">
              <button className="btn" onClick={() => open({ occasion: 'brunch' })}>
                Book brunch
              </button>
              <GoLink to="/menu/brunch" className="link-arrow">
                What's in it <span aria-hidden="true">→</span>
              </GoLink>
            </div>
          </Reveal>

          {/* Roast: big plates, big type */}
          <Reveal className="roast" delay={0.1}>
            <div className="roast__top">
              <h3 className="h3">Sunday roast</h3>
              <p className="label">12–9pm</p>
            </div>
            <ul className="roast__list">
              {ROAST.items.map((d) => (
                <li key={d.name}>
                  <span className="roast__name">
                    {d.name}
                    {d.tags?.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </span>
                  <span className="price">{d.price}</span>
                  <span className="roast__desc muted">{d.desc}</span>
                </li>
              ))}
            </ul>
            <p className="roast__all">
              Every roast comes with Yorkshire pudding, parsnips, carrots, roast potatoes, broccoli and chef's red wine
              jus. Subject to availability, so book.
            </p>
            <div className="wk-actions">
              <button className="btn" onClick={() => open({ occasion: 'roast' })}>
                Book a roast
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

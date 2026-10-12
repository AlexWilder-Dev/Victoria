import { useTonight } from '../lib/tonight'
import { useBooking } from '../lib/booking'
import { pal } from '../lib/surface'
import { PHOTOS } from '../lib/media'
import { Pic, Reveal, Wedge } from '../components/Media'
import { Typewriter } from '../components/Typewriter'
import { GoLink } from '../components/GoLink'
import { SPARKLING } from '../data/menu'
import { DEALS } from '../data/venue'
import './Late.css'

const HAPPY = DEALS.find((d) => d.id === 'happy-friday')!

export function Late() {
  const s = useTonight()
  const { open } = useBooking()
  const fizz = [...SPARKLING.byGlass, ...SPARKLING.bottleOnly]
  const isLateNight = s.day === 'fri' || s.day === 'sat'

  return (
    <section id="late" className={`section edge-top late ${pal('late', s.mode)}`} aria-labelledby="late-title">
      <div className="wrap">
        <header className="late__head">
          <p className="late__their typed">Eat well. Drink better.</p>
          <h2 id="late-title" className="late__title display">
            Stay <em>late.</em>
          </h2>
          <p className="late__hours">
            <span className="label">Friday &amp; Saturday</span>
            <span className="late__till">
              till <span className="price">2am</span>
            </span>
            {isLateNight && s.bar.state === 'open' && <span className="late__now label">That's tonight</span>}
          </p>
        </header>

        <div className="late__grid">
          <div className="happy">
            <Wedge className="happy__photo" side="right" cut={20}>
              <Pic photo={PHOTOS.frozen} sizes="(min-width: 900px) 30vw, 80vw" />
            </Wedge>
            <div className="happy__copy">
              <h3 className="h3">Happy Friday</h3>
              <p className="label happy__time">Fridays · 8–11pm</p>
              <Typewriter
                className="happy__list typed"
                onView
                holdCaret={false}
                duration={1300}
                segments={[
                  ...HAPPY.lines!.filter((l) => l.price).map((l) => ({
                    text: l.label,
                    end: l.price,
                  })),
                  { text: 'Shot deals', className: 'tw-line' },
                ]}
              />
              <button className="btn" onClick={() => open({ day: 'fri', occasion: 'dinner' })}>
                Book Friday
              </button>
            </div>
          </div>

          <Reveal className="fizz">
            <h3 className="h3">Fizz</h3>
            <ul className="fizz__list">
              {fizz.map((w) => (
                <li key={w.name} className={w.sparkle ? 'fizz__dom' : ''}>
                  <span className="fizz__name">
                    {w.name}
                    {w.glass && <span className="fizz__glass typed"> Glass {w.glass}</span>}
                  </span>
                  <span className="price">{w.bottle}</span>
                </li>
              ))}
            </ul>
            <p className="fizz__note">
              Yes, the Dom Pérignon lights up. <span className="muted">The table tends to, too.</span>
            </p>
            <GoLink to="/menu/wine" className="link-arrow">
              Full wine list <span aria-hidden="true">→</span>
            </GoLink>
          </Reveal>
        </div>

        <Reveal className="dress">
          <p className="label">Dress code</p>
          <p className="dress__line">
            Dress with a <em>sense of occasion.</em>
          </p>
        </Reveal>
      </div>
    </section>
  )
}

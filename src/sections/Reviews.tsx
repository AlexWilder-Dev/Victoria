import { useTonight } from '../lib/tonight'
import { useBooking } from '../lib/booking'
import { pal } from '../lib/surface'
import { Reveal } from '../components/Media'
import { useGoTo } from '../components/GoLink'
import { REVIEWS, VENUE } from '../data/venue'
import './Reviews.css'

export function Reviews() {
  const s = useTonight()
  const { open } = useBooking()
  const go = useGoTo()
  const action = {
    brunch: { label: 'Book brunch', run: () => open({ occasion: 'brunch' }) },
    roast: { label: 'Book a roast', run: () => open({ occasion: 'roast' }) },
    birthday: { label: 'Plan a birthday', run: () => go('#parties') },
  }

  return (
    <section
      id="reviews"
      className={`section edge-top reviews ${pal('reviews', s.mode)}`}
      aria-labelledby="reviews-title"
    >
      <div className="wrap">
        <div className="score">
          <h2 id="reviews-title" className="sr-only">
            Reviews
          </h2>
          <p className="score__num display">{VENUE.rating}</p>
          <div className="score__meta">
            <p className="score__stars" aria-label="out of 5 stars">
              {[0, 1, 2, 3, 4].map((i) => (
                <svg key={i} viewBox="0 0 20 20" aria-hidden="true" className={i === 4 ? 'is-part' : ''}>
                  <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7z" />
                </svg>
              ))}
            </p>
            <p className="typed">from {VENUE.reviewCount} Google reviews</p>
          </div>
        </div>

        <ul className="quotes">
          {REVIEWS.map((r, i) => (
            <Reveal as="li" key={r.quote} className={`quote quote--${i}`} delay={i * 0.1}>
              <blockquote>
                <p>“{r.quote}”</p>
              </blockquote>
              <p className="quote__src label">Google review</p>
              <button className="link-arrow" onClick={action[r.about].run}>
                {action[r.about].label} <span aria-hidden="true">→</span>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

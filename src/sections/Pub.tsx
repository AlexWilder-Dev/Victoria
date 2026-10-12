import { useTonight } from '../lib/tonight'
import { pal } from '../lib/surface'
import { CLIPS } from '../lib/media'
import { LoopVideo, Reveal, Wedge } from '../components/Media'
import { Typewriter } from '../components/Typewriter'
import { SPORT } from '../data/venue'
import './Pub.css'

export function Pub() {
  const s = useTonight()
  return (
    <section id="pub" className={`section edge-top pub ${pal('pub', s.mode)}`} aria-labelledby="pub-title">
      <div className="wrap">
        <header className="pub__head">
          <p className="label muted">The pub</p>
          <h2 id="pub-title" className="h2">
            Bigger than it
            <br />
            <em className="serif-em">looks from the corner.</em>
          </h2>
        </header>

        {/* The typewriters: told in type */}
        <div className="keys">
          <p className="label keys__label">Inside</p>
          <Typewriter
            className="keys__typed typed"
            onView
            duration={2600}
            segments="An opened-up bar, and vintage typewriters lining the walls."
          />
          <p className="keys__aside">Nobody's typing on them. Probably.</p>
        </div>

        {/* Games room */}
        <div className="games">
          <Wedge className="games__clip" cut={26}>
            <LoopVideo clip={CLIPS.games} />
          </Wedge>
          <div className="games__copy">
            <p className="label muted">Out the back</p>
            <ul className="games__list">
              <Reveal as="li">Pool.</Reveal>
              <Reveal as="li" delay={0.08}>
                Ping pong.
              </Reveal>
              <Reveal as="li" delay={0.16}>
                Foosball.
              </Reveal>
            </ul>
            <p className="games__free typed">
              Free. No booking. <strong>No coins needed.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Outside: full bleed */}
      <div className="outside">
        <div className="outside__clip">
          <LoopVideo clip={CLIPS.outside} position="50% 60%" />
        </div>
        <div className="wrap outside__wrap">
          <Reveal className="outside__card pal-night">
            <h3 className="h3">Outside</h3>
            <p>
              Dining under umbrellas, awnings and heaters. Not every table's covered or heated, so bring a layer or come
              early for the good ones.
            </p>
            <p className="typed outside__fine">Outdoor screens for big events, weather allowing.</p>
          </Reveal>
        </div>
      </div>

      <div className="wrap pub__pair">
        {/* Dogs: small and close up, like the dog */}
        <div className="dogs">
          <div className="dogs__clip">
            <LoopVideo clip={CLIPS.dogs} />
          </div>
          <div className="dogs__copy">
            <h3 className="dogs__title">
              Dogs <em>welcome.</em>
            </h3>
            <p>Water bowls and treats from the team. Owners get the menu.</p>
          </div>
        </div>

        {/* Screens */}
        <div className="sport">
          <h3 className="sport__title">
            Not a sports bar.
            <br />
            <em>However…</em>
          </h3>
          <p className="sport__body">All the major terrestrial tournaments, on the big screens.</p>
          <div className="sport__clip">
            <Wedge cut={24} side="right">
              <LoopVideo clip={CLIPS.screens} />
            </Wedge>
          </div>
        </div>
      </div>

      <div className="ticker pal-night" aria-label={`Showing: ${SPORT.join(', ')}`}>
        <div className="ticker__track typed" aria-hidden="true">
          {[0, 1].map((k) => (
            <span key={k}>
              {SPORT.map((t) => (
                <span key={t} className="ticker__item">
                  {t}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

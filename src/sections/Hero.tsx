import { type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTonight } from '../lib/tonight'
import { useBooking } from '../lib/booking'
import { heroCopy } from '../lib/copy'
import { pal } from '../lib/surface'
import { PHOTOS } from '../lib/media'
import { Pic } from '../components/Media'
import { GoLink } from '../components/GoLink'
import { TonightStrip } from '../components/TonightStrip'
import './Hero.css'

/** Daylight on the fascia; the sign under festoon lights once it's dark. Crossfades as the day turns. */
function Scene({ mode }: { mode: string }) {
  const night = mode !== 'day'
  return (
    <div className="facade" data-mode={mode}>
      <AnimatePresence initial={false}>
        <motion.div
          key={night ? 'night' : 'day'}
          className="facade__layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          <Pic
            photo={night ? PHOTOS.heroNight : PHOTOS.heroDay}
            eager
            className="facade__img"
            sizes="(min-width: 900px) 53vw, 100vw"
          />
        </motion.div>
      </AnimatePresence>
      <div className="facade__shade" aria-hidden="true" />
    </div>
  )
}

const TILES = {
  cheers: { photo: PHOTOS.cheers, shape: 'wide' },
  burger: { photo: PHOTOS.burger, shape: 'tall' },
  steak: { photo: PHOTOS.steak, shape: 'tall' },
  frozen: { photo: PHOTOS.frozen, shape: 'tall' },
  home: { photo: PHOTOS.home, shape: 'tall' },
} as const

export function Hero() {
  const s = useTonight()
  const { open } = useBooking()
  const copy = heroCopy(s)
  const tile = TILES[copy.tile]
  const key = `${s.day}-${s.mode}-${s.bar.state}`
  // Size the headline so its longest (indented) line fits the column.
  const widest = Math.max(...copy.lines.map((l, i) => l.length * 0.5 + i * 0.55))
  const fit = {
    '--fit-m': `${86 / widest}vw`,
    '--fit-d': `${47 / widest}vw`,
  } as CSSProperties

  return (
    <section className={`hero ${pal('hero', s.mode)}`} aria-labelledby="hero-title">
      <div className="hero__stage">
        <Scene mode={s.mode} />

        <AnimatePresence mode="wait">
          <motion.figure
            key={copy.tile}
            className={`hero__tile hero__tile--${tile.shape}`}
            initial={{
              opacity: 0,
              clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 78% 100%)',
            }}
            animate={{
              opacity: 1,
              clipPath: 'polygon(22% 0%, 100% 0%, 100% 100%, 0% 100%)',
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1], delay: 0.5 }}
          >
            <Pic photo={tile.photo} sizes="(min-width: 900px) 340px, 46vw" />
            <figcaption className="label">{copy.tileCaption}</figcaption>
          </motion.figure>
        </AnimatePresence>

        <div className="hero__copy">
          <p className="hero__kicker label">
            166 Queenstown Road <span className="hide-sm">· Battersea </span>· Since 1869
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 id="hero-title" className="hero__title display" style={fit}>
                <span className="sr-only">The Victoria, Battersea. </span>
                {copy.lines.map((line, i) => (
                  <motion.span
                    key={line}
                    className="hero__line"
                    style={{ '--i': i } as CSSProperties}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.2, 0.8, 0.2, 1],
                      delay: 0.15 + i * 0.12,
                    }}
                  >
                    {i === copy.em ? <em>{line}</em> : line}
                  </motion.span>
                ))}
              </h1>
              <motion.p
                className="hero__sub lede"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                {copy.sub}
              </motion.p>
            </motion.div>
          </AnimatePresence>
          <div className="hero__actions">
            <button className="btn" onClick={() => open({ occasion: copy.book.occasion })}>
              {copy.book.label}
            </button>
            <GoLink to={copy.more.to} className="link-arrow">
              {copy.more.label} <span aria-hidden="true">→</span>
            </GoLink>
          </div>
        </div>
      </div>

      <TonightStrip />
    </section>
  )
}

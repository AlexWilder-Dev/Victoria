import { useEffect, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useTonight } from '../lib/tonight'
import { useBooking } from '../lib/booking'
import { heroCopy } from '../lib/copy'
import { pal } from '../lib/surface'
import { CLIPS, PHOTOS } from '../lib/media'
import { LoopVideo, Pic } from '../components/Media'
import { GoLink } from '../components/GoLink'
import { TonightStrip } from '../components/TonightStrip'
import './Hero.css'

/**
 * Parts of the photo that light up after dark, as soft ellipses (centre x y, radius x y, % of the image):
 * the gold VICTORIA over the door, the 166 plaque, the lantern, the hanging Penny Black sign and the windows.
 */
const LIGHTS = [
  { at: '49.7% 61.7%', r: '14.5% 3.8%', kind: 'gold' },
  { at: '51.1% 67.4%', r: '7% 3%', kind: 'gold' },
  { at: '82.6% 67%', r: '3.8% 4.8%', kind: 'lamp' },
  { at: '17.7% 49%', r: '7.5% 10%', kind: 'sign' },
  { at: '75% 70%', r: '8% 9.5%', kind: 'window' },
  { at: '43.2% 72%', r: '3.6% 8%', kind: 'window' },
  { at: '97% 69%', r: '5% 7%', kind: 'window' },
]

/** The building itself. After 5pm the sky goes and the pub lights up. */
function Facade({ mode }: { mode: string }) {
  const reduce = useReducedMotion()
  // Lights come on a beat after load, like walking up at dusk.
  const [lit, setLit] = useState(reduce ? mode : 'day')
  useEffect(() => {
    if (reduce) return setLit(mode)
    const t = window.setTimeout(() => setLit(mode), 450)
    return () => window.clearTimeout(t)
  }, [mode, reduce])

  return (
    <div className="facade" data-lit={lit}>
      <div className="facade__inner">
        <Pic photo={PHOTOS.vic} eager className="facade__img" sizes="(min-width: 900px) 50vw, 100vw" />
        <div className="facade__dusk" aria-hidden="true" />
        {LIGHTS.map((l, i) => (
          <img
            key={i}
            src={PHOTOS.vic.src}
            alt=""
            aria-hidden="true"
            className={`facade__light facade__light--${l.kind}`}
            style={{
              maskImage: `radial-gradient(ellipse ${l.r} at ${l.at}, #000 45%, transparent 100%)`,
              WebkitMaskImage: `radial-gradient(ellipse ${l.r} at ${l.at}, #000 45%, transparent 100%)`,
              transitionDelay: `${0.4 + i * 0.12}s`,
            }}
          />
        ))}
        <div className="facade__glow" aria-hidden="true" />
      </div>
    </div>
  )
}

const TILES = {
  outside: { clip: CLIPS.outside, shape: 'wide' },
  screens: { clip: CLIPS.screens, shape: 'tall' },
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
        <Facade mode={s.mode} />

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
            {'clip' in tile ? <LoopVideo clip={tile.clip} /> : <Pic photo={tile.photo} sizes="260px" />}
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

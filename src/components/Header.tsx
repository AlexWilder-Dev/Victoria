import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { Wordmark } from './Wordmark'
import { GoLink } from './GoLink'
import { useTonight } from '../lib/tonight'
import { useBooking } from '../lib/booking'
import { barLine, kitchenLine } from '../lib/copy'
import { pal } from '../lib/surface'
import { VENUE } from '../data/venue'
import './Header.css'

const NAV = [
  { to: '/#week', label: 'The week' },
  { to: '/#food', label: 'Food' },
  { to: '/#weekends', label: 'Weekends' },
  { to: '/#late', label: 'Late' },
  { to: '/#pub', label: 'The pub' },
  { to: '/#parties', label: 'Parties' },
  { to: '/#find', label: 'Find us' },
]

export function Header() {
  const s = useTonight()
  const { open } = useBooking()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [indexOpen, setIndexOpen] = useState(false)
  const bar = barLine(s)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => setIndexOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = indexOpen ? 'hidden' : ''
  }, [indexOpen])

  return (
    <>
      <header
        className={`header ${indexOpen ? 'pal-night is-solid' : pal(pathname === '/' ? 'hero' : 'menu', s.mode)} ${scrolled ? 'is-solid' : ''}`}
      >
        <div className="header__inner">
          <GoLink to="/" className="header__brand" aria-label="The Victoria, home">
            <Wordmark />
          </GoLink>

          <nav className="header__nav" aria-label="Sections">
            {NAV.map((n) => (
              <GoLink key={n.to} to={n.to}>
                {n.label}
              </GoLink>
            ))}
            <GoLink to="/menu/food" className={pathname.startsWith('/menu') ? 'is-current' : ''}>
              Menu
            </GoLink>
          </nav>

          <GoLink
            to="/#find"
            className={`status-pill tone-${bar.tone}`}
            aria-label={`Bar: ${bar.text}. Hours and directions`}
          >
            <span className="status-pill__dot" aria-hidden="true" />
            <span className="status-pill__text">{bar.text}</span>
          </GoLink>

          <button className="btn btn--sm header__book" onClick={() => open()}>
            Book a table
          </button>

          <button
            className="header__index"
            aria-expanded={indexOpen}
            aria-controls="site-index"
            onClick={() => setIndexOpen((v) => !v)}
          >
            {indexOpen ? 'Close' : 'Index'}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {indexOpen && (
          <motion.div
            id="site-index"
            className="index pal-night"
            initial={{
              clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
            }}
            animate={{
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            }}
            exit={{
              clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
            }}
            transition={{ duration: 0.55, ease: [0.7, 0, 0.2, 1] }}
          >
            <nav aria-label="Site index">
              <ol className="index__list">
                {[...NAV, { to: '/menu/food', label: 'The menu' }].map((n, i) => (
                  <li key={n.to}>
                    <GoLink to={n.to} onClick={() => setIndexOpen(false)}>
                      <span className="label">{String(i + 1).padStart(2, '0')}</span>
                      {n.label}
                    </GoLink>
                  </li>
                ))}
              </ol>
            </nav>
            <dl className="index__now typed">
              <div>
                <dt className="label">Bar</dt>
                <dd>{bar.text}</dd>
              </div>
              <div>
                <dt className="label">Kitchen</dt>
                <dd>{kitchenLine(s).text}</dd>
              </div>
              <div>
                <dt className="label">Find us</dt>
                <dd>
                  {VENUE.street}, {VENUE.postcode}
                </dd>
              </div>
            </dl>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

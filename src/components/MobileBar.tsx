import { useLocation } from 'react-router-dom'
import { useBooking } from '../lib/booking'
import { GoLink } from './GoLink'
import { VENUE } from '../data/venue'
import './MobileBar.css'

/** Always-there bottom bar on phones: Book · Menu · WhatsApp. */
export function MobileBar() {
  const { open, isOpen } = useBooking()
  const { pathname } = useLocation()
  return (
    <nav className={`mobile-bar pal-night ${isOpen ? 'is-hidden' : ''}`} aria-label="Quick actions">
      <button className="mobile-bar__book" onClick={() => open()}>
        Book
      </button>
      <GoLink to={pathname.startsWith('/menu') ? '/' : '/menu/food'} className="mobile-bar__item">
        {pathname.startsWith('/menu') ? 'Home' : 'Menu'}
      </GoLink>
      <a className="mobile-bar__item" href={VENUE.whatsapp} target="_blank" rel="noreferrer">
        WhatsApp
      </a>
    </nav>
  )
}

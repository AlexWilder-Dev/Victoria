import { Wordmark } from './Wordmark'
import { GoLink } from './GoLink'
import { useTonight } from '../lib/tonight'
import { VENUE } from '../data/venue'
import './Footer.css'

export function Footer() {
  const s = useTonight()
  return (
    <footer className={`footer ${s.mode === 'late' ? 'pal-ink' : 'pal-night'}`}>
      <div className="wrap footer__inner">
        <Wordmark className="footer__mark" />
        <p className="footer__line">
          Eat well. Drink better. <em>Stay late.</em>
        </p>
        <nav className="footer__nav typed" aria-label="Footer">
          <GoLink to="/menu/food">Menu</GoLink>
          <GoLink to="/#week">The week</GoLink>
          <GoLink to="/#parties">Parties</GoLink>
          <GoLink to="/#find">Find us</GoLink>
          <a href={`mailto:${VENUE.email}?subject=Work%20with%20us`}>Work with us</a>
        </nav>
        <div className="footer__base typed">
          <span>
            The Victoria · {VENUE.street}, Battersea, London {VENUE.postcode}
          </span>
          <span>Site by AlexWilder-Dev</span>
        </div>
      </div>
    </footer>
  )
}

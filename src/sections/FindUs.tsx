import { useTonight } from '../lib/tonight'
import { useBooking } from '../lib/booking'
import { pal } from '../lib/surface'
import { barLine, kitchenLine } from '../lib/copy'
import { fmtRange } from '../lib/time'
import { BAR_HOURS, DAY_NAMES, DRESS_CODE, KITCHEN_HOURS, VENUE, WEEK } from '../data/venue'
import './FindUs.css'

export function FindUs() {
  const s = useTonight()
  const { open } = useBooking()
  const bar = barLine(s)
  const kitchen = kitchenLine(s)

  const kitchenBig = s.kitchen.state === 'open' ? 'Cooking.' : s.kitchen.state === 'before' ? 'Not yet.' : 'Done.'
  const answers = [
    {
      q: 'Open now?',
      big: s.bar.state === 'open' ? 'Yes.' : 'Not now.',
      small: `${bar.text}.`,
      live: bar.tone,
    },
    {
      q: 'Kitchen?',
      big: kitchenBig,
      small: `${kitchen.text}.`,
      live: kitchen.tone,
    },
    {
      q: 'The dog?',
      big: 'Bring them.',
      small: 'Water bowls and treats from the team.',
    },
    {
      q: 'Booking?',
      big: 'Walk in.',
      small: "Walk-ins welcome, subject to availability. At weekends, we'd book.",
    },
    { q: 'Dress code?', big: 'Make an effort.', small: DRESS_CODE.join(' ') },
    {
      q: 'The football?',
      big: 'However…',
      small: 'Not a sports bar, however: all the major terrestrial tournaments, from the Six Nations to Royal Ascot.',
    },
  ]

  return (
    <section id="find" className={`section edge-top find ${pal('find', s.mode)}`} aria-labelledby="find-title">
      <div className="wrap">
        <div className="find__top">
          <div className="find__where">
            <p className="label muted">Find us</p>
            <h2 id="find-title" className="find__addr">
              166 Queenstown Road
              <br />
              <em>Battersea, SW8 3QH</em>
            </h2>
            <p className="typed find__station">Nearest station: {VENUE.station}</p>
            <div className="find__actions">
              <a className="btn" href={VENUE.directions} target="_blank" rel="noreferrer">
                Get directions
              </a>
              <button className="btn btn--ghost" onClick={() => open()}>
                Book a table
              </button>
            </div>
          </div>

          <div className="hours">
            <table className="hours__table typed">
              <caption className="label muted">Opening hours</caption>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr-only">Day</span>
                  </th>
                  <th scope="col">Bar</th>
                  <th scope="col">Kitchen</th>
                </tr>
              </thead>
              <tbody>
                {WEEK.map((d) => (
                  <tr key={d} className={d === s.day ? 'is-today' : ''}>
                    <th scope="row">
                      {DAY_NAMES[d]}
                      {d === s.day && <span className="hours__today"> {s.minutes >= 1440 ? 'tonight' : 'today'}</span>}
                    </th>
                    <td>
                      {fmtRange(BAR_HOURS[d].open, BAR_HOURS[d].close, {
                        noon: true,
                      })}
                    </td>
                    <td>
                      {fmtRange(KITCHEN_HOURS[d].open, KITCHEN_HOURS[d].close, {
                        noon: true,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <dl className="qa">
          {answers.map((x) => (
            <div key={x.q} className="qa__row">
              <dt className="qa__q typed">{x.q}</dt>
              <dd className="qa__big">
                {x.live && <span className={`qa__dot tone-${x.live}`} aria-hidden="true" />}
                {x.big}
              </dd>
              <dd className="qa__small">{x.small}</dd>
            </div>
          ))}
        </dl>

        <div className="contact">
          <div>
            <p className="label muted">Call or WhatsApp</p>
            <p className="contact__big">
              <a href={`tel:${VENUE.phoneIntl}`}>{VENUE.phone}</a>
            </p>
            <a className="link-arrow" href={VENUE.whatsapp} target="_blank" rel="noreferrer">
              WhatsApp us <span aria-hidden="true">→</span>
            </a>
          </div>
          <div>
            <p className="label muted">Email</p>
            <p className="contact__big">
              <a href={`mailto:${VENUE.email}`}>{VENUE.email}</a>
            </p>
          </div>
          <div>
            <p className="label muted">Follow</p>
            <ul className="contact__social typed">
              <li>
                <a href={VENUE.instagram} target="_blank" rel="noreferrer">
                  Instagram {VENUE.instagramHandle}
                </a>
              </li>
              <li>
                <a href={VENUE.tiktok} target="_blank" rel="noreferrer">
                  TikTok {VENUE.tiktokHandle}
                </a>
              </li>
              <li>
                <a href={VENUE.facebook} target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
          <div className="contact__jobs">
            <p className="label muted">Work with us</p>
            <p>
              Send your CV to <a href={`mailto:${VENUE.email}?subject=Work%20with%20us`}>{VENUE.email}</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

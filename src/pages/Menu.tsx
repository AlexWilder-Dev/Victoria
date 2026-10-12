import { useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTonight } from '../lib/tonight'
import { useBooking } from '../lib/booking'
import { pal } from '../lib/surface'
import { kitchenLine } from '../lib/copy'
import { GoLink, useGoTo } from '../components/GoLink'
import {
  BAR_SNACKS,
  BRUNCH,
  DESSERTS,
  MAINS,
  ROAST,
  SIDES,
  VEGAN,
  VEGAN_ELSEWHERE,
  WINES,
  type Dish,
  type MenuSection,
  type Tag,
  type Wine,
} from '../data/menu'
import './Menu.css'

const TABS = [
  { id: 'food', label: 'Food', sections: [BAR_SNACKS, MAINS, SIDES, DESSERTS] },
  {
    id: 'brunch',
    label: 'Saturday brunch',
    short: 'Brunch',
    sections: [BRUNCH],
  },
  { id: 'roast', label: 'Sunday roast', short: 'Roast', sections: [ROAST] },
  { id: 'vegan', label: 'Vegan', sections: [VEGAN, VEGAN_ELSEWHERE] },
  { id: 'wine', label: 'Wine', sections: [] as MenuSection[] },
] as const

type TabId = (typeof TABS)[number]['id']

const FILTERS: { id: Tag; label: string }[] = [
  { id: 'V', label: 'Vegetarian' },
  { id: 'VG', label: 'Vegan' },
  { id: 'GF', label: 'Gluten-free' },
]

/** Vegan dishes count as vegetarian too. */
const matches = (d: Dish, on: Tag[]) => on.every((t) => d.tags?.includes(t) || (t === 'V' && d.tags?.includes('VG')))

function DishRow({ d }: { d: Dish }) {
  return (
    <li className="dish">
      <span className="dish__name">
        {d.name}
        {d.tags?.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </span>
      {d.price && <span className="price dish__price">{d.price}</span>}
      {d.desc && <span className="dish__desc">{d.desc}</span>}
    </li>
  )
}

function WineRow({ w, glassOnly }: { w: Wine; glassOnly?: boolean }) {
  return (
    <li className={`wine ${w.sparkle ? 'wine--lit' : ''}`}>
      <span className="wine__name">
        {w.name}
        {w.origin && <span className="wine__origin">{w.origin}</span>}
      </span>
      {glassOnly ? (
        <span className="wine__prices typed">
          {w.glass && (
            <span>
              <small>{w.glassLabel ?? '175ml'}</small>
              {w.glass}
            </span>
          )}
          {w.large && (
            <span>
              <small>250ml</small>
              {w.large}
            </span>
          )}
          <span>
            <small>Bottle</small>
            <b>{w.bottle}</b>
          </span>
        </span>
      ) : (
        <span className="price wine__bottle">{w.bottle}</span>
      )}
    </li>
  )
}

export default function Menu() {
  const { tab } = useParams()
  const s = useTonight()
  const { open } = useBooking()
  const go = useGoTo()
  const [filters, setFilters] = useState<Tag[]>([])
  const k = kitchenLine(s)

  // No tab chosen: open on whatever the kitchen is doing today.
  const fallback: TabId =
    s.day === 'sat' && s.minutes < 16 * 60 ? 'brunch' : s.day === 'sun' && s.minutes < 21 * 60 ? 'roast' : 'food'
  const current = TABS.find((t) => t.id === tab)

  useEffect(() => {
    document.title = `${current?.label ?? 'Menu'} · The Victoria, Battersea`
    return () => {
      document.title = 'The Victoria, Battersea · Eat well. Drink better. Stay late.'
    }
  }, [current])

  const sections = useMemo(
    () =>
      (current?.sections ?? [])
        .map((sec) => ({
          ...sec,
          items: sec.items.filter((d) => matches(d, filters)),
        }))
        .filter((sec) => sec.items.length),
    [current, filters],
  )

  if (!current) return <Navigate to={`/menu/${fallback}`} replace />

  const toggle = (t: Tag) => setFilters((f) => (f.includes(t) ? f.filter((x) => x !== t) : [...f, t]))
  const isWine = current.id === 'wine'

  return (
    <div className={`menu ${pal('menu', s.mode)}`}>
      <header className="menu__head wrap">
        <p className="label muted">
          The menu · <span className={`tone-${k.tone}`}>Kitchen {k.text.toLowerCase()}</span>
        </p>
        <h1 className="menu__title display">
          Eat well. <em>Drink better.</em>
        </h1>
      </header>

      <div className="menu__bar">
        <div className="wrap">
          <nav className="tabs" aria-label="Menus">
            {TABS.map((t) => (
              <GoLink key={t.id} to={`/menu/${t.id}`} className={`tab ${t.id === current.id ? 'is-on' : ''}`}>
                {'short' in t ? (
                  <>
                    <span className="tab__long">{t.label}</span>
                    <span className="tab__short" aria-hidden="true">
                      {t.short}
                    </span>
                  </>
                ) : (
                  t.label
                )}
                {t.id === current.id && (
                  <motion.span layoutId="tab-mark" className="tab__mark" aria-hidden="true">
                    <span />
                  </motion.span>
                )}
              </GoLink>
            ))}
          </nav>
          {!isWine && (
            <div className="chips" role="group" aria-label="Filter dishes">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  className={`chip ${filters.includes(f.id) ? 'is-on' : ''}`}
                  aria-pressed={filters.includes(f.id)}
                  onClick={() => toggle(f.id)}
                >
                  <b>{f.id}</b>
                  <span>{f.label}</span>
                </button>
              ))}
              {filters.length > 0 && (
                <button className="chip chip--clear" onClick={() => setFilters([])}>
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="wrap menu__body"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {current.id === 'food' && (
            <nav className="jump typed" aria-label="Jump to">
              {[BAR_SNACKS, MAINS, SIDES, DESSERTS].map((sec) => (
                <button key={sec.id} onClick={() => go(`#${sec.id}`)}>
                  {sec.title}
                </button>
              ))}
            </nav>
          )}

          {isWine ? (
            <div className="wines">
              <p className="wines__key typed muted">By the glass: 175ml · 250ml · bottle</p>
              {WINES.map((list) => (
                <section key={list.id} id={list.id} className="msec">
                  <h2 className="msec__title">{list.title}</h2>
                  <ul className="wine-list">
                    {list.byGlass.map((w) => (
                      <WineRow key={w.name} w={w} glassOnly />
                    ))}
                  </ul>
                  {list.bottleOnly.length > 0 && (
                    <>
                      <p className="label msec__sub">Bottle only</p>
                      <ul className="wine-list wine-list--bottles">
                        {list.bottleOnly.map((w) => (
                          <WineRow key={w.name} w={w} />
                        ))}
                      </ul>
                    </>
                  )}
                </section>
              ))}
            </div>
          ) : sections.length ? (
            sections.map((sec) => (
              <section key={sec.id} id={sec.id} className={`msec msec--${sec.id}`}>
                <div className="msec__head">
                  <h2 className="msec__title">{sec.title}</h2>
                  {sec.price && <p className="price msec__price">{sec.price}</p>}
                </div>
                {sec.note && <p className="msec__note">{sec.note}</p>}
                <ul className="dishes">
                  {sec.items.map((d) => (
                    <DishRow key={d.name} d={d} />
                  ))}
                </ul>
              </section>
            ))
          ) : (
            <p className="menu__empty">
              Nothing on this menu is marked {filters.join(' and ')}.{' '}
              <button className="inline-link" onClick={() => setFilters([])}>
                Clear the filter
              </button>{' '}
              or try another tab.
            </p>
          )}

          <div className="menu__cta">
            <p className="menu__cta-line">
              Hungry yet? <em>Get a table.</em>
            </p>
            <button
              className="btn"
              onClick={() =>
                open({
                  occasion: current.id === 'brunch' ? 'brunch' : current.id === 'roast' ? 'roast' : undefined,
                })
              }
            >
              {current.id === 'brunch' ? 'Book brunch' : current.id === 'roast' ? 'Book a roast' : 'Book a table'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

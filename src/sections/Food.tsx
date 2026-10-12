import { motion, useReducedMotion } from 'framer-motion'
import { useTonight } from '../lib/tonight'
import { pal } from '../lib/surface'
import { kitchenLine } from '../lib/copy'
import { PHOTOS } from '../lib/media'
import { Pic, Reveal } from '../components/Media'
import { GoLink } from '../components/GoLink'
import type { Tag } from '../data/menu'
import './Food.css'

const PICKS: { name: string; desc: string; price: string; tags?: Tag[] }[] = [
  {
    name: 'The Vic Wagyu beef burger',
    desc: 'Mild cheddar, smoky bacon, caramelised and red onion',
    price: '£20.50',
  },
  {
    name: 'Black Angus ribeye 330g',
    desc: 'Hand-cut chips, sautéed field mushroom, roast tomato',
    price: '£26.95',
  },
  {
    name: "Mac 'n' cheese with black summer truffle",
    desc: 'Three-cheese sauce, smoked streaky bacon, white truffle oil',
    price: '£14.50',
  },
  {
    name: 'Smoked chilli calamari',
    desc: 'Spanish chilli, sweet chilli-soy dressing',
    price: '£8.50',
  },
  {
    name: 'Truffle & Parmesan tater tots',
    desc: 'White truffle, Grana Padano, creamy truffle mayo',
    price: '£7.95',
    tags: ['V'],
  },
  {
    name: 'Vegan cheeseburger',
    desc: 'Moving Mountains patty, spicy vegan mayo',
    price: '£16.95',
    tags: ['VG'],
  },
  {
    name: 'Sticky toffee pudding',
    desc: 'For afters',
    price: '£7.50',
    tags: ['GF'],
  },
]

export function Food() {
  const s = useTonight()
  const reduce = useReducedMotion()
  const k = kitchenLine(s)

  return (
    <section id="food" className={`section edge-top food ${pal('food', s.mode)}`} aria-labelledby="food-title">
      <div className="wrap food__grid">
        <motion.div
          className="split"
          initial={reduce ? false : ({ '--split': '100%' } as never)}
          whileInView={{ '--split': '58%' } as never}
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          transition={{ duration: 1.3, ease: [0.7, 0, 0.2, 1] }}
        >
          <div className="split__a">
            <Pic photo={PHOTOS.steak} sizes="(min-width: 900px) 40vw, 90vw" position="40% 60%" />
          </div>
          <div className="split__b">
            <Pic photo={PHOTOS.burger} sizes="(min-width: 900px) 30vw, 70vw" position="60% 55%" />
          </div>
          <p className="split__cap label">Steak Night Thursdays · Burger Night Mondays</p>
        </motion.div>

        <div className="food__copy">
          <p className="label muted">
            Food · <span className={`tone-${k.tone}`}>Kitchen {k.text.toLowerCase()}</span>
          </p>
          <h2 id="food-title" className="h2">
            Gastro first.
            <br />
            <em className="serif-em">Pub always.</em>
          </h2>
          <p className="lede">
            High-quality organic food and drink, on menus our chefs build from trusted farms and suppliers. A few of the
            regulars:
          </p>

          <ol className="picks">
            {PICKS.map((p, i) => (
              <Reveal as="li" key={p.name} className="pick" delay={i * 0.05} y={14}>
                <span className="pick__name">
                  {p.name}
                  {p.tags?.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </span>
                <span className="pick__lead" aria-hidden="true" />
                <span className="price">{p.price}</span>
                <span className="pick__desc muted">{p.desc}</span>
              </Reveal>
            ))}
          </ol>

          <div className="food__actions">
            <GoLink to="/menu/food" className="btn">
              The full menu
            </GoLink>
            <GoLink to="/menu/vegan" className="link-arrow">
              Vegan menu <span aria-hidden="true">→</span>
            </GoLink>
          </div>
        </div>
      </div>
    </section>
  )
}

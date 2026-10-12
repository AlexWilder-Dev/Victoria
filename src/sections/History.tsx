import { motion, useReducedMotion } from 'framer-motion'
import { useTonight } from '../lib/tonight'
import { pal } from '../lib/surface'
import './History.css'

type Part = { t: string; struck?: boolean; added?: boolean }

/** The building's story as the register would show it: retyped, with the corrections left in. */
const REGISTER: { year: string; line: Part[]; note: string }[] = [
  {
    year: '1869',
    line: [{ t: 'The Victoria Hotel' }],
    note: 'Opens in a wedge-shaped building on the corner.',
  },
  {
    year: '1881',
    line: [{ t: '1 Victoria Terrace, Queens Road' }],
    note: 'How the listing has it.',
  },
  {
    year: '1944',
    line: [
      { t: 'Queens Road', struck: true },
      { t: 'Queenstown Road', added: true },
    ],
    note: 'The road gets its new name.',
  },
  {
    year: 'Then',
    line: [
      { t: 'Victoria', struck: true },
      { t: 'Browns', added: true },
    ],
    note: 'A spell as Browns.',
  },
  {
    year: 'Now',
    line: [
      { t: 'Browns', struck: true },
      { t: 'The Victoria', added: true },
    ],
    note: 'Back again. Still the only pub at the industrial end of Queenstown Road.',
  },
]

function Entry({ line, i }: { line: Part[]; i: number }) {
  const reduce = useReducedMotion()
  const base = 0.25 + i * 0.12
  return (
    <span className="reg__line">
      {line.map((p, k) =>
        p.struck ? (
          <span key={k} className="reg__struck">
            {p.t}
            <motion.span
              className="reg__strike"
              aria-hidden="true"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '0px 0px -20% 0px' }}
              transition={{ duration: 0.5, delay: base + 0.3, ease: 'easeIn' }}
            />
            <span className="sr-only"> (crossed out)</span>
          </span>
        ) : p.added ? (
          <motion.span
            key={k}
            className="reg__added"
            initial={reduce ? false : { opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -20% 0px' }}
            transition={{ duration: 0.4, delay: base + 0.9 }}
          >
            {p.t}
          </motion.span>
        ) : (
          <span key={k}>{p.t}</span>
        ),
      )}
    </span>
  )
}

export function History() {
  const s = useTonight()
  return (
    <section
      id="history"
      className={`section edge-top history ${pal('history', s.mode)}`}
      aria-labelledby="history-title"
    >
      <div className="wrap">
        <div className="history__head">
          <p className="label muted">Since 1869</p>
          <h2 id="history-title" className="history__year display" aria-label="Since 1869">
            <span>18</span>
            <span>69</span>
          </h2>
          <p className="lede">
            Built as the Victoria Hotel, in a wedge-shaped building on the corner. Still the only pub at the industrial
            end of Queenstown Road.
          </p>
        </div>

        <ol className="reg typed">
          {REGISTER.map((r, i) => (
            <li key={r.year} className="reg__row">
              <span className="reg__year">{r.year}</span>
              <Entry line={r.line} i={i} />
              <span className="reg__note">{r.note}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

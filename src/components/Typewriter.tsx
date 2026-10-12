import { useEffect, useRef, useState, type ElementType } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

export interface Segment {
  text: string
  className?: string
  /** Right-aligned text on the same row, e.g. a price. Makes the segment a row. */
  end?: string
}

interface Props {
  segments: Segment[] | string
  /** Upper bound on how long the whole thing takes to type, in ms. */
  duration?: number
  /** Start when scrolled into view rather than on mount. */
  onView?: boolean
  as?: ElementType
  className?: string
  caret?: boolean
  /** Keep the caret blinking once the typing's done. */
  holdCaret?: boolean
}

/** Types its text out like the machines on the walls. Screen readers get the whole text at once. */
export function Typewriter({
  segments,
  duration = 1400,
  onView = false,
  as: Tag = 'div',
  className,
  caret = true,
  holdCaret = true,
}: Props) {
  const segs = typeof segments === 'string' ? [{ text: segments }] : segments
  const full = segs.map((s) => s.text + (s.end ? ` ${s.end}` : '')).join('')
  const count = (s: Segment) => s.text.length + (s.end ? s.end.length : 0)
  const total = segs.reduce((a, s) => a + count(s), 0)
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const go = !onView || inView
  const [n, setN] = useState(reduce ? total : 0)

  useEffect(() => {
    if (reduce) {
      setN(total)
      return
    }
    if (!go) return
    setN(0)
    const perChar = Math.max(7, Math.min(32, duration / Math.max(total, 1)))
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const next = Math.min(total, Math.floor((t - t0) / perChar))
      setN(next)
      if (next < total) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [full, total, go, reduce, duration])

  let left = n
  const typing = n < total
  // The caret sits in whichever segment is being typed (or the last, once done).
  let active = segs.length - 1
  for (let i = 0, seen = 0; i < segs.length; i++) {
    seen += count(segs[i])
    if (n < seen) {
      active = i
      break
    }
  }
  const showCaret = caret && (typing || holdCaret)
  const mark = <span className="caret" style={{ opacity: typing ? 1 : undefined }} />
  return (
    <Tag ref={ref} className={className}>
      <span aria-hidden="true">
        {segs.map((s, i) => {
          const shown = s.text.slice(0, Math.max(0, left))
          const endShown = s.end ? s.end.slice(0, Math.max(0, left - s.text.length)) : ''
          left -= count(s)
          const here = showCaret && i === active
          if (s.end !== undefined)
            return (
              <span key={i} className={`tw-row ${s.className ?? ''}`}>
                <span>
                  {shown.replace(/\n$/, '')}
                  {here && !endShown && mark}
                </span>
                <span className="tw-end">
                  {endShown}
                  {here && endShown && mark}
                </span>
              </span>
            )
          const trail = shown.endsWith('\n')
          return (
            <span key={i} className={s.className}>
              {trail ? shown.slice(0, -1) : shown}
              {here && mark}
              {trail && '\n'}
            </span>
          )
        })}
      </span>
      <span className="sr-only">{full}</span>
    </Tag>
  )
}

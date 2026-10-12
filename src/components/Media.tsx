import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Clip, Photo } from '../lib/media'
import { saveData } from '../lib/hooks'

interface PicProps {
  photo: Photo
  sizes?: string
  className?: string
  style?: CSSProperties
  eager?: boolean
  position?: string
}

export function Pic({ photo, sizes = '100vw', className = 'media-fill', style, eager, position }: PicProps) {
  return (
    <img
      src={photo.src}
      srcSet={photo.srcSet}
      sizes={photo.srcSet ? sizes : undefined}
      width={photo.w}
      height={photo.h}
      alt={photo.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      className={className}
      style={{ ...style, objectPosition: position }}
    />
  )
}

interface ClipProps {
  clip: Clip
  className?: string
  position?: string
}

/** Muted, looping, only plays while on screen. Falls back to the poster if the clip won't load. */
export function LoopVideo({ clip, className = 'media-fill', position }: ClipProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()
  const [failed, setFailed] = useState(false)
  const inView = useInView(ref, { margin: '200px 0px' })
  const still = reduce || failed || saveData()

  useEffect(() => {
    const v = ref.current
    if (!v || still) return
    v.muted = true
    if (inView) v.play().catch(() => {})
    else v.pause()
  }, [inView, still])

  if (still)
    return (
      <img
        src={clip.poster}
        alt={clip.alt}
        width={clip.w}
        height={clip.h}
        loading="lazy"
        decoding="async"
        className={className}
        style={{ objectPosition: position }}
      />
    )

  return (
    <video
      ref={ref}
      className={className}
      style={{ objectPosition: position }}
      poster={clip.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={clip.alt}
      onError={() => setFailed(true)}
    >
      <source src={clip.mp4} type="video/mp4" onError={() => setFailed(true)} />
    </video>
  )
}

interface WedgeProps {
  children: ReactNode
  /** Which side carries the diagonal. */
  side?: 'left' | 'right'
  /** How far the diagonal cuts in, as a % of width. */
  cut?: number
  className?: string
  style?: CSSProperties
  delay?: number
}

/** The building's wedge as a frame: one sharp diagonal, which slices the picture in on first view. */
export function Wedge({ children, side = 'left', cut = 22, className = '', style, delay = 0 }: WedgeProps) {
  const reduce = useReducedMotion()
  const c = `${cut}%`
  const full =
    side === 'left'
      ? `polygon(${c} 0%, 100% 0%, 100% 100%, 0% 100%)`
      : `polygon(0% 0%, 100% 0%, ${100 - cut}% 100%, 0% 100%)`
  const from =
    side === 'left'
      ? `polygon(100% 0%, 100% 0%, 100% 100%, ${100 - cut}% 100%)`
      : `polygon(0% 0%, ${cut}% 0%, 0% 100%, 0% 100%)`
  return (
    <motion.div
      className={`wedge-frame ${className}`}
      style={{ ...style, clipPath: full }}
      initial={reduce ? false : { clipPath: from }}
      whileInView={{ clipPath: full }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.1, ease: [0.7, 0, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  as?: 'div' | 'li' | 'p' | 'section' | 'article'
}

export function Reveal({ children, className, delay = 0, y = 28, as = 'div' }: RevealProps) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1], delay }}
    >
      {children}
    </M>
  )
}

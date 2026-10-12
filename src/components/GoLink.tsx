import type { MouseEvent, ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * The router lives in the hash, so in-page anchors are scrolled to by hand.
 * `to` is "#section", "/route" or "/route#section".
 */
export function useGoTo() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return (to: string) => {
    const [path, id] = to.startsWith('#') ? [pathname, to.slice(1)] : to.split('#')
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scroll = () => {
      const el = id ? document.getElementById(id) : null
      if (el)
        el.scrollIntoView({
          behavior: smooth ? 'smooth' : 'auto',
          block: 'start',
        })
      else window.scrollTo({ top: 0 })
    }
    if (path && path !== pathname) {
      navigate(path, { state: id ? { scrollTo: id } : undefined })
    } else scroll()
  }
}

interface Props {
  to: string
  children: ReactNode
  className?: string
  onClick?: () => void
  'aria-label'?: string
}

export function GoLink({ to, children, className, onClick, ...rest }: Props) {
  const go = useGoTo()
  const { pathname } = useLocation()
  const path = to.startsWith('#') ? pathname : to.split('#')[0]
  const handle = (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return
    e.preventDefault()
    onClick?.()
    go(to)
  }
  return (
    <a href={`#${path}`} className={className} onClick={handle} {...rest}>
      {children}
    </a>
  )
}

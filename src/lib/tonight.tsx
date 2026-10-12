import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { londonClock, parseAt, readAtParam, statusAt, type Clock, type Status } from './time'

const TonightContext = createContext<Status | null>(null)

const THEME_COLOR = {
  day: '#faf6f1',
  evening: '#16281f',
  late: '#110f0d',
} as const

function currentClock(): Clock {
  const real = londonClock()
  return parseAt(readAtParam(), real) ?? real
}

export function TonightProvider({ children }: { children: ReactNode }) {
  const [clock, setClock] = useState<Clock>(currentClock)

  useEffect(() => {
    const refresh = () => setClock(currentClock())
    window.addEventListener('hashchange', refresh)
    window.addEventListener('popstate', refresh)
    // Live clock: re-check every 20s so the site turns over at 5pm and kitchen close.
    const id = clock.overridden ? 0 : window.setInterval(refresh, 20_000)
    return () => {
      window.removeEventListener('hashchange', refresh)
      window.removeEventListener('popstate', refresh)
      if (id) window.clearInterval(id)
    }
  }, [clock.overridden])

  const status = useMemo(() => statusAt(clock), [clock])

  useEffect(() => {
    document.documentElement.dataset.mode = status.mode
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[status.mode])
  }, [status.mode])

  return <TonightContext.Provider value={status}>{children}</TonightContext.Provider>
}

export function useTonight(): Status {
  const ctx = useContext(TonightContext)
  if (!ctx) throw new Error('useTonight must sit inside TonightProvider')
  return ctx
}

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Occasion } from './time'
import type { DayKey } from '../data/venue'

export interface BookingRequest {
  occasion?: Occasion['id']
  /** Open on the next one of these weekdays. */
  day?: DayKey
}

interface BookingApi {
  isOpen: boolean
  request: BookingRequest
  /** Bumps each time the sheet opens, so it resets cleanly. */
  session: number
  open: (req?: BookingRequest) => void
  close: () => void
}

const BookingContext = createContext<BookingApi | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false)
  const [request, setRequest] = useState<BookingRequest>({})
  const [session, setSession] = useState(0)

  const open = useCallback((req: BookingRequest = {}) => {
    setRequest(req)
    setSession((n) => n + 1)
    setOpen(true)
  }, [])
  const close = useCallback(() => setOpen(false), [])

  const api = useMemo(() => ({ isOpen, request, session, open, close }), [isOpen, request, session, open, close])
  return <BookingContext.Provider value={api}>{children}</BookingContext.Provider>
}

export function useBooking(): BookingApi {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must sit inside BookingProvider')
  return ctx
}

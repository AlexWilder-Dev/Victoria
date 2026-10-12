import { lazy, Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { TonightProvider } from './lib/tonight'
import { BookingProvider } from './lib/booking'
import { Header } from './components/Header'
import { MobileBar } from './components/MobileBar'
import { BookingSheet } from './components/BookingSheet'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'

const Menu = lazy(() => import('./pages/Menu'))

/** New page: top. Arriving with a section in mind: scroll to it once it's rendered. */
function ScrollManager() {
  const { pathname, state } = useLocation()
  useEffect(() => {
    const id = (state as { scrollTo?: string } | null)?.scrollTo
    if (!id) {
      window.scrollTo(0, 0)
      return
    }
    let tries = 0
    const find = () => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ block: 'start' })
      else if (tries++ < 20) window.setTimeout(find, 50)
    }
    find()
  }, [pathname, state])
  return null
}

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HashRouter>
        <TonightProvider>
          <BookingProvider>
            <ScrollManager />
            <a
              className="skip"
              href="#main"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('main')?.focus()
              }}
            >
              Skip to content
            </a>
            <Header />
            <main id="main" tabIndex={-1}>
              <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/menu/:tab" element={<Menu />} />
                  <Route path="*" element={<Home />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <MobileBar />
            <BookingSheet />
          </BookingProvider>
        </TonightProvider>
      </HashRouter>
    </MotionConfig>
  )
}

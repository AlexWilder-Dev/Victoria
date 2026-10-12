import { Hero } from '../sections/Hero'
import { Week } from '../sections/Week'
import { Food } from '../sections/Food'
import { Weekends } from '../sections/Weekends'
import { Late } from '../sections/Late'
import { Pub } from '../sections/Pub'
import { History } from '../sections/History'
import { Reviews } from '../sections/Reviews'
import { Parties } from '../sections/Parties'
import { FindUs } from '../sections/FindUs'

export function Home() {
  return (
    <>
      <Hero />
      <Week />
      <Food />
      <Weekends />
      <Late />
      <Pub />
      <History />
      <Reviews />
      <Parties />
      <FindUs />
    </>
  )
}

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export const WEEK: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export const DAY_NAMES: Record<DayKey, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

export const DAY_SHORT: Record<DayKey, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
}

export const VENUE = {
  name: 'The Victoria',
  street: '166 Queenstown Road',
  area: 'Battersea, London',
  postcode: 'SW8 3QH',
  station: 'Queenstown Road (Battersea)',
  phone: '07934 735902',
  phoneIntl: '+447934735902',
  whatsapp: 'https://wa.me/447934735902',
  email: 'smeots@gmail.com',
  instagram: 'https://instagram.com/thevictoria166',
  instagramHandle: '@thevictoria166',
  tiktok: 'https://tiktok.com/@thevic166',
  tiktokHandle: '@thevic166',
  facebook: 'https://facebook.com/Victoria-Battersea-309142945147',
  directions:
    'https://www.google.com/maps/search/?api=1&query=The+Victoria+Battersea&query_place_id=ChIJJ5NZYAcFdkgRUjXqc2l4VOI',
  rating: '4.7',
  reviewCount: '2,187',
}

/** Minutes from midnight on the day the shift starts. 26:00 (1560) is 2am the next morning. */
export interface Span {
  open: number
  close: number
}

const h = (hours: number, minutes = 0) => hours * 60 + minutes

export const BAR_HOURS: Record<DayKey, Span> = {
  mon: { open: h(16), close: h(24) },
  tue: { open: h(16), close: h(24) },
  wed: { open: h(16), close: h(24) },
  thu: { open: h(16), close: h(24) },
  fri: { open: h(12), close: h(26) },
  sat: { open: h(12), close: h(26) },
  sun: { open: h(12), close: h(24) },
}

export const KITCHEN_HOURS: Record<DayKey, Span> = {
  mon: { open: h(16), close: h(22) },
  tue: { open: h(16), close: h(22) },
  wed: { open: h(16), close: h(22) },
  thu: { open: h(16), close: h(22) },
  fri: { open: h(12), close: h(22) },
  sat: { open: h(12), close: h(22) },
  sun: { open: h(12), close: h(21) },
}

export interface DealLine {
  label: string
  price?: string
}

export interface Deal {
  id: string
  days: DayKey[]
  name: string
  start: number
  end: number
  price?: string
  /** One-line description, exactly as the pub words it. */
  blurb: string
  lines?: DealLine[]
  kind: 'food' | 'drink' | 'both'
  image?: string
}

export const DEALS: Deal[] = [
  {
    id: 'burger',
    days: ['mon'],
    name: 'Burger Night',
    start: h(17, 30),
    end: h(22),
    price: '£13.95',
    blurb: 'Any burger, wrap or hotdog with fries and a free drink.',
    kind: 'food',
    image: 'burger',
  },
  {
    id: 'steak',
    days: ['thu'],
    name: 'Steak Night',
    start: h(17, 30),
    end: h(22),
    price: '£18.95',
    blurb: '330g (10oz) Black Angus sirloin, chunky chips, trimmings and a free drink.',
    kind: 'food',
    image: 'steak',
  },
  {
    id: 'happy-friday',
    days: ['fri'],
    name: 'Happy Friday',
    start: h(20),
    end: h(23),
    blurb: 'Two-for deals on frozen cocktails and spritzes, money off prosecco, and shots.',
    lines: [
      { label: '2 frozen cocktails', price: '£12' },
      { label: '2 Aperol Spritz', price: '£14' },
      { label: '2 seasonal spritz', price: '£16' },
      { label: 'Bottle of prosecco', price: '30% off' },
      { label: 'Shot deals' },
    ],
    kind: 'drink',
    image: 'frozen',
  },
  {
    id: 'boozy-lunch',
    days: ['sat', 'sun'],
    name: 'Boozy Lunch',
    start: h(12),
    end: h(15),
    price: '+£25',
    blurb:
      'Any meal from the main, brunch or roast menu. Add £25 for 7 drinks from a selected list, with no time limit on drinking them.',
    kind: 'both',
    image: 'cheers',
  },
  {
    id: 'spritz',
    days: ['sat', 'sun'],
    name: 'Seasonal Spritzes',
    start: h(12),
    end: h(16),
    price: '2 for £16',
    blurb: 'Two seasonal spritzes for £16.',
    kind: 'drink',
  },
]

/** Food services that aren't deals but sell the day. */
export const SERVICES = {
  brunch: {
    name: 'Saturday Brunch',
    days: ['sat'] as DayKey[],
    start: h(12),
    end: h(16),
  },
  roast: {
    name: 'Sunday Roast',
    days: ['sun'] as DayKey[],
    start: h(12),
    end: h(21),
  },
}

export const REVIEWS = [
  {
    quote: 'A very relaxing, pleasant, brunch! Staff were very friendly and service was excellent.',
    about: 'brunch' as const,
  },
  {
    quote: 'The pork belly we had on Sunday was honestly great',
    about: 'roast' as const,
  },
  {
    quote: 'It is one of my best birthdays coming here.',
    about: 'birthday' as const,
  },
]

export const SPORT = [
  'Rugby World Cup',
  'Six Nations',
  'World Cup',
  'Euros',
  'Wimbledon',
  'Grand National',
  'Royal Ascot',
]

export const DRESS_CODE = [
  'Dress with a sense of occasion.',
  'No loungewear, tracksuits or dirty clothing.',
  'Staff may ask you to remove hoods or caps.',
  'ID may be requested.',
  "Entry is at management's discretion.",
]

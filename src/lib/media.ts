const B = `${import.meta.env.BASE_URL}media/`

export interface Photo {
  src: string
  srcSet?: string
  w: number
  h: number
  alt: string
}

export interface Clip {
  mp4: string
  poster: string
  w: number
  h: number
  alt: string
}

const photo = (name: string, widths: number[], ratio: number, alt: string): Photo => {
  const max = widths[widths.length - 1]
  return {
    src: `${B}${name}-${max}.webp`,
    srcSet: widths.length > 1 ? widths.map((w) => `${B}${name}-${w}.webp ${w}w`).join(', ') : undefined,
    w: max,
    h: Math.round(max * ratio),
    alt,
  }
}

export const PHOTOS = {
  vic: photo(
    'vic',
    [656],
    746 / 656,
    'The Victoria on its corner of Queenstown Road: three storeys of London brick, a dark green ground floor and VICTORIA in gold over the door',
  ),
  home: photo(
    'home',
    [720, 1280],
    1600 / 1280,
    'The terrace from above at sunset, packed with people at long tables under festoon lights',
  ),
  burger: photo(
    'burger',
    [600, 1000],
    1659 / 1000,
    'A Vic burger on a toasted brioche bun with crispy bacon, melted cheese and a pickle on top, fries on the side',
  ),
  steak: photo(
    'steak',
    [700, 1200],
    1600 / 1200,
    'Black Angus steak with chunky chips, wild rocket, roast tomatoes and field mushroom, on the bar',
  ),
  frozen: photo(
    'frozen',
    [600, 1000],
    1238 / 1000,
    'Frozen cocktails, strawberry and lime, with chilli-salt rims and fresh mint',
  ),
  cheers: photo(
    'cheers',
    [700, 1200],
    1084 / 1200,
    'Four cocktails raised over a wooden table outside: strawberry, edible flowers, jalapeño and lime',
  ),
}

const clip = (name: string, w: number, h: number, alt: string): Clip => ({
  mp4: `${B}${name}.mp4`,
  poster: `${B}${name}-${Math.max(w, h) === 1280 && w > h ? 1280 : 720}.webp`,
  w,
  h,
  alt,
})

export const CLIPS = {
  screens: clip(
    'screens',
    720,
    1280,
    'A packed terrace under festoon lights going wild during a big match, The Victoria sign overhead',
  ),
  dogs: clip(
    'dogs',
    720,
    1280,
    'A long-haired dachshund in a red harness sitting up on a terrace table under the Victoria sign',
  ),
  games: clip('games', 720, 1280, 'Lining up a shot on the pool table in the back games room'),
  outside: clip(
    'outside',
    1280,
    720,
    'The terrace at sunset: big umbrellas, heaters and festoon lights over a busy crowd',
  ),
}

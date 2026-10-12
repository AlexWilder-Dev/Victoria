# The Victoria, Battersea

A speculative redesign for **The Vic**, the late night gastropub at 166 Queenstown Road, SW8. It's a front-end demo with full visual polish and interactions, running on static data. There's no CMS, database or payments.

**Eat well. Drink better. Stay late.**

## The idea

- **Type leads.** Bodoni Moda (matching the high-contrast serif in the logo) for headlines, Courier Prime for anything that would be typed: times, prices, labels. A nod to the vintage typewriters on the walls.
- **One sharp diagonal.** The pub is a wedge-shaped building on a corner, so a single diagonal edge recurs everywhere: image crops, section edges, buttons, the days of the week.
- **The site keeps the pub's hours.** It reads the time in London and changes with the day:
  - **Daytime:** cream, and it leads with brunch, boozy lunch and the terrace.
  - **From 5pm:** bottle green, leading with tonight's deal. The photo of the building darkens and the sign over the door lights up.
  - **After the kitchen shuts:** it goes dark. "Kitchen's closed. Bar's open till 2."
- After midnight still counts as the night before, so 1am on Saturday is Friday night.

## Try any day and time

Add `?at=` with a day and a 24-hour time:

- `?at=fri-21:30`: Happy Friday, kitchen open till 10, bar till 2
- `?at=sat-01:00`: Friday night, late. The kitchen's closed and the bar's open till 2
- `?at=sun-13:00`: Sunday roast, with boozy lunch on now
- `?at=mon-18:00`: Burger Night
- `?at=tue-03:00`: closed, back at 4pm

It also works inside the hash, e.g. `#/menu?at=sat-11:00`.

## What's in it

- **Tonight at The Vic:** a live strip in the hero showing bar status, kitchen status and what's on, in London time.
- **The week:** Mon–Sun with today highlighted. Tap a day and its deal types itself out, with exact prices and times.
- **Booking sheet:** date, time (only slots inside kitchen hours, and inside the brunch, boozy lunch or roast windows), guests, occasion, name and phone, then a confirmation. "Book a table" is always one tap away; on phones there's a bottom bar with Book · Menu · WhatsApp.
- **Menu** (`#/menu`): Food · Saturday brunch · Sunday roast · Vegan · Wine, with V / VG / GF filters. With no tab chosen it opens on whatever the kitchen is doing today.
- **Parties & big tables:** a fill-in-the-blanks enquiry with a success state.
- Respects reduced motion (no autoplaying video, instant typing) and Save-Data (posters instead of clips).

## Develop

```bash
npm install
npm run dev      # http://localhost:5173/
npm run build    # outputs to dist/
npm run preview
```

### Media

All photos and clips are the pub's own, pulled from their current site. Originals go in `media-src/` (git-ignored); web versions (WebP stills, short muted MP4 loops) are built into `public/media/`.

```bash
./scripts/fetch-media.sh      # download originals
./scripts/optimise-media.sh   # needs Python 3 + Pillow and ffmpeg
```

## Deploy

Vite + React + TypeScript + Framer Motion, using HashRouter. Asset paths are relative, so the same build works at any path, e.g. `/Victoria/` or `/victoria-battersea/`.

Live: https://alexwilder-dev.github.io/Victoria/

```bash
./scripts/deploy-pages.sh   # builds and publishes dist/ to the gh-pages branch
```

GitHub Pages serves the `gh-pages` branch (Settings → Pages → Deploy from a branch → `gh-pages` / root). `.github/workflows/deploy.yml` does the same publish on every push to `main`.

---

Site by AlexWilder-Dev

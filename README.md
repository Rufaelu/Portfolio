# RUFAEL MELESE // SYS.PORTFOLIO

Software developer, tester and Microsoft 365 administrator at ActiveAddis.
A retro-futurist portfolio: 1979 CRT hardware running 2087 firmware.
Static site — no build step, no dependencies, no trackers.

```
.
├── index.html          # all markup
├── css/style.css       # the whole design system
├── js/main.js          # boot sequence, scroll engine, portrait scan
├── assets/me.png       # background-removed portrait (the scroll piece)
└── 20240427_*.jpg      # original source photos
```

## Run it

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

## Two phosphors

The tube ships with two colour guns, switched by the `P3` / `P11` button in the
nav and remembered in `localStorage`:

- **P3** — amber on oxblood (the default)
- **P11** — blue on deep navy, with the accent flipped warm

Every colour in the stylesheet reads from channel triples declared on `:root`
(`--rgb`, `--rgb-hi`, `--rgb-accent`, `--rgb-warm`, `--rgb-paper`), so
`:root[data-theme="blue"]` reskins the whole page by redeclaring five numbers —
the portrait included, via the `--duo` / `--duo-dim` filter chains. **Never
hardcode an `rgba(255,176,0,…)` again**: use `rgba(var(--rgb), …)` or the theme
switch will skip it.

A small inline script in `<head>` applies the stored theme before first paint so
the tube never flashes the wrong colour on load.

To add a third phosphor, copy the `:root[data-theme="blue"]` block, change the
values, and extend `setPhosphor()` in [js/main.js](js/main.js).

## The scroll portrait

`#portrait` is a 300vh-tall section with a `position: sticky` viewport inside it.
As you scroll through that distance, `updatePortrait()` in [js/main.js](js/main.js)
maps scroll position to `0 → 1` and drives, in order:

- a horizontal scan beam sweeping bottom → top
- a `clip-path` wipe that keeps the un-scanned region dimmed
- parallax on the figure and the oversized background type
- three HUD callouts lighting up in sequence
- an RGB-split glitch as the scan completes

## Things to change

| What | Where |
|---|---|
| Email / GitHub / LinkedIn | `#contact` in [index.html](index.html) |
| Roles in the hero typewriter | `ROLES` at the top of [js/main.js](js/main.js) |
| Projects | the four `.card` blocks under `#work` |
| Stats & skill meters | `data-count` and `data-val` attributes |
| Timeline entries | the `.timeline` list |
| Palette | the `:root` and `:root[data-theme="blue"]` blocks in [css/style.css](css/style.css) |
| Coordinates in the hero | `.hero__meta` |

### What is real

The three work cards and the system log are drawn from github.com/Rufaelu —
Space Control, JoinMe and the Men's Store Management System, described from
their READMEs and language breakdowns. Three of the four stat counters are real
too (18 public repos, 6 languages shipped, 3 Go/OpenGL engines).

### What is still placeholder

- **Skill percentages** — every `data-val` in `#stack` is a guess. Adjust or drop
  the meters entirely.
- **"5 M365 workloads run"** — the fourth stat counter.
- **Hero coordinates** — `.hero__meta` is set to Addis Ababa. Change or remove.
- **`resume.pdf`** — the contact link points nowhere yet.
- **Employment history** — the system log opens with ActiveAddis but carries no
  job title or start date. Fill those in on the first `.timeline` entry.

## Accessibility

`prefers-reduced-motion` disables the boot sequence, scanline beam, flicker and
all transitions. The layout collapses to a single column under 980px.

# [dersu.space](https://dersu.space/)

A static multi-page website for musician Dersu Doğan, built with Vite.

## Architecture

- **Vite** — dev server with HMR + production build (`dist/`)
- **Multi-page app** — each page is a standalone HTML entry point (`index.html`, `about.html`, `portfolio.html`, `link.html`, `soon.html`)
- **Static assets** live in `public/` and are copied to `dist/` as-is (no bundling)
- **Clean URLs** — `/about` instead of `/about.html`; Vite dev plugin handles it locally, Apache `.htaccess` + folder-based `index.html` structure handles it in production (no trailing slashes)
- **Fallback redirects** — unknown/incomplete URLs and common HTTP error responses are redirected to `/` (home) via Apache rules; a static `404.html` redirect page is also shipped for hosts that serve 404 pages directly
- **Particles.js** — animated particle background on most pages, configured inline in `js/app.js`; particle count is reduced on mobile (<768px) for performance
- **Font Awesome 5** — loaded from CDN
- **Responsive** — desktop-first approach with two breakpoints (768px tablet, 480px phone); no CSS framework dependency

## Project Structure

```
├── index.html          # Home page (Vite entry)
├── about.html          # About page
├── portfolio.html      # Portfolio — sidebar + 3-column card grid (standalone)
├── link.html           # External links
├── soon.html           # Placeholder page
├── vite.config.js      # Vite MPA config + clean URL plugin
├── package.json
├── public/
│   ├── .htaccess       # Apache rewrite rules for clean URLs
│   ├── 404.html        # Static fallback: redirects unknown routes/errors to /
│   ├── css/            # Custom styles (style.css, about.css, portfolio.css)
│   ├── js/             # Particles.js, app.js
│   ├── fonts/          # Quinn, Roboto Condensed
│   └── images/         # SVG logo / favicon
```

## Setup

```sh
npm install
```

## Development

```sh
npm run dev       # Start dev server (localhost:5173)
```

Clean URLs (`/about`, `/link`, `/portfolio`, `/soon`) work in dev via a custom Vite middleware.

## Build & Deploy

```sh
npm run build     # Output to dist/
npm run preview   # Preview production build locally
```

Upload the contents of `dist/` to your web server's `httpdocs/` directory (e.g. via Cyberduck/FTP). Make sure hidden files are visible in Cyberduck (View → Show Hidden Files) so `.htaccess` gets uploaded.

The build output uses a folder structure for clean URLs:

```
dist/
├── index.html              # /
├── about/index.html        # /about
├── link/index.html         # /link
├── portfolio/index.html    # /portfolio
├── soon/index.html         # /soon
├── .htaccess               # Strips trailing slashes, redirects .html URLs
├── 404.html                # Redirect fallback page for direct 404 serving
├── css/
├── js/
├── fonts/
└── images/
```

## Design Decisions

### Main site (index, about, link, soon)
- **Bootstrap removed** — Bootstrap 4, jQuery, and Popper.js vendored files have been deleted from `public/`
- **Flexbox centering** — inner pages (about, link, soon) use `display: flex` on the section container instead of fragile `position: absolute + transform: translate(-50%, -50%)`. Fixes link.html's off-center padding issue
- **Brand layering fix** — on `link.html`, the `Dersu` brand now has a higher stacking order so the external links list never renders above it at any breakpoint
- **Header/content separation** — on `link.html`, `#links` now starts below the header with viewport-based max height + vertical scroll, preventing any overlap with the `Dersu` brand on all screen sizes
- **Header/content separation (about)** — on `about.html`, `.about` now starts below the header with viewport-based max height + vertical scroll at each breakpoint, so the `About.` title and biography never collide with the `Dersu` brand on smaller heights/resolutions
- **Social icons on link page** — `link.html` now includes `<ul id="icons">` (YouTube, Spotify, Apple Music, Instagram, TikTok). On desktop (>768px) they appear in the right sidebar column, identical to home and about pages. On mobile (≤768px) they switch to a horizontal row of 5 equal boxes, centered and aligned directly above the rectangular link buttons (same `max-width: 40rem`), visually behaving as part of the same links module (not fixed to the viewport). The `.link-page` body class scopes these mobile overrides so home/about layouts are not affected
- **Social icon behavior** — all right-sidebar social links now open in a new browser tab (`target="_blank"` + `rel="noopener noreferrer"`). The vertical sidebar icon spacing is controlled with responsive `gap: clamp(...)` values and has been widened further while staying proportional across screen heights and breakpoints
- **Link list deduplicated** — on `link.html`, standalone rectangular `Youtube` and `Instagram` items were removed from `#links` because those destinations already exist in the 4-icon social row
- **Link list refreshed** — on `link.html`, the `Karma Kaset röportajı` button was removed; three new buttons were inserted directly under the 4-icon row and above the `Uyanırsam` set: `7 Timeless Sins (Soundtrack) - Spotify`, `7 Timeless Sins (Soundtrack) - Apple Music`, and `Nephes - YouTube`; `Uyanırsam - Youtube` label was normalized to `Uyanırsam - YouTube`
- **Contact** — all pages use `mailto:hi@dersu.space` instead of linking to the "soon" placeholder
- **Navigation** — all pages include a "Work" link to `/portfolio`

### Portfolio page (`/portfolio`)
- **Standalone page** — has its own CSS (`portfolio.css`), does not share the slide-out nav from the main site
- **Left sidebar** — fixed 220px sidebar with "Dersu" brand (Quinn font, links to `/`) and a list of all project names as anchor links. Contact link pushed to bottom via `margin-top: auto`. Semi-transparent background (`rgba(0,0,0,0.85)`) lets particles subtly show through
- **Sidebar brand sizing tweak** — portfolio sidebar brand text is slightly increased (`1.76rem`) to improve visual balance while preserving the existing layout flow
- **3-column card grid** — CSS Grid (`repeat(3, 1fr)`) with 24px gaps. Each card has a thumbnail (cyan placeholder `rgb(64,195,255)`), title, date, and description. Cards link externally (YouTube, Spotify, SoundCloud, etc.)
- **Dersu card content update** — `Dersu` card now uses real thumbnail image `/images/Dersu_002.jpg`, navigates to `/link`, keeps the date slot intentionally blank for later editing, and sets description text to `Search for a music.`
- **Pale Circus card content update** — `Pale Circus` card now uses thumbnail image `/images/PC_Photo3.jpg`, links to `https://palecircus.com`, keeps the date slot intentionally blank for later editing, and sets description text to `Creating a listenable noise.`
- **BGD card content update** — `BGD` card now uses thumbnail image `/images/BGD_dersununeli_final_kare.jpg`, links to `https://open.spotify.com/intl-tr/artist/7BRoydMywzrmbIfem85iUq?si=AUCY3pv7RWuUb1DRr65BpQ`, keeps the date slot intentionally blank for later editing, and sets description text to `Ver elini öbür dünya.`
- **ID.EXE card content update** — `ID.EXE: THE HUMAN PATCH (Ecem Dilan Köse)` card now uses thumbnail image `/images/_dsf8955-enhanced-nr.jpg`, links to `https://artonistanbul.com/tr/exhibitions/106-id.exe-the-human-patch-ecem-dilan-kose/overview/`, shows date `2025 - İstanbul`, and sets description text to `Dolby Atmos sound desing and composition for immersive exhibition.`
- **Kaptin Kaptin card content update** — `Kaptin Kaptin Jingle` card now uses thumbnail image `/images/kaptinkaptinbeyaz.png.avif`, links to `https://kaptinkaptin.com.tr`, shows date `2025`, and sets description text to `Brand jingles and advertising voiceovers.`
- **Göçer Zaman card content update** — `GÖÇER ZAMAN MOVIE` card now uses thumbnail image `/images/gocerzaman.jpg`, shows date `2025`, sets description text to `Sound design and mix.`, and is intentionally non-clickable (no redirect target)
- **Class Dismissed card content update** — `CLASS DISMISSED: LIVE STREAM` card now uses thumbnail image `/images/classdismissed.jpg`, links to `https://comd.bilkent.edu.tr/comd-will-collaborate-as-a-partner-in-the-live-stream-class-dismissed/`, shows date `2025 - New York & Ankara`, and sets description text to `Live sound streaming.`
- **Book Part card content update** — `BOOK PART: FARKLI MEDENİYETLERİN ORTAK SESİ` card now uses thumbnail image `/images/kapak.jpg`, links to `https://www.amazon.com.tr/Depremleri-Kimli%C4%9Fine-K%C3%BClt%C3%BCrel-Miras%C4%B1na-Sosyolojik/dp/6253740946/ref=sr_1_1?...`, keeps date `2024`, and sets description text to `Sociological & Ethnomusicological research.`
- **Portfolio chronology order update (14 Mar 2026)** — in both sidebar and card flow, project order is now: `Dersu`, `Pale Circus`, `BGD`, `ID.EXE`, `Göçer Zaman Movie`, `Class Dismissed`, `Kaptin Kaptin Jingle`, `7 Timeless Sins`, `Book Part`
- **Black thumbnail support** — `.card-thumbnail-black` utility class in `portfolio.css` allows per-card black backgrounds for transparent logos/images (used by Kaptin Kaptin card)
- **Contain fit tuning for poster-style assets** — on `#kaptin-kaptin`, logo image uses centered `contain` sizing at `84%` width/height; on `#gocer-zaman` and `#book-part`, poster images use centered full-area `contain` on black background to avoid cropping
- **Anchor ID cleanup** — sidebar tags and card anchors now use semantic IDs (`#gocer-zaman`, `#class-dismissed`) instead of legacy placeholders (`#ny-theatre`, `#begehungen`)
- **Card hover** — subtle `scale(1.02)` transform + thumbnail opacity shift
- **Responsive** — tablet (≤1024px): 2 columns, sidebar narrows to 180px. Mobile (≤768px): 1 column, sidebar hidden behind hamburger menu that slides in as an overlay
- **Hamburger toggle** — two-line icon animates to X on open, overlay click closes sidebar
- **Particles.js** — same full-page fixed background as main site, behind all content (`z-index: 0`)
- **Designed to grow** — adding a project means adding a card to HTML + a link to sidebar nav; grid auto-wraps

### Shared
- All vendored libraries (Particles.js) are in `public/` so Vite serves them without processing
- HTML files remain at root level as Vite MPA entry points; on build, they are restructured into `page/index.html` folders for clean URLs
- Apache `.htaccess` disables `DirectorySlash` and strips trailing slashes so URLs stay as `/about` (not `/about/`)
- Apache `.htaccess` now redirects unknown paths and common error codes (400/401/403/404/405/408/410/500/502/503/504) to `/`
- `public/404.html` provides a host-level fallback redirect to `/` when a platform serves 404 pages directly
- No templating or component extraction — pages share copy-pasted markup
- All HTML and CSS files use descriptive section comments for maintainability

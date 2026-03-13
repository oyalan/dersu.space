# [dersu.space](https://dersu.space/)

A static multi-page website for musician Dersu Doğan, built with Vite.

## Architecture

- **Vite** — dev server with HMR + production build (`dist/`)
- **Multi-page app** — each page is a standalone HTML entry point (`index.html`, `about.html`, `portfolio.html`, `link.html`, `soon.html`)
- **Static assets** live in `public/` and are copied to `dist/` as-is (no bundling)
- **Clean URLs** — `/about` instead of `/about.html`; Vite dev plugin handles it locally, Apache `.htaccess` + folder-based `index.html` structure handles it in production (no trailing slashes)
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
- **Contact** — all pages use `mailto:dersudoganmusic@gmail.com` instead of linking to the "soon" placeholder
- **Navigation** — all pages include a "Work" link to `/portfolio`

### Portfolio page (`/portfolio`)
- **Standalone page** — has its own CSS (`portfolio.css`), does not share the slide-out nav from the main site
- **Left sidebar** — fixed 220px sidebar with "Dersu" brand (Quinn font, links to `/`) and a list of all project names as anchor links. Contact link pushed to bottom via `margin-top: auto`. Semi-transparent background (`rgba(0,0,0,0.85)`) lets particles subtly show through
- **3-column card grid** — CSS Grid (`repeat(3, 1fr)`) with 24px gaps. Each card has a thumbnail (cyan placeholder `rgb(64,195,255)`), title, date, and description. Cards link externally (YouTube, Spotify, SoundCloud, etc.)
- **Card hover** — subtle `scale(1.02)` transform + thumbnail opacity shift
- **Responsive** — tablet (≤1024px): 2 columns, sidebar narrows to 180px. Mobile (≤768px): 1 column, sidebar hidden behind hamburger menu that slides in as an overlay
- **Hamburger toggle** — two-line icon animates to X on open, overlay click closes sidebar
- **Particles.js** — same full-page fixed background as main site, behind all content (`z-index: 0`)
- **Designed to grow** — adding a project means adding a card to HTML + a link to sidebar nav; grid auto-wraps

### Shared
- All vendored libraries (Particles.js) are in `public/` so Vite serves them without processing
- HTML files remain at root level as Vite MPA entry points; on build, they are restructured into `page/index.html` folders for clean URLs
- Apache `.htaccess` disables `DirectorySlash` and strips trailing slashes so URLs stay as `/about` (not `/about/`)
- No templating or component extraction — pages share copy-pasted markup
- All HTML and CSS files use descriptive section comments for maintainability

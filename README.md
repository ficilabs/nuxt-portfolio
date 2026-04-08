# Portfolio — Nuxt 4 + Storyblok

A JAMstack portfolio site built with Nuxt 4, Storyblok CMS, and GSAP.

## Tech Stack

- **Framework** — [Nuxt 4](https://nuxt.com)
- **CMS** — [Storyblok](https://www.storyblok.com) (headless, EU region)
- **Animations** — [GSAP](https://gsap.com)
- **Styling** — SCSS with custom design system
- **Fonts** — Google Fonts (Open Sans, Jost) via `@nuxtjs/google-fonts`
- **Images** — `@nuxt/image` with Storyblok image transformations

## Prerequisites

- Node.js 18+
- A [Storyblok](https://www.storyblok.com) account with a space configured

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

Set your Storyblok access token in `.env`:

```env
STORYBLOK_TOKEN=your_draft_token_here
```

```bash
# Start dev server
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `STORYBLOK_TOKEN` | Storyblok space API token (draft for dev, public for prod) |

## Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm run preview   # Preview production build
```

## Project Structure

```
app/
├── assets/styles/   # SCSS design system (variables, colors, spacing, typography)
├── components/      # Global Vue components
├── layouts/         # Nuxt layouts
├── pages/           # File-based routing
├── storyblok/       # Storyblok component mappings
├── types/           # TypeScript interfaces
└── utils/           # Shared utilities (GSAP animations, image helpers)
public/
└── sprite.svg       # SVG icon sprite
```

## Storyblok Setup

Content is managed entirely through Storyblok. The following components must be defined in your Storyblok space:

- `Page` — page wrapper with title and body
- `MyHero` — hero section
- `MyRichText` — rich text block
- `MyButtonList` / `MyButton` — CTA buttons
- `MyProjectList` / `MyProject` — project grid with filter
- `MyProfile` — profile card with social links
- `MyParagraph` — text + figure section
- `MyImage` — responsive image with lazy loading
- `Config` — global navigation config

## License

MIT

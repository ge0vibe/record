# rekord

Vinyl collection and wishlist tracker built with Next.js 14, TypeScript, Tailwind CSS, and Prisma 7 (SQLite).

## Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite via Prisma 7 + libsql adapter (`@prisma/adapter-libsql`)
- **DB file:** `prisma/dev.db`

## Commands

```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build
npm run lint       # Run ESLint
npx prisma studio  # Open Prisma Studio (DB GUI)
npx prisma migrate dev --name <name>  # Run a new migration after schema changes
npx prisma generate                   # Regenerate Prisma client after schema changes
```

## Project Structure

```
app/
  page.tsx                  # Dashboard (record count, wishlist count, recently added)
  layout.tsx                # Root layout with Navbar
  globals.css
  collection/page.tsx       # All records grid with search + genre filter
  wishlist/page.tsx         # Wishlist grid with delete
  add-record/page.tsx       # Add record form
  add-wishlist/page.tsx     # Add wishlist item form
  record/[id]/page.tsx      # Record detail page
  record/[id]/edit/page.tsx # Edit record form
  wishlist/[id]/edit/page.tsx # Edit wishlist item form
  api/
    records/route.ts        # GET all, POST
    records/[id]/route.ts   # GET, PUT, DELETE
    wishlist/route.ts       # GET all, POST
    wishlist/[id]/route.ts  # GET, PUT, DELETE

components/
  Navbar.tsx       # Top navigation
  RecordCard.tsx   # Card used in collection grid
  WishlistCard.tsx # Card used in wishlist grid
  RecordForm.tsx   # Shared form for add/edit (mode: "record" | "wishlist")
  StarRating.tsx   # Interactive or readonly 1–5 star rating

lib/
  prisma.ts   # Prisma client singleton (libsql adapter)
  types.ts    # TypeScript interfaces for Record and WishlistItem

prisma/
  schema.prisma   # Record and WishlistItem models
  dev.db          # SQLite database (gitignored)
  prisma.config.ts # Prisma 7 config with datasource URL
```

## Models

**Record** — `id, artist, album, year, genre, artworkUrl, starRating, favouriteTrack, cost, notes, createdAt`

**WishlistItem** — `id, artist, album, year, genre, artworkUrl, starRating, favouriteTrack, targetPrice, notes, createdAt`

## Notes

- Prisma 7 no longer supports `url` in `schema.prisma` — the datasource URL lives in `prisma.config.ts`
- The Prisma client requires the libsql driver adapter — see `lib/prisma.ts`
- `img` tags are used intentionally over `next/image` to support arbitrary external artwork URLs without whitelisting domains

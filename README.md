# Agora

A clothing studio site, drop-based. Built with Next.js 15, Tailwind v4, and Motion.

## Local development

```bash
npm install --legacy-peer-deps
npm run dev
```

Open http://localhost:3000.

## Admin

Visit `/admin`. Default password: `agora-admin` (override with the `ADMIN_PASSWORD` env variable).

The admin lets you edit:
- Hero, Philosophy, Newsletter, About, Footer copy and images
- All drops (create, edit, delete) and their products

Content lives in `content/site.json`. Image uploads in development go to `public/uploads/`. For production, see Supabase notes below.

## Production notes

`content/site.json` writes work locally but not on Vercel's read-only serverless filesystem. To deploy:
1. Move content storage to a Postgres / Supabase table
2. Swap image uploads to Supabase Storage (see `.env.example`)

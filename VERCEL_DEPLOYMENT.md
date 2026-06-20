# Vercel Deployment

This project is ready to deploy from the repository root as a single Vercel project:

- `client/` builds the React/Vite frontend into `client/dist`
- `api/[...path].ts` serves the Express API as a Vercel Function
- `server/prisma/schema.prisma` uses PostgreSQL for persistent production data

## Required Environment Variables

Set these in Vercel before deploying:

```text
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
JWT_SECRET=replace-with-a-long-random-secret
```

Use a hosted PostgreSQL database such as Vercel Postgres, Neon, Supabase, or Railway.

## Vercel Settings

The included `vercel.json` sets these automatically:

```text
Install Command: npm install
Build Command: npm run build
Output Directory: client/dist
```

## Deploy

1. Push the repository to GitHub.
2. Import the repo in Vercel.
3. Add `DATABASE_URL` and `JWT_SECRET` in Project Settings > Environment Variables.
4. Deploy.
5. Run the production migration once:

```bash
npm run prisma:migrate
```

You can run the migration from your machine after pulling Vercel env vars, or from any shell that has the production `DATABASE_URL` set.

## Health Check

After deployment, visit:

```text
https://your-project.vercel.app/api/health
```

It should return:

```json
{ "status": "ok" }
```

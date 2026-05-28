# Primary Market Workflow MVP

Local web app MVP for VC/PE/FA primary market workflow management.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Prisma
- SQLite
- npm

## Local Setup

```bash
npm install
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## MVP Pages

- Dashboard: `/`
- Project Kanban: `/projects`

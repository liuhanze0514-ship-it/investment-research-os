# Primary Market Workflow MVP

An AI-native investment research and deal workflow operating system for venture capital and private market teams.

---

## Overview

Investment Research OS is a modern full-stack workflow platform designed for:

* Venture Capital
* Private Equity
* Family Offices
* Investment Research Teams

It combines:

* Deal pipeline management
* Investment memo workflows
* Research organization
* Task coordination
* Timeline tracking
* Document management

into a single Linear-style operating system.

---

## Screenshots

> Screenshots coming soon.

* Dashboard
* Deal Pipeline
* Project Detail
* Investment Memo
* Timeline
* Tasks

---

## Core Features

### Deal Pipeline

* Kanban-based pipeline
* Stage tracking
* Priority management
* Deal status updates
* Search & filtering

### Dashboard

* Weighted pipeline overview
* Upcoming meetings
* Open tasks
* Priority deals
* Activity tracking

### Project Workspace

Each deal contains:

* Company profile
* Financing details
* Contacts
* Meetings
* Documents
* Tasks
* Timeline
* Investment memo

### Investment Memo

Generate structured investment memos using:

* Company data
* Financing data
* Contacts
* Tasks
* Meetings
* Documents

Supports:

* Markdown export
* Copy to clipboard

### Activity Timeline

Tracks:

* Deal updates
* Task activity
* Meetings
* Contact additions
* Document uploads
* Memo exports

---

## Tech Stack

### Frontend

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui

### Backend

* Prisma ORM
* SQLite

### Architecture

* Server Actions
* Modular component system
* Prisma data layer
* URL-based filtering

---

## Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/liuhanze0514-ship-it/investment-research-os.git
cd investment-research-os
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Prisma Migration

```bash
npm run db:migrate -- --name init
```

### 4. Seed Database

```bash
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run db:migrate
npm run db:seed
```

---

## Project Structure

```text
src/
  app/
  components/
  lib/
  types/

prisma/
```

---

## Roadmap

### Current

* Deal workflow management
* Investment memo generation
* Timeline & activity tracking
* Search & filtering
* Document management

### Planned

* Research workspace
* Thesis management
* AI-generated investment memos
* Meeting summarization
* Automated risk analysis
* Market maps
* Company benchmarking
* Multi-user collaboration

---

## Why This Exists

Most investment teams still operate across:

* Notion
* Excel
* Airtable
* Slack
* Email

This project explores a unified investment operating system designed specifically for modern venture workflows.

---

## Future AI Capabilities

Planned AI workflows include:

* AI investment memo generation
* Meeting transcription summaries
* Risk detection
* Automated DD checklists
* Thesis extraction
* Market landscape generation

---

## License

MIT License

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

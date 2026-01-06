# Nasohold Memory Game

## Overview

This is a medical-themed quiz/memory game application called "Nasohold Memory Game." Users watch a video about Nasohold (a medical product) and then answer quiz questions to test their memory, with the opportunity to win prizes. The application features smooth animations, celebratory confetti effects for high scores, and stores quiz submissions in a PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for page transitions and quiz animations
- **Effects**: Canvas Confetti for celebration effects on quiz completion
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (compiled with tsx for development, esbuild for production)
- **API Design**: RESTful endpoints defined in shared routes with Zod validation
- **Structure**: Monorepo with client, server, and shared directories

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` - contains quiz submission table
- **Migrations**: Managed via `drizzle-kit push`

### Project Structure
```
├── client/           # React frontend
│   └── src/
│       ├── components/   # UI components (shadcn/ui + custom)
│       ├── pages/        # Route pages (Home, Quiz)
│       ├── hooks/        # Custom hooks (useQuiz, useToast)
│       └── lib/          # Utilities and query client
├── server/           # Express backend
│   ├── index.ts      # Entry point
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Database operations
│   └── db.ts         # Database connection
├── shared/           # Shared code between client/server
│   ├── schema.ts     # Drizzle database schema
│   └── routes.ts     # API route definitions with Zod schemas
└── attached_assets/  # Static images and media
```

### API Design Pattern
Routes are defined in `shared/routes.ts` with:
- HTTP method and path
- Input validation schema (Zod)
- Response schemas for different status codes

This enables type-safe API calls on both client and server.

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **pg**: Node.js PostgreSQL client
- **Drizzle ORM**: Type-safe database queries and schema management

### Frontend Libraries
- **shadcn/ui**: Pre-built accessible UI components using Radix UI primitives
- **Radix UI**: Headless UI component primitives (dialogs, toasts, etc.)
- **Framer Motion**: Animation library for smooth transitions
- **Canvas Confetti**: Celebration effect library
- **TanStack React Query**: Data fetching and caching

### Build & Development
- **Vite**: Frontend build tool with React plugin
- **esbuild**: Server bundling for production
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type checking across the entire codebase

### Replit-Specific
- `@replit/vite-plugin-runtime-error-modal`: Error overlay during development
- `@replit/vite-plugin-cartographer`: Development tooling
- `@replit/vite-plugin-dev-banner`: Development banner
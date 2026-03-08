# Retrofit Next.js to Astro SSR on Cloudflare

## Objective
Migrate the `infinitunes` application from Next.js to Astro SSR in-place, utilizing React Islands, Shadcn UI (Dark Theme), and Cloudflare D1 via Drizzle ORM.

## Steps
1. **Initialize Astro & Dependencies**: Replace the Next.js `package.json` dependencies with the Astro stack, including `@astrojs/react`, `@astrojs/cloudflare`, Tailwind, and core Shadcn UI dependencies.
2. **Configure Astro & Cloudflare**: Establish `astro.config.mjs` and `wrangler.toml` for Pages/Workers deployment and D1 database bindings.
3. **Database Layer Adjustment**: Update `drizzle.config.ts` and database connection utilities to use `drizzle-orm/d1` and interface through `Astro.locals`.
4. **Layout & Routing Migration**: Port the `src/app/layout.tsx` architecture into `src/layouts/Layout.astro`. Setup `<ViewTransitions />` to ensure the audio player persists across routing.
5. **State & Component Conversion**:
   - Wrap stateful/interactive features in the central `Providers` React component to maintain Jotai state across islands.
   - Inject interactive features as Astro Islands (`client:load`).
6. **Theming**: Enforce the Dark Theme into `globals.css` and map Tailwind accordingly.
7. **Cleanup**: Purge remaining Next.js configuration files (`next.config.ts`, App Router types).
8. **Testing**: Run local `wrangler pages dev` server and ensure all D1 queries and client-side audio states hydrate correctly.

# Inject Drizzle Schema for Job Hunter Podcast

## Objective
Establish the relational data structures in Cloudflare D1 via Drizzle ORM to manage Job Postings, Resume Versions, and the resulting CrewAI generated Podcast Episodes.

## Steps
1. **Schema Definition**: Append the provided `jobs`, `resumes`, and `episodes` schema definitions to `src/lib/db/schema.ts`.
2. **Relationships**: Ensure the `episodes` table properly references the `jobs` and `resumes` tables using standard foreign key constraints with cascading deletes where appropriate.
3. **Data Types**: Verify the `analysis` column is configured to handle JSON payloads natively so the CrewAI structured output (pros, cons, interview questions) can be queried and rendered easily.
4. **Migration Generation**: Execute `npm run db:generate` to create the SQL migration files for these new tables.

# Expand Astro Server with Hono OpenAPI & WebSockets

## Objective
Establish a robust, self-documenting backend utilizing Hono, `@hono/zod-openapi`, and Cloudflare WebSockets. Integrate `drizzle-orm/zod` to create a single source of truth for database and API validation.

## Steps
1. **Dependency Injection**: Install `hono`, `@hono/zod-openapi`, `@hono/swagger-ui`, and `@scalar/hono-api-reference`.
2. **Schema Generation**: Open `src/lib/db/schema.ts` and use `createSelectSchema` and `createInsertSchema` from `drizzle-orm/zod` for the `jobs`, `resumes`, and `episodes` tables. Export these Zod schemas.
3. **Hono Application Setup**: Create `src/api/index.ts` initializing a new `OpenAPIHono` instance configured for OpenAPI v3.1.0.
4. **Route Definitions**: Define REST routes using `createRoute` (ensuring `operationId` is present) and map the Drizzle-Zod schemas to the `request` and `responses` objects.
5. **WebSocket Implementation**: Scaffold a `/ws` endpoint in Hono that upgrades the Cloudflare fetch request to a WebSocket connection for real-time status streaming.
6. **Documentation Endpoints**: Mount `/openapi.json`, `/swagger`, and `/scalar` endpoints dynamically passing the OpenAPI doc configuration.

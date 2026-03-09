import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

import type { APIRoute } from "astro";

import {
  episodes,
  jobs,
  resumes,
} from "@/lib/db/schema";

// Initialize Hono OpenAPI
const app = new OpenAPIHono<{ Bindings: Env }>();

// GET /jobs
app.get(
  "/jobs",
  async (c) => {
    const db = drizzle(c.env.DB);
    const allJobs = await db.select().from(jobs);
    return c.json(allJobs, 200);
  }
);

// Configure OpenAPI Spec
app.doc("/openapi.json", {
  openapi: "3.1.0",
  info: {
    version: "1.0.0",
    title: "Infinitunes API",
  },
});

// Swagger UI
app.get(
  "/swagger",
  swaggerUI({
    url: "/api/openapi.json",
  })
);

// Scalar API Reference
app.get(
  "/scalar",
  apiReference({
    spec: {
      url: "/api/openapi.json",
    },
  })
);

export const ALL: APIRoute = ({ request, locals }) => {
  return app.fetch(request, { DB: locals.runtime.env.DB }) as any;
};

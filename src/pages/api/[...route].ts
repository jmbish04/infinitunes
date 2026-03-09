import { swaggerUI } from "@hono/swagger-ui";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

import type { APIRoute } from "astro";

import {
  episodes,
  insertEpisodeSchema,
  insertJobSchema,
  insertResumeSchema,
  jobs,
  resumes,
  selectEpisodeSchema,
  selectJobSchema,
  selectResumeSchema,
} from "@/lib/db/schema";

// Initialize Hono OpenAPI
const app = new OpenAPIHono<{ Bindings: Env }>();

// GET /jobs
app.openapi(
  createRoute({
    method: "get",
    path: "/jobs",
    operationId: "getJobs",
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.array(selectJobSchema),
          },
        },
        description: "Retrieve a list of jobs",
      },
    },
  }),
  async (c) => {
    const db = drizzle(c.env.DB);
    const allJobs = await db.select().from(jobs);
    return c.json(allJobs, 200);
  }
);

// POST /jobs
app.openapi(
  createRoute({
    method: "post",
    path: "/jobs",
    operationId: "createJob",
    request: {
      body: {
        content: {
          "application/json": {
            schema: insertJobSchema,
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          "application/json": {
            schema: selectJobSchema,
          },
        },
        description: "Create a new job",
      },
    },
  }),
  async (c) => {
    const data = c.req.valid("json");
    const db = drizzle(c.env.DB);
    const result = await db.insert(jobs).values(data).returning();
    return c.json(result[0], 201);
  }
);

// GET /resumes
app.openapi(
  createRoute({
    method: "get",
    path: "/resumes",
    operationId: "getResumes",
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.array(selectResumeSchema),
          },
        },
        description: "Retrieve a list of resumes",
      },
    },
  }),
  async (c) => {
    const db = drizzle(c.env.DB);
    const allResumes = await db.select().from(resumes);
    return c.json(allResumes, 200);
  }
);

// POST /resumes
app.openapi(
  createRoute({
    method: "post",
    path: "/resumes",
    operationId: "createResume",
    request: {
      body: {
        content: {
          "application/json": {
            schema: insertResumeSchema,
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          "application/json": {
            schema: selectResumeSchema,
          },
        },
        description: "Create a new resume",
      },
    },
  }),
  async (c) => {
    const data = c.req.valid("json");
    const db = drizzle(c.env.DB);
    const result = await db.insert(resumes).values(data).returning();
    return c.json(result[0], 201);
  }
);

// GET /episodes
app.openapi(
  createRoute({
    method: "get",
    path: "/episodes",
    operationId: "getEpisodes",
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.array(selectEpisodeSchema),
          },
        },
        description: "Retrieve a list of episodes",
      },
    },
  }),
  async (c) => {
    const db = drizzle(c.env.DB);
    const allEpisodes = await db.select().from(episodes);
    return c.json(allEpisodes, 200);
  }
);

// POST /episodes
app.openapi(
  createRoute({
    method: "post",
    path: "/episodes",
    operationId: "createEpisode",
    request: {
      body: {
        content: {
          "application/json": {
            schema: insertEpisodeSchema,
          },
        },
      },
    },
    responses: {
      201: {
        content: {
          "application/json": {
            schema: selectEpisodeSchema,
          },
        },
        description: "Create a new episode",
      },
    },
  }),
  async (c) => {
    const data = c.req.valid("json");
    const db = drizzle(c.env.DB);
    const result = await db.insert(episodes).values(data).returning();
    return c.json(result[0], 201);
  }
);

// WebSocket endpoint for streaming real-time status
app.get("/ws", async (c) => {
  const upgradeHeader = c.req.header("Upgrade");
  if (!upgradeHeader || upgradeHeader !== "websocket") {
    return new Response("Expected Upgrade: websocket", { status: 426 });
  }

  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair);

  server.accept();
  server.addEventListener("message", (event) => {
    console.log("Received message from client:", event.data);
    server.send(
      JSON.stringify({ status: "processing", message: "Hello from server!" })
    );
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
});

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

// Astro APIRoute handler
export const ALL: APIRoute = ({ request, locals }) => {
  return app.fetch(request, { DB: locals.runtime.env.DB });
};

import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Define the target roles you are applying to
export const jobs = sqliteTable("jobs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  company: text("company").notNull(),
  description: text("description").notNull(),
  url: text("url"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});

// Define the specific resume versions used for the applications
export const resumes = sqliteTable("resumes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(), // e.g., "Frontend AI Engineer - 2026"
  content: text("content").notNull(), // Full markdown or text of the resume
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});

// Define the generated CrewAI Hiring Committee podcast episodes
export const episodes = sqliteTable("episodes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  jobId: text("job_id")
    .references(() => jobs.id, { onDelete: "cascade" })
    .notNull(),
  resumeId: text("resume_id").references(() => resumes.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(), // e.g., "Hiring Committee: OpenAI - UI Engineer"
  audioStorageKey: text("audio_storage_key"), // The exact Cloudflare R2 object key
  transcript: text("transcript"), // The raw text transcript of the podcast
  analysis: text("analysis", { mode: "json" }), // Structured JSON of the committee's pros/cons/red flags
  status: text("status", { enum: ["processing", "completed", "failed"] })
    .default("processing")
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
});

export const insertJobSchema = createInsertSchema(jobs);
export const selectJobSchema = createSelectSchema(jobs);

export const insertResumeSchema = createInsertSchema(resumes);
export const selectResumeSchema = createSelectSchema(resumes);

export const insertEpisodeSchema = createInsertSchema(episodes);
export const selectEpisodeSchema = createSelectSchema(episodes);

import { sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  primaryKey,
  text,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import type { AdapterAccount } from "next-auth/adapters";

import { createTable } from "./table-creator";

/* -----------------------------------------------------------------------------------------------
 * Auth tables
 * NOTE: auth tables are common to mutiple projects, remember to remove `table filters` before
 * performing any operations
 * -----------------------------------------------------------------------------------------------*/

export const users = sqliteTable("user", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  email: text("email").notNull().unique(),
  username: text("username").unique(),
  password: text("password"),
  emailVerified: integer("emailVerified", { mode: "timestamp" }),
  image: text("image"),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: integer("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

/* -----------------------------------------------------------------------------------------------
 * App tables
 * -----------------------------------------------------------------------------------------------*/

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type MyPlaylist = typeof myPlaylists.$inferSelect;
export type NewPlaylist = typeof myPlaylists.$inferInsert;
export type Favorite = typeof favorites.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;

export const myPlaylists = createTable("playlist", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  userId: integer("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  songs: text("songs", { mode: "json" }).$type<string[]>().default([]).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).$defaultFn(() => new Date()).notNull(),
});

export const favorites = createTable("favorite", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  songs: text("songs", { mode: "json" }).$type<string[]>().default([]).notNull(),
  albums: text("albums", { mode: "json" }).$type<string[]>().default([]).notNull(),
  playlists: text("playlists", { mode: "json" }).$type<string[]>().default([]).notNull(),
  artists: text("artists", { mode: "json" }).$type<string[]>().default([]).notNull(),
  podcasts: text("podcasts", { mode: "json" }).$type<string[]>().default([]).notNull(),
});

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

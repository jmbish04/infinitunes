import {
  integer,
  sqliteTable,
  primaryKey,
  text,
} from "drizzle-orm/sqlite-core";

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

/* -----------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type MyPlaylist = typeof myPlaylists.$inferSelect;
export type NewPlaylist = typeof myPlaylists.$inferInsert;

export type Favorite = typeof favorites.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;

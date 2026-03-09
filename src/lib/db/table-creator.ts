import { sqliteTableCreator } from "drizzle-orm/sqlite-core";

import { siteConfig } from "@/config/site";

/**
 * Use to keep multiple projects schemas/tables in the same database.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator(
  (name) => `${siteConfig.name.toLowerCase().replace(/\s/g, "_")}_${name}`
);

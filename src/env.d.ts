/**
 * @fileoverview Module providing functionality for env.d.ts
 *
 * @module env.d
 *
 * @dependencies
 *   - @astrojs/cloudflare
 *
 * @cloudflare-bindings
 *   - D1 (SQL database)
 */

/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { Runtime } from "@astrojs/cloudflare";

declare namespace App {
  /**
   * Interface Locals.
   */
  interface Locals extends Runtime {}
}

/**
 * Interface Env.
 */
export interface Env {
  DB: D1Database;
}

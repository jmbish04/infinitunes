/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { D1Database } from "@cloudflare/workers-types";
import type { Runtime } from "@astrojs/cloudflare";

declare namespace App {
  interface Locals extends Runtime {}
}

export interface Env {
  DB: D1Database;
}

#!/usr/bin/env node

import { randomUUID } from "node:crypto";

process.stdout.write(
  JSON.stringify({
    "X-Plot-Agent-Session": randomUUID(),
  }),
);

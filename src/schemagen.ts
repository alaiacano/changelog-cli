#!/usr/bin/env node

import { jsonSchema } from "../src/types";

console.log(JSON.stringify(jsonSchema, null, 2));

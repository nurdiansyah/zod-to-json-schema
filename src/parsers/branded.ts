import { z } from "@deboxsoft/module-core";
import { parseDef } from "../parseDef.js";
import { Refs } from "../Refs.js";

export function parseBrandedDef(_def: z.ZodBrandedDef<any>, refs: Refs) {
  return parseDef(_def.type._def, refs);
}

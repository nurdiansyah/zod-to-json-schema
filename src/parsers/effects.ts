import { z } from "@deboxsoft/module-core";
import { parseDef } from "../parseDef.js";
import { JsonSchema7Type } from "../parseTypes.js";
import { Refs } from "../Refs.js";

export function parseEffectsDef(
  _def: z.ZodEffectsDef,
  refs: Refs,
): JsonSchema7Type | undefined {
  return refs.effectStrategy === "input"
    ? parseDef(_def.schema._def, refs)
    : {};
}

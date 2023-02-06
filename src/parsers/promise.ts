import { z } from "@deboxsoft/module-core";
import { JsonSchema7Type, parseDef } from "../parseDef";
import { Refs } from "../Refs";

export function parsePromiseDef(
  def: z.ZodPromiseDef,
  refs: Refs
): JsonSchema7Type | undefined {
  return parseDef(def.type._def, refs);
}

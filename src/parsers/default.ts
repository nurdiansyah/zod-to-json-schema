import { z } from "@deboxsoft/module-core";
import { parseDef } from "../parseDef.js";
import { JsonSchema7Type } from "../parseTypes.js";
import { Refs } from "../Refs.js";

export function parseDefaultDef(
  _def: z.ZodDefaultDef,
  refs: Refs,
): JsonSchema7Type & { default: any } {
  return {
    ...parseDef(_def.innerType._def, refs),
    default: _def.defaultValue(),
  };
}

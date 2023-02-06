import { z } from "@deboxsoft/module-core";
import { JsonSchema7Type, parseDef } from "../parseDef";
import { Refs } from "../Refs";

export function parseDefaultDef(
  _def: z.ZodDefaultDef,
  refs: Refs
): JsonSchema7Type & { default: any } {
  return {
    ...parseDef(_def.innerType._def, refs),
    default: _def.defaultValue(),
  };
}

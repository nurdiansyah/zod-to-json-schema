import { z } from "@deboxsoft/module-core";
import { parseDef } from "../parseDef.js";
import { JsonSchema7Type } from "../parseTypes.js";
import { Refs } from "../Refs.js";

export const parseOptionalDef = (
  def: z.ZodOptionalDef,
  refs: Refs,
): JsonSchema7Type | undefined => {
  if (refs.currentPath.toString() === refs.propertyPath?.toString()) {
    return parseDef(def.innerType._def, refs);
  }

  const innerSchema = parseDef(def.innerType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", "1"],
  });

  return innerSchema
    ? {
        anyOf: [
          {
            not: {},
          },
          innerSchema,
        ],
      }
    : {};
};

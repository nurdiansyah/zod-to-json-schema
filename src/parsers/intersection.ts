import { z } from "@deboxsoft/module-core";
import { JsonSchema7Type, parseDef } from "../parseDef";
import { Refs } from "../Refs";

export type JsonSchema7AllOfType = {
  allOf: JsonSchema7Type[];
};

export function parseIntersectionDef(
  def: z.ZodIntersectionDef,
  refs: Refs
): JsonSchema7AllOfType | JsonSchema7Type | undefined {
  const allOf = [
    parseDef(def.left._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "0"],
    }),
    parseDef(def.right._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "1"],
    }),
  ].filter((x): x is JsonSchema7Type => !!x);

  return allOf.length ? { allOf } : undefined;
}

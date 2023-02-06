import { z } from "@deboxsoft/module-core";
import { JsonSchema7Type, parseDef } from "../parseDef";
import { Refs } from "../Refs";

export type JsonSchema7MapType = {
  type: "array";
  maxItems: 125;
  items: {
    type: "array";
    items: [JsonSchema7Type, JsonSchema7Type];
    minItems: 2;
    maxItems: 2;
  };
};

export function parseMapDef(def: z.ZodMapDef, refs: Refs): JsonSchema7MapType {
  const keys =
    parseDef(def.keyType._def, {
      ...refs,
      currentPath: [...refs.currentPath, "items", "items", "0"],
    }) || {};
  const values =
    parseDef(def.valueType._def, {
      ...refs,
      currentPath: [...refs.currentPath, "items", "items", "1"],
    }) || {};
  return {
    type: "array",
    maxItems: 125,
    items: {
      type: "array",
      items: [keys, values],
      minItems: 2,
      maxItems: 2,
    },
  };
}

import { z } from "@deboxsoft/module-core";
import { parseDef } from "../parseDef.js";
import { JsonSchema7Type } from "../parseTypes.js";
import { Refs } from "../Refs.js";
import { JsonSchema7RecordType, parseRecordDef } from "./record.js";

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

export function parseMapDef(
  def: z.ZodMapDef,
  refs: Refs,
): JsonSchema7MapType | JsonSchema7RecordType {
  if (refs.mapStrategy === "record") {
    return parseRecordDef(def, refs);
  }

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

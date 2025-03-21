import { z } from "@deboxsoft/module-core";

export type JsonSchema7EnumType = {
  type: "string";
  enum: string[];
};

export function parseEnumDef(def: z.ZodEnumDef): JsonSchema7EnumType {
  return {
    type: "string",
    enum: Array.from(def.values),
  };
}

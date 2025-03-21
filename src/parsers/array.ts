import { z } from "@deboxsoft/module-core";
import { ErrorMessages, setResponseValueAndErrors } from "../errorMessages.js";
import { parseDef } from "../parseDef.js";
import { Refs } from "../Refs.js";
import { JsonSchema7Type } from "../parseTypes.js";

export type JsonSchema7ArrayType = {
  type: "array";
  items?: JsonSchema7Type;
  minItems?: number;
  maxItems?: number;
  errorMessages?: ErrorMessages<JsonSchema7ArrayType, "items">;
};

export function parseArrayDef(def: z.ZodArrayDef, refs: Refs) {
  const res: JsonSchema7ArrayType = {
    type: "array",
  };
  if (def.type?._def?.typeName !== z.ZodFirstPartyTypeKind.ZodAny) {
    res.items = parseDef(def.type._def, {
      ...refs,
      currentPath: [...refs.currentPath, "items"],
    });
  }
  if (def.minLength) {
    setResponseValueAndErrors(
      res,
      "minItems",
      def.minLength.value,
      def.minLength.message,
      refs
    );
  }
  if (def.maxLength) {
    setResponseValueAndErrors(
      res,
      "maxItems",
      def.maxLength.value,
      def.maxLength.message,
      refs
    );
  }

  return res;
}

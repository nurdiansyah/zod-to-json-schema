import { z } from "@deboxsoft/module-core";
import { parseDef } from "../parseDef.js";
import { Refs } from "../Refs.js";

export const parseReadonlyDef = (def: z.ZodReadonlyDef<any>, refs: Refs) => {
  return parseDef(def.innerType._def, refs);
};

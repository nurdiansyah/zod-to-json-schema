import { z } from "@deboxsoft/module-core";
import { parseDef } from "../parseDef.js";
import { Refs } from "../Refs.js";

export const parseCatchDef = (def: z.ZodCatchDef<any>, refs: Refs) => {
  return parseDef(def.innerType._def, refs);
};

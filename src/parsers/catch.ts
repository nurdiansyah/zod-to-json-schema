import { z } from "@deboxsoft/module-core";
import { parseDef } from "../parseDef";
import { Refs } from "../Refs";

export const parseCatchDef = (def: z.ZodCatchDef<any>, refs: Refs) => {
  return parseDef(def.innerType._def, refs);
};

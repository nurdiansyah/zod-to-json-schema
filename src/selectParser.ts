import { z } from "@deboxsoft/module-core";
import { parseAnyDef } from "./parsers/any.js";
import { parseArrayDef } from "./parsers/array.js";
import { parseBigintDef } from "./parsers/bigint.js";
import { parseBooleanDef } from "./parsers/boolean.js";
import { parseBrandedDef } from "./parsers/branded.js";
import { parseCatchDef } from "./parsers/catch.js";
import { parseDateDef } from "./parsers/date.js";
import { parseDefaultDef } from "./parsers/default.js";
import { parseEffectsDef } from "./parsers/effects.js";
import { parseEnumDef } from "./parsers/enum.js";
import { parseIntersectionDef } from "./parsers/intersection.js";
import { parseLiteralDef } from "./parsers/literal.js";
import { parseMapDef } from "./parsers/map.js";
import { parseNativeEnumDef } from "./parsers/nativeEnum.js";
import { parseNeverDef } from "./parsers/never.js";
import { parseNullDef } from "./parsers/null.js";
import { parseNullableDef } from "./parsers/nullable.js";
import { parseNumberDef } from "./parsers/number.js";
import { parseObjectDef } from "./parsers/object.js";
import { parseOptionalDef } from "./parsers/optional.js";
import { parsePipelineDef } from "./parsers/pipeline.js";
import { parsePromiseDef } from "./parsers/promise.js";
import { parseRecordDef } from "./parsers/record.js";
import { parseSetDef } from "./parsers/set.js";
import { parseStringDef } from "./parsers/string.js";
import { parseTupleDef } from "./parsers/tuple.js";
import { parseUndefinedDef } from "./parsers/undefined.js";
import { parseUnionDef } from "./parsers/union.js";
import { parseUnknownDef } from "./parsers/unknown.js";
import { Refs } from "./Refs.js";
import { parseReadonlyDef } from "./parsers/readonly.js";
import { JsonSchema7Type } from "./parseTypes.js";

export type InnerDefGetter = () => any;

export const selectParser = (
  def: any,
  typeName: z.ZodFirstPartyTypeKind,
  refs: Refs,
): JsonSchema7Type | undefined | InnerDefGetter => {
  switch (typeName) {
    case z.ZodFirstPartyTypeKind.ZodString:
      return parseStringDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodNumber:
      return parseNumberDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodObject:
      return parseObjectDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodBigInt:
      return parseBigintDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodBoolean:
      return parseBooleanDef();
    case z.ZodFirstPartyTypeKind.ZodDate:
      return parseDateDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodUndefined:
      return parseUndefinedDef();
    case z.ZodFirstPartyTypeKind.ZodNull:
      return parseNullDef(refs);
    case z.ZodFirstPartyTypeKind.ZodArray:
      return parseArrayDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodUnion:
    case z.ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
      return parseUnionDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodIntersection:
      return parseIntersectionDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodTuple:
      return parseTupleDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodRecord:
      return parseRecordDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodLiteral:
      return parseLiteralDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodEnum:
      return parseEnumDef(def);
    case z.ZodFirstPartyTypeKind.ZodNativeEnum:
      return parseNativeEnumDef(def);
    case z.ZodFirstPartyTypeKind.ZodNullable:
      return parseNullableDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodOptional:
      return parseOptionalDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodMap:
      return parseMapDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodSet:
      return parseSetDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodLazy:
      return () => (def as any).getter()._def;
    case z.ZodFirstPartyTypeKind.ZodPromise:
      return parsePromiseDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodNaN:
    case z.ZodFirstPartyTypeKind.ZodNever:
      return parseNeverDef();
    case z.ZodFirstPartyTypeKind.ZodEffects:
      return parseEffectsDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodAny:
      return parseAnyDef();
    case z.ZodFirstPartyTypeKind.ZodUnknown:
      return parseUnknownDef();
    case z.ZodFirstPartyTypeKind.ZodDefault:
      return parseDefaultDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodBranded:
      return parseBrandedDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodReadonly:
      return parseReadonlyDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodCatch:
      return parseCatchDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodPipeline:
      return parsePipelineDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodFunction:
    case z.ZodFirstPartyTypeKind.ZodVoid:
    case z.ZodFirstPartyTypeKind.ZodSymbol:
      return undefined;
    default:
      /* c8 ignore next */
      return ((_: never) => undefined)(typeName);
  }
};

import { z } from "@deboxsoft/module-core";
import { JsonSchema7AnyType, parseAnyDef } from "./parsers/any";
import { JsonSchema7ArrayType, parseArrayDef } from "./parsers/array";
import { JsonSchema7BigintType, parseBigintDef } from "./parsers/bigint";
import { JsonSchema7BooleanType, parseBooleanDef } from "./parsers/boolean";
import { parseBrandedDef } from "./parsers/branded";
import { parseCatchDef } from "./parsers/catch";
import { JsonSchema7DateType, parseDateDef } from "./parsers/date";
import { parseDefaultDef } from "./parsers/default";
import { parseEffectsDef } from "./parsers/effects";
import { JsonSchema7EnumType, parseEnumDef } from "./parsers/enum";
import {
  JsonSchema7AllOfType,
  parseIntersectionDef,
} from "./parsers/intersection";
import { JsonSchema7LiteralType, parseLiteralDef } from "./parsers/literal";
import { JsonSchema7MapType, parseMapDef } from "./parsers/map";
import {
  JsonSchema7NativeEnumType,
  parseNativeEnumDef,
} from "./parsers/nativeEnum";
import { JsonSchema7NeverType, parseNeverDef } from "./parsers/never";
import { JsonSchema7NullType, parseNullDef } from "./parsers/null";
import { JsonSchema7NullableType, parseNullableDef } from "./parsers/nullable";
import { JsonSchema7NumberType, parseNumberDef } from "./parsers/number";
import { JsonSchema7ObjectType, parseObjectDef } from "./parsers/object";
import { parseOptionalDef } from "./parsers/optional";
import { parsePipelineDef } from "./parsers/pipeline";
import { parsePromiseDef } from "./parsers/promise";
import { JsonSchema7RecordType, parseRecordDef } from "./parsers/record";
import { JsonSchema7SetType, parseSetDef } from "./parsers/set";
import { JsonSchema7StringType, parseStringDef } from "./parsers/string";
import { JsonSchema7TupleType, parseTupleDef } from "./parsers/tuple";
import {
  JsonSchema7UndefinedType,
  parseUndefinedDef,
} from "./parsers/undefined";
import { JsonSchema7UnionType, parseUnionDef } from "./parsers/union";
import { JsonSchema7UnknownType, parseUnknownDef } from "./parsers/unknown";
import { Refs, Seen } from "./Refs";

type JsonSchema7RefType = { $ref: string };
type JsonSchema7Meta = { default?: any; description?: string };

export type JsonSchema7TypeUnion =
  | JsonSchema7StringType
  | JsonSchema7ArrayType
  | JsonSchema7NumberType
  | JsonSchema7BigintType
  | JsonSchema7BooleanType
  | JsonSchema7DateType
  | JsonSchema7EnumType
  | JsonSchema7LiteralType
  | JsonSchema7NativeEnumType
  | JsonSchema7NullType
  | JsonSchema7NumberType
  | JsonSchema7ObjectType
  | JsonSchema7RecordType
  | JsonSchema7TupleType
  | JsonSchema7UnionType
  | JsonSchema7UndefinedType
  | JsonSchema7RefType
  | JsonSchema7NeverType
  | JsonSchema7MapType
  | JsonSchema7AnyType
  | JsonSchema7NullableType
  | JsonSchema7AllOfType
  | JsonSchema7UnknownType
  | JsonSchema7SetType;

export type JsonSchema7Type = JsonSchema7TypeUnion & JsonSchema7Meta;

export function parseDef(
  def: z.ZodTypeDef,
  refs: Refs
): JsonSchema7Type | undefined {
  const seenItem = refs.seen.find((x) => Object.is(x.def, def));

  if (seenItem) {
    return get$ref(seenItem, refs);
  }

  const newItem: Seen = { def, path: refs.currentPath, jsonSchema: undefined };

  refs.seen.push(newItem);

  const jsonSchema = selectParser(def, (def as any).typeName, refs);

  if (jsonSchema) {
    addMeta(def, jsonSchema);
  }

  newItem.jsonSchema = jsonSchema;

  return jsonSchema;
}

const get$ref = (
  item: Seen,
  refs: Refs
):
  | {
      $ref: string;
    }
  | {}
  | undefined => {
  switch (refs.$refStrategy) {
    case "root":
      return {
        $ref:
          item.path.length === 0
            ? ""
            : item.path.length === 1
            ? `${item.path[0]}/`
            : item.path.join("/"),
      };
    case "relative":
      return { $ref: getRelativePath(refs.currentPath, item.path) };
    case "none": {
      if (
        item.path.length < refs.currentPath.length &&
        item.path.every((value, index) => refs.currentPath[index] === value)
      ) {
        console.warn(
          `Recursive reference detected at ${refs.currentPath.join(
            "/"
          )}! Defaulting to any`
        );
        return {};
      } else {
        return item.jsonSchema;
      }
    }
  }
};

const getRelativePath = (pathA: string[], pathB: string[]) => {
  let i = 0;
  for (; i < pathA.length && i < pathB.length; i++) {
    if (pathA[i] !== pathB[i]) break;
  }
  return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
};

const selectParser = (
  def: any,
  typeName: z.ZodFirstPartyTypeKind,
  refs: Refs
): JsonSchema7Type | undefined => {
  switch (typeName) {
    case z.ZodFirstPartyTypeKind.ZodString:
      return parseStringDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodNumber:
      return parseNumberDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodObject:
      return parseObjectDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodBigInt:
      return parseBigintDef();
    case z.ZodFirstPartyTypeKind.ZodBoolean:
      return parseBooleanDef();
    case z.ZodFirstPartyTypeKind.ZodDate:
      return parseDateDef();
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
      return parseDef(def.getter()._def, refs);
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
    case z.ZodFirstPartyTypeKind.ZodCatch:
      return parseCatchDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodPipeline:
      return parsePipelineDef(def, refs);
    case z.ZodFirstPartyTypeKind.ZodFunction:
    case z.ZodFirstPartyTypeKind.ZodVoid:
    case z.ZodFirstPartyTypeKind.ZodSymbol:
      return undefined;
    default:
      return ((_: never) => undefined)(typeName);
  }
};

const addMeta = (
  def: z.ZodTypeDef,
  jsonSchema: JsonSchema7Type
): JsonSchema7Type => {
  if (def.description) jsonSchema.description = def.description;
  return jsonSchema;
};

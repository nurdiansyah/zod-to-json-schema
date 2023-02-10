import { z } from '@deboxsoft/module-core';

/**
 * Primitive type
 * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1.1
 */
type JSONSchema7Type =
    | string //
    | number
    | boolean
    | JSONSchema7Object
    | JSONSchema7Array
    | null;

// Workaround for infinite type recursion
interface JSONSchema7Object {
    [key: string]: JSONSchema7Type;
}

// Workaround for infinite type recursion
// https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
interface JSONSchema7Array extends Array<JSONSchema7Type> {}

type Options<Target extends "jsonSchema7" | "openApi3" = "jsonSchema7"> = {
    name: string | undefined;
    $refStrategy: "root" | "relative" | "none";
    basePath: string[];
    effectStrategy: "input" | "any";
    target: Target;
    strictUnions: boolean;
    definitionPath: string;
    definitions: Record<string, z.ZodSchema>;
    errorMessages: boolean;
};

type JsonSchema7AnyType = {};

type ErrorMessages<T extends JsonSchema7TypeUnion, OmitProperties extends string = ""> = Partial<Omit<{
    [key in keyof T]: string;
}, OmitProperties | "type" | "errorMessages">>;

type JsonSchema7ArrayType = {
    type: "array";
    items?: JsonSchema7Type;
    minItems?: number;
    maxItems?: number;
    errorMessages?: ErrorMessages<JsonSchema7ArrayType, "items">;
};

type JsonSchema7BigintType = {
    type: "integer";
    format: "int64";
};

type JsonSchema7BooleanType = {
    type: "boolean";
};

type JsonSchema7DateType = {
    type: "string";
    format: "date-time";
};

type JsonSchema7EnumType = {
    type: "string";
    enum: string[];
};

type JsonSchema7AllOfType = {
    allOf: JsonSchema7Type[];
};

type JsonSchema7LiteralType = {
    type: "string" | "number" | "integer" | "boolean";
    const: string | number | boolean;
} | {
    type: "object" | "array";
};

type JsonSchema7MapType = {
    type: "array";
    maxItems: 125;
    items: {
        type: "array";
        items: [JsonSchema7Type, JsonSchema7Type];
        minItems: 2;
        maxItems: 2;
    };
};

type JsonSchema7NativeEnumType = {
    type: "string" | "number" | ["string", "number"];
    enum: (string | number)[];
};

type JsonSchema7NeverType = {
    not: {};
};

type JsonSchema7NullType = {
    type: "null";
};

type JsonSchema7NullableType = {
    anyOf: [JsonSchema7Type, JsonSchema7NullType];
} | {
    type: [string, "null"];
};

type JsonSchema7NumberType = {
    type: "number" | "integer";
    minimum?: number;
    exclusiveMinimum?: number;
    maximum?: number;
    exclusiveMaximum?: number;
    multipleOf?: number;
    errorMessage?: ErrorMessages<JsonSchema7NumberType>;
};

type JsonSchema7ObjectType = {
    type: "object";
    properties: Record<string, JsonSchema7Type>;
    additionalProperties: boolean | JsonSchema7Type;
    required?: string[];
};

type JsonSchema7StringType = {
    type: "string";
    minLength?: number;
    maxLength?: number;
    format?: "email" | "uri" | "uuid" | "date-time";
    pattern?: string;
    allOf?: {
        pattern: string;
        errorMessage?: ErrorMessages<{
            pattern: string;
        }>;
    }[];
    errorMessage?: ErrorMessages<JsonSchema7StringType>;
};

type JsonSchema7RecordPropertyNamesType = Omit<JsonSchema7StringType, "type"> | Omit<JsonSchema7EnumType, "type">;
type JsonSchema7RecordType = {
    type: "object";
    additionalProperties: JsonSchema7Type;
    propertyNames?: JsonSchema7RecordPropertyNamesType;
};

type JsonSchema7SetType = {
    type: "array";
    items?: JsonSchema7Type;
    minItems?: number;
    maxItems?: number;
    errorMessage?: ErrorMessages<JsonSchema7SetType>;
};

type JsonSchema7TupleType = {
    type: "array";
    minItems: number;
    items: JsonSchema7Type[];
} & ({
    maxItems: number;
} | {
    additionalItems?: JsonSchema7Type;
});

type JsonSchema7UndefinedType = {
    not: {};
};

declare const primitiveMappings: {
    readonly ZodString: "string";
    readonly ZodNumber: "number";
    readonly ZodBigInt: "integer";
    readonly ZodBoolean: "boolean";
    readonly ZodNull: "null";
};
type JsonSchema7Primitive = typeof primitiveMappings[keyof typeof primitiveMappings];
type JsonSchema7UnionType = JsonSchema7PrimitiveUnionType | JsonSchema7AnyOfType;
type JsonSchema7PrimitiveUnionType = {
    type: JsonSchema7Primitive | JsonSchema7Primitive[];
} | {
    type: JsonSchema7Primitive | JsonSchema7Primitive[];
    enum: (string | number | bigint | boolean | null)[];
};
type JsonSchema7AnyOfType = {
    anyOf: JsonSchema7Type[];
};

type JsonSchema7UnknownType = {};

type JsonSchema7RefType = {
    $ref: string;
};
type JsonSchema7Meta = {
    default?: any;
    description?: string;
};
type JsonSchema7TypeUnion = JsonSchema7StringType | JsonSchema7ArrayType | JsonSchema7NumberType | JsonSchema7BigintType | JsonSchema7BooleanType | JsonSchema7DateType | JsonSchema7EnumType | JsonSchema7LiteralType | JsonSchema7NativeEnumType | JsonSchema7NullType | JsonSchema7NumberType | JsonSchema7ObjectType | JsonSchema7RecordType | JsonSchema7TupleType | JsonSchema7UnionType | JsonSchema7UndefinedType | JsonSchema7RefType | JsonSchema7NeverType | JsonSchema7MapType | JsonSchema7AnyType | JsonSchema7NullableType | JsonSchema7AllOfType | JsonSchema7UnknownType | JsonSchema7SetType;
type JsonSchema7Type = JsonSchema7TypeUnion & JsonSchema7Meta;

declare const zodToJsonSchema: <Target extends "jsonSchema7" | "openApi3" = "jsonSchema7">(schema: z.ZodSchema<any>, options?: string | Partial<Options<Target>> | undefined) => (Target extends "jsonSchema7" ? JsonSchema7Type : object) & {
    $schema?: string | undefined;
    definitions?: {
        [key: string]: Target extends "jsonSchema7" ? JSONSchema7Type : object;
    } | undefined;
};

export { zodToJsonSchema };

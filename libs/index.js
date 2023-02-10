import { zod, z } from '@deboxsoft/module-core';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// src/parsers/any.ts
function parseAnyDef() {
  return {};
}

// src/errorMessages.ts
function addErrorMessage(res, key, errorMessage, refs) {
  if (!(refs == null ? void 0 : refs.errorMessages))
    return;
  if (errorMessage) {
    res.errorMessage = __spreadProps(__spreadValues({}, res.errorMessage), {
      [key]: errorMessage
    });
  }
}
function setResponseValueAndErrors(res, key, value, errorMessage, refs) {
  res[key] = value;
  addErrorMessage(res, key, errorMessage, refs);
}

// src/parsers/array.ts
function parseArrayDef(def, refs) {
  var _a, _b;
  const res = {
    type: "array"
  };
  if (((_b = (_a = def.type) == null ? void 0 : _a._def) == null ? void 0 : _b.typeName) !== z.ZodFirstPartyTypeKind.ZodAny) {
    res.items = parseDef(def.type._def, __spreadProps(__spreadValues({}, refs), {
      currentPath: [...refs.currentPath, "items"]
    }));
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

// src/parsers/bigint.ts
function parseBigintDef() {
  return {
    type: "integer",
    format: "int64"
  };
}

// src/parsers/boolean.ts
function parseBooleanDef() {
  return {
    type: "boolean"
  };
}

// src/parsers/branded.ts
function parseBrandedDef(_def, refs) {
  return parseDef(_def.type._def, refs);
}

// src/parsers/catch.ts
var parseCatchDef = (def, refs) => {
  return parseDef(def.innerType._def, refs);
};

// src/parsers/date.ts
function parseDateDef() {
  return {
    type: "string",
    format: "date-time"
  };
}

// src/parsers/default.ts
function parseDefaultDef(_def, refs) {
  return __spreadProps(__spreadValues({}, parseDef(_def.innerType._def, refs)), {
    default: _def.defaultValue()
  });
}

// src/parsers/effects.ts
function parseEffectsDef(_def, refs) {
  return refs.effectStrategy === "input" ? parseDef(_def.schema._def, refs) : {};
}

// src/parsers/enum.ts
function parseEnumDef(def) {
  return {
    type: "string",
    enum: def.values
  };
}

// src/parsers/intersection.ts
function parseIntersectionDef(def, refs) {
  const allOf = [
    parseDef(def.left._def, __spreadProps(__spreadValues({}, refs), {
      currentPath: [...refs.currentPath, "allOf", "0"]
    })),
    parseDef(def.right._def, __spreadProps(__spreadValues({}, refs), {
      currentPath: [...refs.currentPath, "allOf", "1"]
    }))
  ].filter((x) => !!x);
  return allOf.length ? { allOf } : void 0;
}

// src/parsers/literal.ts
function parseLiteralDef(def, refs) {
  const parsedType = typeof def.value;
  if (parsedType !== "bigint" && parsedType !== "number" && parsedType !== "boolean" && parsedType !== "string") {
    return {
      type: Array.isArray(def.value) ? "array" : "object"
    };
  }
  if (refs.target === "openApi3") {
    return {
      type: parsedType === "bigint" ? "integer" : parsedType,
      enum: [def.value]
    };
  }
  return {
    type: parsedType === "bigint" ? "integer" : parsedType,
    const: def.value
  };
}

// src/parsers/map.ts
function parseMapDef(def, refs) {
  const keys = parseDef(def.keyType._def, __spreadProps(__spreadValues({}, refs), {
    currentPath: [...refs.currentPath, "items", "items", "0"]
  })) || {};
  const values = parseDef(def.valueType._def, __spreadProps(__spreadValues({}, refs), {
    currentPath: [...refs.currentPath, "items", "items", "1"]
  })) || {};
  return {
    type: "array",
    maxItems: 125,
    items: {
      type: "array",
      items: [keys, values],
      minItems: 2,
      maxItems: 2
    }
  };
}

// src/parsers/nativeEnum.ts
function parseNativeEnumDef(def) {
  const object = def.values;
  const actualKeys = Object.keys(def.values).filter((key) => {
    return typeof object[object[key]] !== "number";
  });
  const actualValues = actualKeys.map((key) => object[key]);
  const parsedTypes = Array.from(new Set(actualValues.map((values) => typeof values)));
  return {
    type: parsedTypes.length === 1 ? parsedTypes[0] === "string" ? "string" : "number" : ["string", "number"],
    enum: actualValues
  };
}

// src/parsers/never.ts
function parseNeverDef() {
  return {
    not: {}
  };
}

// src/parsers/null.ts
function parseNullDef(refs) {
  return refs.target === "openApi3" ? {
    enum: ["null"],
    nullable: true
  } : {
    type: "null"
  };
}

// src/parsers/union.ts
var primitiveMappings = {
  ZodString: "string",
  ZodNumber: "number",
  ZodBigInt: "integer",
  ZodBoolean: "boolean",
  ZodNull: "null"
};
function parseUnionDef(def, refs) {
  if (refs.target === "openApi3")
    return asAnyOf(def, refs);
  const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
  if (options.every(
    (x) => x._def.typeName in primitiveMappings && (!x._def.checks || !x._def.checks.length)
  )) {
    const types = options.reduce((types2, x) => {
      const type = primitiveMappings[x._def.typeName];
      return type && !types2.includes(type) ? [...types2, type] : types2;
    }, []);
    return {
      type: types.length > 1 ? types : types[0]
    };
  } else if (options.every((x) => x._def.typeName === "ZodLiteral")) {
    const types = options.reduce(
      (acc, x) => {
        const type = typeof x._def.value;
        switch (type) {
          case "string":
          case "number":
          case "boolean":
            return [...acc, type];
          case "bigint":
            return [...acc, "integer"];
          case "object":
            if (x._def.value === null)
              return [...acc, "null"];
          case "symbol":
          case "undefined":
          case "function":
          default:
            return acc;
        }
      },
      []
    );
    if (types.length === options.length) {
      const uniqueTypes = types.filter((x, i, a) => a.indexOf(x) === i);
      return {
        type: uniqueTypes.length > 1 ? uniqueTypes : uniqueTypes[0],
        enum: options.reduce((acc, x) => {
          return acc.includes(x._def.value) ? acc : [...acc, x._def.value];
        }, [])
      };
    }
  } else if (options.every((x) => x._def.typeName === "ZodEnum")) {
    return {
      type: "string",
      enum: options.reduce(
        (acc, x) => [
          ...acc,
          ...x._def.values.filter((x2) => !acc.includes(x2))
        ],
        []
      )
    };
  }
  return asAnyOf(def, refs);
}
var asAnyOf = (def, refs) => {
  const anyOf = (def.options instanceof Map ? Array.from(def.options.values()) : def.options).map(
    (x, i) => parseDef(x._def, __spreadProps(__spreadValues({}, refs), {
      currentPath: [...refs.currentPath, "anyOf", `${i}`]
    }))
  ).filter(
    (x) => !!x && (!refs.strictUnions || typeof x === "object" && Object.keys(x).length > 0)
  );
  return anyOf.length ? { anyOf } : void 0;
};

// src/parsers/nullable.ts
function parseNullableDef(def, refs) {
  if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(
    def.innerType._def.typeName
  ) && (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
    if (refs.target === "openApi3") {
      return {
        type: primitiveMappings[def.innerType._def.typeName],
        nullable: true
      };
    }
    return {
      type: [
        primitiveMappings[def.innerType._def.typeName],
        "null"
      ]
    };
  }
  const type = parseDef(def.innerType._def, __spreadProps(__spreadValues({}, refs), {
    currentPath: [...refs.currentPath, "anyOf", "0"]
  }));
  return type ? refs.target === "openApi3" ? __spreadProps(__spreadValues({}, type), { nullable: true }) : {
    anyOf: [
      type,
      {
        type: "null"
      }
    ]
  } : void 0;
}

// src/parsers/number.ts
function parseNumberDef(def, refs) {
  const res = {
    type: "number"
  };
  if (!def.checks)
    return res;
  for (const check of def.checks) {
    switch (check.kind) {
      case "int":
        res.type = "integer";
        addErrorMessage(res, "type", check.message, refs);
        break;
      case "min":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(
              res,
              "minimum",
              check.value,
              check.message,
              refs
            );
          } else {
            setResponseValueAndErrors(
              res,
              "exclusiveMinimum",
              check.value,
              check.message,
              refs
            );
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMinimum = true;
          }
          setResponseValueAndErrors(
            res,
            "minimum",
            check.value,
            check.message,
            refs
          );
        }
        break;
      case "max":
        if (refs.target === "jsonSchema7") {
          if (check.inclusive) {
            setResponseValueAndErrors(
              res,
              "maximum",
              check.value,
              check.message,
              refs
            );
          } else {
            setResponseValueAndErrors(
              res,
              "exclusiveMaximum",
              check.value,
              check.message,
              refs
            );
          }
        } else {
          if (!check.inclusive) {
            res.exclusiveMaximum = true;
          }
          setResponseValueAndErrors(
            res,
            "maximum",
            check.value,
            check.message,
            refs
          );
        }
        break;
      case "multipleOf":
        setResponseValueAndErrors(
          res,
          "multipleOf",
          check.value,
          check.message,
          refs
        );
        break;
    }
  }
  return res;
}

// src/parsers/object.ts
function parseObjectDef(def, refs) {
  var _a;
  const result = __spreadProps(__spreadValues({
    type: "object"
  }, Object.entries(def.shape()).reduce(
    (acc, [propName, propDef]) => {
      if (propDef === void 0 || propDef._def === void 0)
        return acc;
      const parsedDef = parseDef(propDef._def, __spreadProps(__spreadValues({}, refs), {
        currentPath: [...refs.currentPath, "properties", propName],
        propertyPath: [...refs.currentPath, "properties", propName]
      }));
      if (parsedDef === void 0)
        return acc;
      return {
        properties: __spreadProps(__spreadValues({}, acc.properties), { [propName]: parsedDef }),
        required: propDef.isOptional() ? acc.required : [...acc.required, propName]
      };
    },
    { properties: {}, required: [] }
  )), {
    additionalProperties: def.catchall._def.typeName === "ZodNever" ? def.unknownKeys === "passthrough" : (_a = parseDef(def.catchall._def, __spreadProps(__spreadValues({}, refs), {
      currentPath: [...refs.currentPath, "additionalProperties"]
    }))) != null ? _a : true
  });
  if (!result.required.length)
    delete result.required;
  return result;
}

// src/parsers/optional.ts
var parseOptionalDef = (def, refs) => {
  var _a;
  if (refs.currentPath.toString() === ((_a = refs.propertyPath) == null ? void 0 : _a.toString())) {
    return parseDef(def.innerType._def, refs);
  }
  const innerSchema = parseDef(def.innerType._def, __spreadProps(__spreadValues({}, refs), {
    currentPath: [...refs.currentPath, "anyOf", "1"]
  }));
  return innerSchema ? {
    anyOf: [
      {
        not: {}
      },
      innerSchema
    ]
  } : {};
};

// src/parsers/pipeline.ts
var parsePipelineDef = (def, refs) => {
  const a = parseDef(def.in._def, __spreadProps(__spreadValues({}, refs), {
    currentPath: [...refs.currentPath, "allOf", "0"]
  }));
  const b = parseDef(def.out._def, __spreadProps(__spreadValues({}, refs), {
    currentPath: [...refs.currentPath, "allOf", a ? "1" : "0"]
  }));
  return {
    allOf: [a, b].filter((x) => x !== void 0)
  };
};

// src/parsers/promise.ts
function parsePromiseDef(def, refs) {
  return parseDef(def.type._def, refs);
}

// src/parsers/string.ts
function parseStringDef(def, refs) {
  const res = {
    type: "string"
  };
  if (def.checks) {
    for (const check of def.checks) {
      switch (check.kind) {
        case "min":
          setResponseValueAndErrors(
            res,
            "minLength",
            typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value,
            check.message,
            refs
          );
          break;
        case "max":
          setResponseValueAndErrors(
            res,
            "maxLength",
            typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value,
            check.message,
            refs
          );
          break;
        case "email":
          setResponseValueAndErrors(
            res,
            "format",
            "email",
            check.message,
            refs
          );
          break;
        case "url":
          setResponseValueAndErrors(res, "format", "uri", check.message, refs);
          break;
        case "uuid":
          setResponseValueAndErrors(res, "format", "uuid", check.message, refs);
          break;
        case "regex":
          addPattern(res, check.regex.source, check.message, refs);
          break;
        case "cuid":
          addPattern(res, "^c[^\\s-]{8,}$", check.message, refs);
          break;
        case "startsWith":
          addPattern(
            res,
            "^" + escapeNonAlphaNumeric(check.value),
            check.message,
            refs
          );
          break;
        case "endsWith":
          addPattern(
            res,
            escapeNonAlphaNumeric(check.value) + "$",
            check.message,
            refs
          );
          break;
        case "trim":
          break;
        case "datetime":
          setResponseValueAndErrors(
            res,
            "format",
            "date-time",
            check.message,
            refs
          );
          break;
        case "length":
          setResponseValueAndErrors(
            res,
            "minLength",
            typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value,
            check.message,
            refs
          );
          setResponseValueAndErrors(
            res,
            "maxLength",
            typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value,
            check.message,
            refs
          );
          break;
      }
    }
  }
  return res;
}
var escapeNonAlphaNumeric = (value) => Array.from(value).map((c) => /[a-zA-Z0-9]/.test(c) ? c : `\\${c}`).join("");
var addPattern = (schema, value, message, refs) => {
  var _a;
  if (schema.pattern || ((_a = schema.allOf) == null ? void 0 : _a.some((x) => x.pattern))) {
    if (!schema.allOf) {
      schema.allOf = [];
    }
    if (schema.pattern) {
      schema.allOf.push(__spreadValues({
        pattern: schema.pattern
      }, schema.errorMessage && refs.errorMessages && {
        errorMessage: { pattern: schema.errorMessage.pattern }
      }));
      delete schema.pattern;
      if (schema.errorMessage) {
        delete schema.errorMessage.pattern;
        if (Object.keys(schema.errorMessage).length === 0) {
          delete schema.errorMessage;
        }
      }
    }
    schema.allOf.push(__spreadValues({
      pattern: value
    }, message && refs.errorMessages && { errorMessage: { pattern: message } }));
  } else {
    setResponseValueAndErrors(schema, "pattern", value, message, refs);
  }
};

// src/parsers/record.ts
function parseRecordDef(def, refs) {
  var _a, _b, _c;
  const schema = {
    type: "object",
    additionalProperties: parseDef(def.valueType._def, __spreadProps(__spreadValues({}, refs), {
      currentPath: [...refs.currentPath, "additionalProperties"]
    })) || {}
  };
  if (((_a = def.keyType) == null ? void 0 : _a._def.typeName) === z.ZodFirstPartyTypeKind.ZodString && ((_b = def.keyType._def.checks) == null ? void 0 : _b.length)) {
    const keyType = Object.entries(
      parseStringDef(def.keyType._def, refs)
    ).reduce(
      (acc, [key, value]) => key === "type" ? acc : __spreadProps(__spreadValues({}, acc), { [key]: value }),
      {}
    );
    return __spreadProps(__spreadValues({}, schema), {
      propertyNames: keyType
    });
  } else if (((_c = def.keyType) == null ? void 0 : _c._def.typeName) === z.ZodFirstPartyTypeKind.ZodEnum) {
    return __spreadProps(__spreadValues({}, schema), {
      propertyNames: {
        enum: def.keyType._def.values
      }
    });
  }
  return schema;
}

// src/parsers/set.ts
function parseSetDef(def, refs) {
  const items = parseDef(def.valueType._def, __spreadProps(__spreadValues({}, refs), {
    currentPath: [...refs.currentPath, "items"]
  }));
  const schema = {
    type: "array",
    items
  };
  if (def.minSize) {
    setResponseValueAndErrors(
      schema,
      "minItems",
      def.minSize.value,
      def.minSize.message,
      refs
    );
  }
  if (def.maxSize) {
    setResponseValueAndErrors(
      schema,
      "maxItems",
      def.maxSize.value,
      def.maxSize.message,
      refs
    );
  }
  return schema;
}

// src/parsers/tuple.ts
function parseTupleDef(def, refs) {
  if (def.rest) {
    return {
      type: "array",
      minItems: def.items.length,
      items: def.items.map(
        (x, i) => parseDef(x._def, __spreadProps(__spreadValues({}, refs), {
          currentPath: [...refs.currentPath, "items", `${i}`]
        }))
      ).reduce(
        (acc, x) => x === void 0 ? acc : [...acc, x],
        []
      ),
      additionalItems: parseDef(def.rest._def, __spreadProps(__spreadValues({}, refs), {
        currentPath: [...refs.currentPath, "additionalItems"]
      }))
    };
  } else {
    return {
      type: "array",
      minItems: def.items.length,
      maxItems: def.items.length,
      items: def.items.map(
        (x, i) => parseDef(x._def, __spreadProps(__spreadValues({}, refs), {
          currentPath: [...refs.currentPath, "items", `${i}`]
        }))
      ).reduce(
        (acc, x) => x === void 0 ? acc : [...acc, x],
        []
      )
    };
  }
}

// src/parsers/undefined.ts
function parseUndefinedDef() {
  return {
    not: {}
  };
}

// src/parsers/unknown.ts
function parseUnknownDef() {
  return {};
}

// src/parseDef.ts
function parseDef(def, refs) {
  const seenItem = refs.seen.find((x) => Object.is(x.def, def));
  if (seenItem) {
    return get$ref(seenItem, refs);
  }
  const newItem = { def, path: refs.currentPath, jsonSchema: void 0 };
  refs.seen.push(newItem);
  const jsonSchema = selectParser(def, def.typeName, refs);
  if (jsonSchema) {
    addMeta(def, jsonSchema);
  }
  newItem.jsonSchema = jsonSchema;
  return jsonSchema;
}
var get$ref = (item, refs) => {
  switch (refs.$refStrategy) {
    case "root":
      return {
        $ref: item.path.length === 0 ? "" : item.path.length === 1 ? `${item.path[0]}/` : item.path.join("/")
      };
    case "relative":
      return { $ref: getRelativePath(refs.currentPath, item.path) };
    case "none": {
      if (item.path.length < refs.currentPath.length && item.path.every((value, index) => refs.currentPath[index] === value)) {
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
var getRelativePath = (pathA, pathB) => {
  let i = 0;
  for (; i < pathA.length && i < pathB.length; i++) {
    if (pathA[i] !== pathB[i])
      break;
  }
  return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
};
var selectParser = (def, typeName, refs) => {
  switch (typeName) {
    case zod.ZodFirstPartyTypeKind.ZodString:
      return parseStringDef(def, refs);
    case zod.ZodFirstPartyTypeKind.ZodNumber:
      return parseNumberDef(def, refs);
    case zod.ZodFirstPartyTypeKind.ZodObject:
      return parseObjectDef(def, refs);
    case zod.ZodFirstPartyTypeKind.ZodBigInt:
      return parseBigintDef();
    case zod.ZodFirstPartyTypeKind.ZodBoolean:
      return parseBooleanDef();
    case zod.ZodFirstPartyTypeKind.ZodDate:
      return parseDateDef();
    case zod.ZodFirstPartyTypeKind.ZodUndefined:
      return parseUndefinedDef();
    case zod.ZodFirstPartyTypeKind.ZodNull:
      return parseNullDef(refs);
    case zod.ZodFirstPartyTypeKind.ZodArray:
      return parseArrayDef(def, refs);
    case zod.ZodFirstPartyTypeKind.ZodUnion:
    case zod.ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
      return parseUnionDef(def, refs);
    case zod.ZodFirstPartyTypeKind.ZodIntersection:
      return parseIntersectionDef(def, refs);
    case zod.ZodFirstPartyTypeKind.ZodTuple:
      return parseTupleDef(def, refs);
    case zod.ZodFirstPartyTypeKind.ZodRecord:
      return parseRecordDef(def, refs);
    case zod.ZodFirstPartyTypeKind.ZodLiteral:
      return parseLiteralDef(def, refs);
    case zod.ZodFirstPartyTypeKind.ZodEnum:
      return parseEnumDef(def);
    case zod.ZodFirstPartyTypeKind.ZodNativeEnum:
      return parseNativeEnumDef(def);
    case zod.ZodFirstPartyTypeKind.ZodNullable:
      return parseNullableDef(def, refs);
    case zod.ZodFirstPartyTypeKind.ZodOptional:
      return parseOptionalDef(def, refs);
    case zod.ZodFirstPartyTypeKind.ZodMap:
      return parseMapDef(def, refs);
    case zod.ZodFirstPartyTypeKind.ZodSet:
      return parseSetDef(def, refs);
    case zod.ZodFirstPartyTypeKind.ZodLazy:
      return parseDef(def.getter()._def, refs);
    case zod.ZodFirstPartyTypeKind.ZodPromise:
      return parsePromiseDef(def, refs);
    case zod.ZodFirstPartyTypeKind.ZodNaN:
    case zod.ZodFirstPartyTypeKind.ZodNever:
      return parseNeverDef();
    case zod.ZodFirstPartyTypeKind.ZodEffects:
      return parseEffectsDef(def, refs);
    case zod.ZodFirstPartyTypeKind.ZodAny:
      return parseAnyDef();
    case zod.ZodFirstPartyTypeKind.ZodUnknown:
      return parseUnknownDef();
    case zod.ZodFirstPartyTypeKind.ZodDefault:
      return parseDefaultDef(def, refs);
    case zod.ZodFirstPartyTypeKind.ZodBranded:
      return parseBrandedDef(def, refs);
    case zod.ZodFirstPartyTypeKind.ZodCatch:
      return parseCatchDef(def, refs);
    case zod.ZodFirstPartyTypeKind.ZodPipeline:
      return parsePipelineDef(def, refs);
    case zod.ZodFirstPartyTypeKind.ZodFunction:
    case zod.ZodFirstPartyTypeKind.ZodVoid:
    case zod.ZodFirstPartyTypeKind.ZodSymbol:
      return void 0;
    default:
      return ((_) => void 0)();
  }
};
var addMeta = (def, jsonSchema) => {
  if (def.description)
    jsonSchema.description = def.description;
  return jsonSchema;
};

// src/Options.ts
var defaultOptions = {
  name: void 0,
  $refStrategy: "root",
  basePath: ["#"],
  effectStrategy: "input",
  definitionPath: "definitions",
  target: "jsonSchema7",
  strictUnions: false,
  definitions: {},
  errorMessages: false
};
var getDefaultOptions = (options) => typeof options === "string" ? __spreadProps(__spreadValues({}, defaultOptions), {
  name: options
}) : __spreadValues(__spreadValues({}, defaultOptions), options);

// src/Refs.ts
var getRefs = (options) => {
  const _options = getDefaultOptions(options);
  const currentPath = _options.name !== void 0 ? [..._options.basePath, _options.definitionPath, _options.name] : _options.basePath;
  return __spreadProps(__spreadValues({}, _options), {
    currentPath,
    propertyPath: void 0,
    seen: []
  });
};

// src/zodToJsonSchema.ts
var zodToJsonSchema = (schema, options) => {
  var _a;
  const refs = getRefs(options);
  const definitions = typeof options === "object" && options.definitions ? Object.entries(options.definitions).reduce(
    (acc, [name2, schema2]) => {
      var _a2;
      return __spreadProps(__spreadValues({}, acc), {
        [name2]: (_a2 = parseDef(schema2._def, __spreadProps(__spreadValues({}, refs), {
          currentPath: [...refs.basePath, refs.definitionPath, name2]
        }))) != null ? _a2 : {}
      });
    },
    {}
  ) : void 0;
  const name = typeof options === "string" ? options : options == null ? void 0 : options.name;
  const main = (_a = parseDef(
    schema._def,
    name === void 0 ? refs : __spreadProps(__spreadValues({}, refs), {
      currentPath: [...refs.basePath, refs.definitionPath, name]
    })
  )) != null ? _a : {};
  const combined = name === void 0 ? definitions ? __spreadProps(__spreadValues({}, main), {
    [refs.definitionPath]: definitions
  }) : main : {
    $ref: [
      ...refs.$refStrategy === "relative" ? [] : refs.basePath,
      refs.definitionPath,
      name
    ].join("/"),
    [refs.definitionPath]: __spreadProps(__spreadValues({}, definitions), {
      [name]: main
    })
  };
  if (refs.target === "jsonSchema7") {
    combined.$schema = "http://json-schema.org/draft-07/schema#";
  }
  return combined;
};

export { zodToJsonSchema };

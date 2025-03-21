import { z } from "@deboxsoft/module-core";
import { Options, Targets } from "./Options.js";
import { parseDef } from "./parseDef.js";
import { JsonSchema7Type } from "./parseTypes.js";
import { getRefs } from "./Refs.js";

const zodToJsonSchema = <Target extends Targets = "jsonSchema7">(
  schema: z.ZodSchema<any>,
  options?: Partial<Options<Target>> | string,
): (Target extends "jsonSchema7" ? JsonSchema7Type : object) & {
  $schema?: string;
  definitions?: {
    [key: string]: Target extends "jsonSchema7"
      ? JsonSchema7Type
      : Target extends "jsonSchema2019-09"
        ? JsonSchema7Type
        : object;
  };
} => {
  const refs = getRefs(options);

  const definitions =
    typeof options === "object" && options.definitions
      ? Object.entries(options.definitions).reduce(
          (acc, [name, schema]) => ({
            ...acc,
            [name]:
              parseDef(
                schema._def,
                {
                  ...refs,
                  currentPath: [...refs.basePath, refs.definitionPath, name],
                },
                true,
              ) ?? {},
          }),
          {},
        )
      : undefined;

  const name =
    typeof options === "string"
      ? options
      : options?.nameStrategy === "title"
        ? undefined
        : options?.name;

  const main =
    parseDef(
      schema._def,
      name === undefined
        ? refs
        : {
            ...refs,
            currentPath: [...refs.basePath, refs.definitionPath, name],
          },
      false,
    ) ?? {};

  const title =
    typeof options === "object" &&
    options.name !== undefined &&
    options.nameStrategy === "title"
      ? options.name
      : undefined;

  if (title !== undefined) {
    main.title = title;
  }

  const combined: ReturnType<typeof zodToJsonSchema<Target>> =
    name === undefined
      ? definitions
        ? {
            ...main,
            [refs.definitionPath]: definitions,
          }
        : main
      : {
          $ref: [
            ...(refs.$refStrategy === "relative" ? [] : refs.basePath),
            refs.definitionPath,
            name,
          ].join("/"),
          [refs.definitionPath]: {
            ...definitions,
            [name]: main,
          },
        };

  if (refs.target === "jsonSchema7") {
    combined.$schema = "http://json-schema.org/draft-07/schema#";
  } else if (refs.target === "jsonSchema2019-09" || refs.target === "openAi") {
    combined.$schema = "https://json-schema.org/draft/2019-09/schema#";
  }

  if (
    refs.target === "openAi" &&
    ("anyOf" in combined ||
      "oneOf" in combined ||
      "allOf" in combined ||
      ("type" in combined && Array.isArray(combined.type)))
  ) {
    console.warn(
      "Warning: OpenAI may not support schemas with unions as roots! Try wrapping it in an object property.",
    );
  }

  return combined;
};

export { zodToJsonSchema };

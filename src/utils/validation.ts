import type { inferFormattedError, ZodType } from "zod";

export function assertIsValid<
  T,
  S extends Pick<ZodType, "safeParse"> = Pick<ZodType, "safeParse">
>(data: unknown, schema: S): asserts data is T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errorsRecord = flattenValidationErrors(result.error.format());

    const errorMessage = Object.entries(errorsRecord)
      .map(([path, errors]) => `${path ? `${path}: ` : ""}${errors.join(", ")}`)
      .join(" | ");

    throw new Error(errorMessage, { cause: data });
  }
}

function flattenValidationErrors<T extends ZodType, E = string>(
  formattedErrors: inferFormattedError<T, E>,
  path: string = ""
): Record<string, E[]> {
  return Object.entries(formattedErrors).reduce(
    (errors: Record<string, E[]>, [key, value]) => {
      if (key === "_errors" && Array.isArray(value)) {
        errors[path] = new Array<E>(...value);
      } else if (!!value && typeof value === "object") {
        Object.assign(
          errors,
          flattenValidationErrors<T, E>(
            value as unknown as inferFormattedError<T, E>,
            `${path}${!!path.length ? "." : ""}${key}`
          )
        );
      }

      return errors;
    },
    {}
  );
}

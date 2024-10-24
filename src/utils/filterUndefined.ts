import type { NonUndefined } from "./NonUndefined";

export function filterUndefined<T extends object>(
  obj: T
): Partial<NonUndefined<T>> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as Partial<NonUndefined<T>>;
}

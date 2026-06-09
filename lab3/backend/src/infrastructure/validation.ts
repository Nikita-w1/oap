import { ValidationDetail } from "../types/common.js";

export function requiredString(value: unknown, field: string, min = 1): ValidationDetail | null {
  if (typeof value !== "string" || value.trim().length < min) {
    return { field, message: `${field} must contain at least ${min} characters` };
  }
  return null;
}

export function requiredOneOf<T extends string | number>(
  value: unknown,
  field: string,
  allowed: T[],
): ValidationDetail | null {
  if (!allowed.includes(value as T)) {
    return { field, message: `${field} has invalid value` };
  }
  return null;
}

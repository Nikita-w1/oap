import { ValidationDetail } from "../types/common.js";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details: ValidationDetail[] = [],
  ) {
    super(message);
  }
}

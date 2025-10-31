/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

/**
 * Returns a standardized success response
 */
export function NextSuccess(message: string, data?: any, status = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status },
  );
}

/**
 * Returns a standardized error response
 * Includes full raw error and formatted summary (e.g. Prisma validation errors)
 */

/**
 * Cleans and formats a long stack-like error string for readable output
 */
function formatMultilineError(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * Recursively extracts all `_errors` arrays from a Zod formatted error object
 */
function collectZodErrors(obj: any, result: string[] = []): string[] {
  if (!obj || typeof obj !== "object") return result;

  // If object has an "_errors" array, add its messages
  if (Array.isArray(obj._errors) && obj._errors.length > 0) {
    result.push(...obj._errors);
  }

  // Recurse into nested objects
  for (const key in obj) {
    if (key !== "_errors") {
      collectZodErrors(obj[key], result);
    }
  }

  return result;
}
/**
 * Extracts a useful summary line from a stack error
 */
function extractSummary(err: any): string | null {
  if (typeof err === "string" && err.includes("\n")) {
    const lines = formatMultilineError(err);
    return lines.join("\n");
  }

  if (typeof err === "object" && err !== null) {
    const allErrors = collectZodErrors(err);
    if (allErrors.length > 0) return allErrors.join("\n");
  }

  return null;
}

/**
 * Returns a standardized error response
 * Includes:
 * - raw: original error string or object
 * - formatted: multiline formatted version (for devs)
 * - summary: short user-facing summary (for toasts)
 */
export function NextError(message: string, err?: any, status = 400) {
  let formatted: any = null;
  let summary: string | null = null;

  if (typeof err === "string" && err.includes("\n")) {
    formatted = formatMultilineError(err);
    summary = extractSummary(formatted);
  } else if (typeof err === "object" && err !== null) {
    formatted = err; // include object as-is (e.g., Zod flattened errors)
    summary = extractSummary(err); // collect all _errors recursively
  }

  return NextResponse.json(
    {
      success: false,
      message,
      error: {
        formatted,
        summary,
      },
    },
    { status },
  );
}

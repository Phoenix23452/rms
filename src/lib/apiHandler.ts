/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// lib/apiHandler.ts

import { NextRequest } from "next/server";
import { parseQueryParams } from "@/lib/queryParser"; // Parses query parameters like where/include/take/orderBy
import { schemaRegistry } from "@/lib/validators"; // Central registry for all Zod validation schemas
import { NextError, NextSuccess } from "@/lib/apiResponse"; // Utility functions to standardize success/error API responses
import { ZodObject } from "zod";
import { applyGenericDateFilter } from "./applyGenericDateFilter";

/**
 * Creates list-level API handlers (GET for list, POST for creation)
 * for a given Prisma repository and Zod schema key.
 */
export function createAPIHandlers<T>(repo: any, schemaKey: string) {
  return {
    /**
     * GET handler - fetches a list of records with optional filters
     */
    GET: async (req: NextRequest) => {
      try {
        // Parse query params for Prisma filters like where, include, orderBy
        const url = new URL(req.url);
        const searchParams = Object.fromEntries(url.searchParams.entries());
        const { where, include, take, orderBy } =
          parseQueryParams(searchParams);

        const whereWithDate = applyGenericDateFilter(where, searchParams);

        // 🔥 Merge date filters into where clause
        // const finalWhere = { ...where, ...whereWithDate };
        // Fetch data from the repo with parsed filters
        const data = await repo.getAll({
          where: whereWithDate,
          include,
          take,
          orderBy,
        });

        return NextSuccess("Fetched successfully", data);
      } catch (error: any) {
        return NextError("Failed to fetch data", error.message || error, 500);
      }
    },

    /**
     * POST handler - creates a new record after validating input using Zod schema
     */
    POST: async (req: NextRequest) => {
      try {
        const body = await req.json();
        const schema = schemaRegistry[schemaKey];

        // Enforce schema presence — no fallback
        if (!schema) {
          return NextError(
            `Missing schema for ${schemaKey}. Cannot validate request.`,
            null,
            500,
          );
        }

        // Validate request body using Zod
        const parsed = schema.safeParse(body);
        console.log("Hello ", parsed.error?.flatten());
        if (!parsed.success) {
          return NextError("Validation failed", parsed.error?.format(), 400);
        }

        // Save the validated data
        const created = await repo.create(parsed.data);
        return NextSuccess("Created successfully", created, 201);
      } catch (err: any) {
        console.error("Creation error:", err);
        return NextError("Failed to create record", err.message || err, 500);
      }
    },
  };
}

/**
 * Creates item-level API handlers (GET, PUT, DELETE)
 * for a specific resource identified by ID.
 */
export function createItemAPIHandlers<T>(repo: any, schemaKey: string) {
  return {
    /**
     * GET handler - fetches a single record by ID
     */
    GET: async (
      _: NextRequest,
      { params }: { params: Promise<{ id: string }> },
    ) => {
      try {
        const { id } = await params;
        const data = await repo.getById(Number(id));
        return NextSuccess("Fetched successfully", data);
      } catch (err: any) {
        return NextError("Failed to fetch item", err.message || err, 500);
      }
    },

    /**
     * PUT handler - updates a record after validating input using Zod schema
     */
    PUT: async (
      req: NextRequest,
      { params }: { params: Promise<{ id: string }> },
    ) => {
      try {
        const { id } = await params;
        const body = await req.json();
        console.log("body", body);
        const schema = schemaRegistry[schemaKey];

        if (!schema) {
          return NextError(
            `Missing schema for ${schemaKey}. Cannot validate update.`,
            null,
            500,
          );
        }

        const parsed = (schema as ZodObject<any>).partial().safeParse(body);
        if (!parsed.success) {
          return NextError("Validation failed", parsed.error.format(), 400);
        }
        console.log("zod parsed", parsed.data);

        const updated = await repo.update(Number(id), parsed.data);
        return NextSuccess("Updated successfully", updated);
      } catch (err: any) {
        return NextError("Failed to update item", err.message || err, 500);
      }
    },

    /**
     * DELETE handler - deletes a single record by ID
     */
    DELETE: async (
      _: NextRequest,
      { params }: { params: Promise<{ id: string }> },
    ) => {
      try {
        const { id } = await params;
        const deleted = await repo.delete(Number(id));

        return NextSuccess("Deleted successfully", deleted);
      } catch (err: any) {
        return NextError("Failed to delete item", err.message || err, 500);
      }
    },
  };
}

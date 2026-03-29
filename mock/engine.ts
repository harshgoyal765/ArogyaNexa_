/**
 * Mock API Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * Simulates real HTTP behavior: async delay, success/error wrapping,
 * and pagination. All mock service files use these helpers.
 *
 * To replace with a real API:
 *   1. Set USE_MOCK_API=false in .env.local
 *   2. The service layer (lib/services/*) will automatically route to
 *      the real axios-based API clients in lib/api/*.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { ApiResponse, PagedResponse } from '@/types/api';

import { MOCK_DELAY_MS } from '@/lib/config';

/** Artificial network delay (ms). Mirrors real API latency. */
const DELAY_MS = Number.isFinite(MOCK_DELAY_MS) ? MOCK_DELAY_MS : 600;

/** Simulate network latency */
export const delay = (ms = DELAY_MS): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Wrap data in the standard ApiResponse envelope */
export function ok<T>(data: T, message = 'Success'): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

/** Simulate a failed API response */
export function fail(message: string, status = 400): never {
  const err = Object.assign(new Error(message), {
    response: { data: { success: false, message, status }, status },
  });
  throw err;
}

/**
 * Paginate an in-memory array and return a PagedResponse.
 * Mirrors Spring Boot's Page<T> structure.
 */
export function paginate<T>(
  items: T[],
  page = 0,
  size = 12
): PagedResponse<T> {
  const totalElements = items.length;
  const totalPages = Math.ceil(totalElements / size);
  const start = page * size;
  const content = items.slice(start, start + size);
  return {
    content,
    page,
    size,
    totalElements,
    totalPages,
    last: page >= totalPages - 1,
  };
}

/**
 * Simulate a mock API call with delay + response envelope.
 * Usage:
 *   return mockCall(() => ok(paginate(items, page, size)));
 */
export async function mockCall<T>(
  fn: () => ApiResponse<T>,
  delayMs = MOCK_DELAY_MS
): Promise<{ data: ApiResponse<T> }> {
  await delay(delayMs);
  return { data: fn() };
}

export const USE_MOCK_API =
  process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' ||
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export const USE_MOCK_DATA = USE_MOCK_API;

export const MOCK_DELAY_MS = Number(
  process.env.NEXT_PUBLIC_MOCK_DELAY_MS ?? '800'
);

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

export function logServiceMode(service: string, useMock: boolean) {
  if (process.env.NODE_ENV === 'development') {
    console.info(`[${service}] mode: ${useMock ? '🟡 MOCK' : '🟢 REAL API'}`);
  }
}

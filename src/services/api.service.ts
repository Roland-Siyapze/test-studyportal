/**
 * @file api.service.ts
 * @description Axios instance with two interceptors:
 *
 *   REQUEST interceptor  — injects `Authorization: Bearer <token>` into
 *                          every outgoing request (AUTH-003, MOCK-003).
 *
 *   RESPONSE interceptor — on network failure (backend unavailable) falls
 *                          back to the matching mock dataset so the app
 *                          stays functional without a live backend (MOCK-003).
 *
 *   Token refresh is handled transparently before the request is sent.
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { getAccessToken, refreshTokenIfNeeded } from './keycloak.service'
import { MOCK_TICKETS_RESPONSE } from './mock/tickets.mock'
import { MOCK_DOCUMENTS_RESPONSE } from './mock/documents.mock'
import { MOCK_NOTIFICATIONS_RESPONSE } from './mock/notifications.mock'
import type { ApiResponse } from '@contracts/api-contracts'

// ─────────────────────────────────────────────────────────────────────────────
// Axios instance
// ─────────────────────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─────────────────────────────────────────────────────────────────────────────
// REQUEST interceptor — inject JWT
// ─────────────────────────────────────────────────────────────────────────────

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Attempt a silent token refresh before every request
    await refreshTokenIfNeeded()

    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE interceptor — mock fallback on network failure
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Maps URL patterns to their corresponding mock dataset.
 * Extend this map as new features are added.
 */
function getMockFallback(url: string): ApiResponse<unknown> | null {
  if (url.includes('/tickets')) return MOCK_TICKETS_RESPONSE
  if (url.includes('/documents')) return MOCK_DOCUMENTS_RESPONSE
  if (url.includes('/notifications')) return MOCK_NOTIFICATIONS_RESPONSE
  return null
}

api.interceptors.response.use(
  // Pass successful responses straight through
  (response) => response,

  // On error, attempt to return mock data
  (error: AxiosError) => {
    const isNetworkError = !error.response            // backend unreachable
    const isServerError = (error.response?.status ?? 0) >= 500

    if (isNetworkError || isServerError) {
      const url = error.config?.url ?? ''
      const mockData = getMockFallback(url)

      if (mockData) {
        console.warn(
          `[api.service] Backend unavailable for "${url}" — using mock fallback.`
        )
        // Return a synthetic Axios response so callers see the same shape
        return Promise.resolve({
          data: mockData,
          status: 200,
          statusText: 'OK (mock)',
          headers: {},
          config: error.config,
        })
      }
    }

    // Re-throw errors that don't have a mock fallback
    return Promise.reject(error)
  }
)

export default api
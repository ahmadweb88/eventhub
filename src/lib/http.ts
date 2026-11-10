import axios from 'axios'

export const http = axios.create({
  timeout: 8_000,
  headers: { Accept: 'application/json' },
})

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED')
      return 'The service took too long to respond. Please try again.'
    if (error.response?.status === 401) return 'Invalid API key.'
    if (error.response?.status === 404) return 'No results found.'
    if (error.response?.status === 429)
      return 'Too many requests. Please wait a moment.'
    if (error.response)
      return `The service returned an error (${error.response.status}).`
    return 'Network error. Check your connection.'
  }
  return 'Something went wrong.'
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

/** Any error → a status code for our route + a message safe to show users. */
export function toApiError(
  error: unknown,
  notFoundMessage = 'No results found.',
): ApiError {
  if (error instanceof ApiError) return error

  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT')
      return new ApiError(
        504,
        'The weather service took too long to respond. Please try again.',
      )
    const status = error.response?.status
    if (status === 404) return new ApiError(404, notFoundMessage)
    if (status === 401 || status === 403) {
      console.error('External API rejected the key.')
      return new ApiError(
        503,
        'The weather service is temporarily unavailable.',
      )
    }
    if (status === 429)
      return new ApiError(
        503,
        'The weather service is busy. Please try again in a minute.',
      )
    if (status && status >= 500)
      return new ApiError(
        502,
        'The weather service is having problems. Please try again.',
      )
    if (!error.response)
      return new ApiError(
        502,
        'Could not reach the weather service. Check your connection.',
      )
  }

  console.error('Unexpected external API error:', error)
  return new ApiError(500, 'Something went wrong. Please try again.')
}

/** Retry once on timeouts and 5xx errors. */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 1,
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    const retryable =
      axios.isAxiosError(error) &&
      (error.code === 'ECONNABORTED' ||
        !error.response ||
        (error.response.status ?? 0) >= 500)
    if (retries > 0 && retryable) {
      await new Promise((r) => setTimeout(r, 400))
      return withRetry(fn, retries - 1)
    }
    throw error
  }
}

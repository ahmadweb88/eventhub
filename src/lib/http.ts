import axios from 'axios'

export const http = axios.create({
  timeout: 10_000,
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

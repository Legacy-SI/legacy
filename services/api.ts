const BASE_URL = process.env.EXPO_PUBLIC_API_URL

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const { headers: customHeaders, ...restOptions } = options ?? {}

  const response = await fetch(`${BASE_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...customHeaders },
    ...restOptions,
  })

  if (response.status === 204) return undefined as T

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message ?? 'Erro inesperado')
  }

  return data as T
}

export const api = {
  post: <T>(path: string, body: unknown, headers?: HeadersInit) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body), headers }),

  put: <T>(path: string, body: unknown, headers?: HeadersInit) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body), headers }),

  patch: <T>(path: string, body: unknown, headers?: HeadersInit) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body), headers }),

  get: <T>(path: string, headers?: HeadersInit) =>
    request<T>(path, { method: 'GET', headers }),

  delete: <T = void>(path: string, headers?: HeadersInit) =>
    request<T>(path, { method: 'DELETE', headers }),
}

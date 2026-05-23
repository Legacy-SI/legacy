const BASE_URL = process.env.EXPO_PUBLIC_API_URL

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const { headers: customHeaders, ...restOptions } = options ?? {}

  const response = await fetch(`${BASE_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...customHeaders },
    ...restOptions,
  })

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

  get: <T>(path: string, headers?: HeadersInit) =>
    request<T>(path, { method: 'GET', headers }),
}

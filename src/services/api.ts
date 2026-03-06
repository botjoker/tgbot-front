const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function basicAuthHeader(login: string, password: string) {
  return 'Basic ' + btoa(`${login}:${password}`)
}

export async function login(login: string, password: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/api/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  })
  return res.ok
}

export async function fetchSettings(login: string, password: string): Promise<Record<string, string>> {
  const res = await fetch(`${BASE_URL}/api/settings`, {
    headers: { Authorization: basicAuthHeader(login, password) },
  })
  if (!res.ok) throw new Error('Unauthorized')
  return res.json()
}

export async function updateSetting(
  key: string,
  value: string,
  credentials: { login: string; password: string }
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/settings/${key}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: basicAuthHeader(credentials.login, credentials.password),
    },
    body: JSON.stringify({ value }),
  })
  if (!res.ok) throw new Error('Failed to update setting')
}

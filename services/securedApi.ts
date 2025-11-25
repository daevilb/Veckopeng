// securedApi.ts
// Wrapper around your existing API calls that automatically attaches the family key header.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function getFamilyKey(): string | null {
  return localStorage.getItem('veckopeng.familyKey');
}

export async function securedFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const familyKey = getFamilyKey();
  if (familyKey) {
    headers['x-family-key'] = familyKey;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error('AUTH_ERROR');
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Suggested usage:
 *
 * - Replace your existing raw fetch(...) calls used for backend APIs with securedFetch(...)
 *   or wrap your existing api helpers around securedFetch so the header is always present.
 */

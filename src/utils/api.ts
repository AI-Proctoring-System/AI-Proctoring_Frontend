const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  companyId?: string;
  candidateId?: string;
  firstName?: string;
  lastName?: string;
  company?: { name: string };
  exp?: number;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) return null;
    const decoded = atob(payloadPart);
    return JSON.parse(decoded) as DecodedToken;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}/${endpoint.replace(/^\//, '')}`;
  
  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('proctor_token') : null;
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = data?.message || data?.error || 'An error occurred';
    throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
  }

  // The backend uses a TransformInterceptor which wraps responses in a structure, 
  // let's handle both raw responses and wrapped { data, statusCode, etc. }
  if (data && 'data' in data && 'statusCode' in data) {
    return data.data as T;
  }

  return data as T;
}

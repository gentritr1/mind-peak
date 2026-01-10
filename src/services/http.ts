// src/services/http.ts
// Lightweight shared HTTP helper for calling the backend.
// Higher-level feature modules (auth, sessions, etc.) should build on this.

const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000';

const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
};

export interface ApiErrorResponse {
    message: string;
    errors?: Record<string, string[]>;
}

export interface ApiResult<T> {
    status: number;
    data?: T;
    error?: ApiErrorResponse;
}

type JsonRequestInit = Omit<RequestInit, 'body'> & {
    body?: unknown;
};

export async function apiRequest<TResponse>(
    path: string,
    init: JsonRequestInit,
): Promise<ApiResult<TResponse>> {
    const base = API_BASE_URL.replace(/\/$/, '');
    const normalizedPath = path.replace(/^\//, '');
    const url = `${base}/${normalizedPath}`;

    // Lightweight debug log for outbound requests
    // eslint-disable-next-line no-console
    console.log('[HTTP] Request', { url, method: init.method ?? 'GET', body: init.body });

    const response = await fetch(url, {
        ...init,
        headers: {
            ...defaultHeaders,
            ...(init.headers ?? {}),
        },
        body:
            init.body != null && typeof init.body !== 'string'
                ? JSON.stringify(init.body)
                : (init.body as BodyInit | null | undefined),
    });

    let json: unknown;
    try {
        json = await response.json();
    } catch {
        // Non‑JSON or empty body
        json = undefined;
    }

    if (!response.ok) {
        // eslint-disable-next-line no-console
        console.log('[HTTP] Error response', { url, status: response.status, body: json });
        return {
            status: response.status,
            error: (json as ApiErrorResponse | undefined) ?? {
                message: 'Request failed',
            },
        };
    }

    // eslint-disable-next-line no-console
    console.log('[HTTP] Success response', { url, status: response.status });

    return {
        status: response.status,
        data: json as TResponse,
    };
}


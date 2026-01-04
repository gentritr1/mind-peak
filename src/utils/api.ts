// src/utils/api.ts
// Shared API helper + auth endpoints for the Peak Mind app.
// Reads the base URL from EXPO_PUBLIC_API_BASE_URL so you can
// configure different backends per environment.

export interface User {
    id: number;
    name: string | null;
    email: string;
    avatar_url: string | null;
    timezone: string | null;
    created_at: string;
    updated_at: string;
}

export interface ApiErrorResponse {
    message: string;
    errors?: Record<string, string[]>;
}

interface ApiResult<T> {
    status: number;
    data?: T;
    error?: ApiErrorResponse;
}

const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000';

const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
};

type JsonRequestInit = Omit<RequestInit, 'body'> & {
    body?: unknown;
};

async function request<TResponse>(
    path: string,
    init: JsonRequestInit,
): Promise<ApiResult<TResponse>> {
    const url = `${API_BASE_URL.replace(/\/$/, '')}/api/${path.replace(
        /^\//,
        '',
    )}`;
    console.log('url', url);
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
        return {
            status: response.status,
            error: (json as ApiErrorResponse | undefined) ?? {
                message: 'Request failed',
            },
        };
    }

    return {
        status: response.status,
        data: json as TResponse,
    };
}

// -------- Auth endpoints --------

interface AuthSuccessPayload {
    user: User;
}

export async function apiRegister(input: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}): Promise<ApiResult<AuthSuccessPayload>> {
    return request<AuthSuccessPayload>('register', {
        method: 'POST',
        body: input,
    });
}

export async function apiLogin(input: {
    email: string;
    password: string;
}): Promise<ApiResult<AuthSuccessPayload>> {
    return request<AuthSuccessPayload>('login', {
        method: 'POST',
        body: input,
    });
}

export async function apiForgotPassword(input: {
    email: string;
}): Promise<ApiResult<{ message: string }>> {
    return request<{ message: string }>('forgot-password', {
        method: 'POST',
        body: input,
    });
}

// In the future, you can add:
// - apiCreateSession (POST /api/sessions)
// - apiListSessions (GET /api/sessions)
// - apiWeeklySummary (GET /api/summary/weekly)
// and reuse the same request() helper above.



// src/services/auth.ts
// Auth-related API calls grouped in one place.

import { apiRequest, ApiResult } from './http';

export interface User {
    id: number;
    name: string | null;
    email: string;
    avatar_url: string | null;
    timezone: string | null;
    created_at: string;
    updated_at: string;
}

interface AuthSuccessPayload {
    user: User;
}

export async function apiLogin(input: {
    email: string;
    password: string;
}): Promise<ApiResult<AuthSuccessPayload>> {
    return apiRequest<AuthSuccessPayload>('api/login', {
        method: 'POST',
        body: input,
    });
}

export async function apiRegister(input: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}): Promise<ApiResult<AuthSuccessPayload>> {
    return apiRequest<AuthSuccessPayload>('api/register', {
        method: 'POST',
        body: input,
    });
}

export async function apiForgotPassword(input: {
    email: string;
}): Promise<ApiResult<{ message: string }>> {
    return apiRequest<{ message: string }>('api/forgot-password', {
        method: 'POST',
        body: input,
    });
}


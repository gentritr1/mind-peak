// src/services/sessions/meditation.ts
// API helpers for logging meditation timer sessions.
//
// Matches the backend spec in backend/README.meditation_api.md
// section "2.4 Meditation Timer (`meditation_timer`)".

import { apiRequest, ApiResult } from '@/services/http';

export type MeditationEventCategory = 'emotion' | 'sensation' | 'thought';

export interface MeditationEventPayload {
    category: MeditationEventCategory;
    timestamp_ms: number; // since session start
    note?: string;
}

export interface MeditationSummaryPayload {
    target_duration_ms: number;
    completed_duration_ms: number;
    emotion_count: number;
    sensation_count: number;
    thought_count: number;
}

export interface MeditationSessionPayload {
    activity_type: 'meditation_timer';
    started_at: string; // ISO datetime
    ended_at: string; // ISO datetime
    duration_ms: number;
    client_version?: string;
    device_info?: unknown;
    meta?: unknown;
    summary: MeditationSummaryPayload;
    events?: MeditationEventPayload[];
}

/**
 * Create a meditation session (`activity_type = "meditation_timer"`).
 */
export async function apiCreateMeditationSession(
    input: MeditationSessionPayload,
): Promise<ApiResult<unknown>> {
    return apiRequest<unknown>('api/sessions', {
        method: 'POST',
        body: input,
    });
}


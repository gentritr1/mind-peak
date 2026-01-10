// src/services/sessions/breath.ts
// API helpers for logging 4–6 breath sessions (`activity_type = "breath_4_6"`).
//
// Mirrors the backend spec in backend/README.meditation_api.md
// section "2.3 4–6 Breath (`breath_4_6`)".

import { apiRequest, ApiResult } from '@/services/http';

export type BreathPhaseKind = 'inhale' | 'exhale';

export interface BreathPhasePayload {
    index: number;
    phase: BreathPhaseKind;
    target_duration_ms: number;
    actual_duration_ms: number;
    delta_ms: number;
    is_on_rhythm: boolean;
}

export interface BreathSummaryPayload {
    inhale_ms: number;
    exhale_ms: number;
    target_cycles: number;
    completed_cycles: number;
    on_rhythm_phases: number;
    total_phases: number;
    avg_offset_ms: number;
}

export interface BreathSessionPayload {
    activity_type: 'breath_4_6';
    started_at: string;
    ended_at: string;
    duration_ms: number;
    client_version?: string;
    device_info?: unknown;
    meta?: unknown;
    summary: BreathSummaryPayload;
    phases?: BreathPhasePayload[];
}

export async function apiCreateBreathSession(
    input: BreathSessionPayload,
): Promise<ApiResult<unknown>> {
    return apiRequest<unknown>('api/sessions', {
        method: 'POST',
        body: input,
    });
}


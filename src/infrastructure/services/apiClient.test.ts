import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient } from './apiClient';

describe('apiClient service', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('checks health status successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok', timestamp: '2026-09-19T00:00:00Z' }),
    });

    const result = await apiClient.checkHealth();
    expect(result.status).toBe('ok');
    expect(result.timestamp).toBeDefined();
  });

  it('handles companionChat success response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        reply: 'Hello Margaret, I am glad you are feeling comfortable today.',
        isFallback: false,
      }),
    });

    const res = await apiClient.companionChat({
      message: 'Hello, how is the weather?',
      seniorName: 'Margaret',
    });

    expect(res.reply).toContain('Margaret');
    expect(res.isFallback).toBe(false);
  });

  it('provides safe fallback when companionChat fails due to network error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));

    const res = await apiClient.companionChat({
      message: 'Hello',
      seniorName: 'Margaret',
    });

    expect(res.isFallback).toBe(true);
    expect(res.reply).toBeDefined();
    expect(res.reply.length).toBeGreaterThan(0);
  });

  it('handles scam check endpoint successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        riskLevel: 'HIGH_RISK',
        explanation: 'This text is demanding payment via gift cards.',
        recommendedAction: 'Do not respond and call your family guardian.',
        isScam: true,
      }),
    });

    const res = await apiClient.checkScam('Pay your electric bill with $500 Target gift card');
    expect(res.isScam).toBe(true);
    expect(res.riskLevel).toBe('HIGH_RISK');
  });

  it('falls back to safe heuristic on scam check failure', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Server unavailable'));

    const res = await apiClient.checkScam('Buy gift card immediately');
    expect(res.isScam).toBe(true);
    expect(res.riskLevel).toBe('HIGH_RISK');
    expect(res.recommendedAction).toContain('guardian');
  });

  it('handles simplify text endpoint successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        simplifiedText: 'Your doctor says your heart is healthy. Keep taking your morning pill.',
        keyTakeaway: 'Your heart is in good shape.',
        plainLanguageLevel: 'Grade 5',
      }),
    });

    const res = await apiClient.simplifyText('Cardiovascular examination demonstrates normal sinus rhythm with unremarkable ventricular ejection fraction.');
    expect(res.simplifiedText).toContain('doctor');
    expect(res.keyTakeaway).toBeDefined();
  });

  it('transcribes memoir story successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        title: 'Dancing at the 1964 World Fair',
        refinedStory: 'In the summer of 1964, my sister and I traveled to Queens...',
        lifeLessonTakeaway: 'Cherish every trip you take with family.',
      }),
    });

    const res = await apiClient.transcribeMemoir({
      rawTranscript: 'I remember the 1964 fair in New York with my sister',
      theme: 'Early Memories',
      seniorName: 'Margaret',
    });

    expect(res.title).toBe('Dancing at the 1964 World Fair');
    expect(res.refinedStory).toContain('1964');
  });
});

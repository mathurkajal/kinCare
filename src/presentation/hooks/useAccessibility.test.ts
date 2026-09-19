// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAccessibility } from './useAccessibility';

describe('useAccessibility hook', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('high-contrast');
    document.documentElement.classList.remove('reduced-motion');
  });

  it('initializes with comfortable accessible defaults', () => {
    const { result } = renderHook(() => useAccessibility());

    expect(result.current.fontScale).toBe('large');
    expect(result.current.isVoiceActive).toBe(false);
    expect(result.current.isHandsFreeActive).toBe(false);
    expect(result.current.handPreference).toBe('both');
    expect(result.current.isOneHandMode).toBe(false);
    expect(result.current.language).toBe('en');
    expect(result.current.highContrast).toBe(false);
    expect(result.current.reducedMotion).toBe(false);
    expect(result.current.privacyShield).toBe(true);
  });

  it('synchronizes high contrast class with documentElement', () => {
    const { result } = renderHook(() => useAccessibility());

    expect(document.documentElement.classList.contains('high-contrast')).toBe(false);

    act(() => {
      result.current.setHighContrast(true);
    });

    expect(result.current.highContrast).toBe(true);
    expect(document.documentElement.classList.contains('high-contrast')).toBe(true);

    act(() => {
      result.current.setHighContrast(false);
    });

    expect(result.current.highContrast).toBe(false);
    expect(document.documentElement.classList.contains('high-contrast')).toBe(false);
  });

  it('synchronizes reduced motion class with documentElement', () => {
    const { result } = renderHook(() => useAccessibility());

    expect(document.documentElement.classList.contains('reduced-motion')).toBe(false);

    act(() => {
      result.current.setReducedMotion(true);
    });

    expect(result.current.reducedMotion).toBe(true);
    expect(document.documentElement.classList.contains('reduced-motion')).toBe(true);

    act(() => {
      result.current.setReducedMotion(false);
    });

    expect(result.current.reducedMotion).toBe(false);
    expect(document.documentElement.classList.contains('reduced-motion')).toBe(false);
  });

  it('updates fontScale and language preferences', () => {
    const { result } = renderHook(() => useAccessibility());

    act(() => {
      result.current.setFontScale('xlarge');
      result.current.setLanguage('es');
      result.current.setHandPreference('left');
    });

    expect(result.current.fontScale).toBe('xlarge');
    expect(result.current.language).toBe('es');
    expect(result.current.handPreference).toBe('left');
  });
});

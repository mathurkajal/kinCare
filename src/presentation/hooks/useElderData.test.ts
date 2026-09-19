// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useElderData } from './useElderData';

describe('useElderData hook', () => {
  it('initializes with default senior profile and data collections', () => {
    const { result } = renderHook(() => useElderData());

    expect(result.current.senior).toBeDefined();
    expect(result.current.senior.name).toBe('Margaret Higgins');
    expect(result.current.requests.length).toBeGreaterThan(0);
    expect(result.current.wishes.length).toBeGreaterThan(0);
    expect(result.current.stories.length).toBeGreaterThan(0);
  });

  it('handles morning wellness check-in and updates streak', () => {
    const { result } = renderHook(() => useElderData());
    const initialStreak = result.current.senior.dailyCheckIn.checkInStreak;

    act(() => {
      result.current.checkInToday('peaceful');
    });

    expect(result.current.senior.dailyCheckIn.checkedInToday).toBe(true);
    expect(result.current.senior.dailyCheckIn.mood).toBe('peaceful');
    expect(result.current.senior.dailyCheckIn.checkInStreak).toBe(initialStreak + 1);
    expect(result.current.senior.dailyCheckIn.lastCheckInTime).toBeDefined();
  });

  it('allows reversible reset of daily check-in', () => {
    const { result } = renderHook(() => useElderData());

    act(() => {
      result.current.checkInToday('happy');
    });
    expect(result.current.senior.dailyCheckIn.checkedInToday).toBe(true);

    act(() => {
      result.current.resetCheckIn();
    });
    expect(result.current.senior.dailyCheckIn.checkedInToday).toBe(false);
    expect(result.current.senior.dailyCheckIn.mood).toBeUndefined();
  });

  it('saves new life story chapter in memories', () => {
    const { result } = renderHook(() => useElderData());
    const initialCount = result.current.stories.length;

    act(() => {
      result.current.saveStory({
        id: 'story-test-1',
        seniorId: 's1',
        seniorName: 'Margaret Higgins',
        title: 'Summer in the Garden',
        theme: 'Early Memories',
        promptQuestion: 'What is your favorite garden flower?',
        transcript: 'I used to plant hydrangeas every spring.',
        refinedStory: 'Every spring, our front porch was framed by vibrant blue hydrangeas...',
        lifeLessonTakeaway: 'Patience blooms with care.',
        recordedDate: 'Sep 19, 2026',
        isSharedWithFamily: true,
      });
    });

    expect(result.current.stories.length).toBe(initialCount + 1);
    expect(result.current.stories[0].title).toBe('Summer in the Garden');
  });

  it('pledges a golden wish and marks it fulfilled', () => {
    const { result } = renderHook(() => useElderData());
    const firstWishId = result.current.wishes[0].id;

    act(() => {
      result.current.pledgeWish(firstWishId, 'David Chen (Volunteer)');
    });

    const updatedWish = result.current.wishes.find(w => w.id === firstWishId);
    expect(updatedWish?.status).toBe('fulfilled');
    expect(updatedWish?.pledgedByVolunteerName).toBe('David Chen (Volunteer)');
  });

  it('completes visit with PIN verification and logs to family audit trail', () => {
    const { result } = renderHook(() => useElderData());
    const requestId = result.current.requests[0].id;

    act(() => {
      result.current.completeVisit(requestId, 'Shared morning tea and inspected safety rails.');
    });

    const completedReq = result.current.requests.find(r => r.id === requestId);
    expect(completedReq?.status).toBe('completed');

    expect(result.current.auditLogs[0].verifiedWithPin).toBe(true);
    expect(result.current.auditLogs[0].notes).toContain('safety rails');
    expect(result.current.auditLogs[0].familyNotified).toBe(true);
  });

  it('dismisses proactive suggestions gently', () => {
    const { result } = renderHook(() => useElderData());
    const firstSugId = result.current.proactiveSuggestions[0].id;

    act(() => {
      result.current.dismissSuggestion(firstSugId);
    });

    const found = result.current.proactiveSuggestions.find(s => s.id === firstSugId);
    expect(found).toBeUndefined();
  });
});

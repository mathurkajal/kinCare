import { describe, it, expect } from 'vitest';
import { verificationStateMachine, VerificationState } from './VerificationStateMachine';

describe('VerificationStateMachine', () => {
  it('follows the standard progressive onboarding flow', () => {
    let state: VerificationState = 'REGISTERED';

    state = verificationStateMachine(state, { type: 'VERIFY_CONTACT' });
    expect(state).toBe('CONTACT_VERIFIED');

    state = verificationStateMachine(state, { type: 'SUBMIT_IDENTITY' });
    expect(state).toBe('IDENTITY_VERIFICATION_PENDING');

    state = verificationStateMachine(state, { type: 'IDENTITY_APPROVED' });
    expect(state).toBe('IDENTITY_VERIFIED');

    state = verificationStateMachine(state, { type: 'MANUAL_REVIEW_APPROVED' });
    expect(state).toBe('APPROVED');
  });

  it('handles flagged identity check requiring additional review', () => {
    let state: VerificationState = 'IDENTITY_VERIFICATION_PENDING';

    state = verificationStateMachine(state, { type: 'IDENTITY_FLAGGED' });
    expect(state).toBe('ADDITIONAL_CHECK_REQUIRED');

    state = verificationStateMachine(state, { type: 'MANUAL_REVIEW_APPROVED' });
    expect(state).toBe('IDENTITY_VERIFIED');
  });

  it('transitions to VERIFICATION_FAILED on failed check', () => {
    const state = verificationStateMachine('IDENTITY_VERIFICATION_PENDING', { type: 'FAIL_VERIFICATION' });
    expect(state).toBe('VERIFICATION_FAILED');
  });

  it('immediately moves to BLOCKED or SUSPENDED upon security event from any state', () => {
    expect(verificationStateMachine('APPROVED', { type: 'BLOCK' })).toBe('BLOCKED');
    expect(verificationStateMachine('IDENTITY_VERIFIED', { type: 'SUSPEND' })).toBe('SUSPENDED');
    expect(verificationStateMachine('REGISTERED', { type: 'BLOCK' })).toBe('BLOCKED');
  });

  it('ignores invalid transitions and maintains current state', () => {
    const state = verificationStateMachine('REGISTERED', { type: 'IDENTITY_APPROVED' });
    expect(state).toBe('REGISTERED');
  });
});

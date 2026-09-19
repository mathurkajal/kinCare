export type VerificationState = 
  | 'REGISTERED'
  | 'CONTACT_VERIFIED'
  | 'IDENTITY_VERIFICATION_PENDING'
  | 'IDENTITY_VERIFIED'
  | 'ADDITIONAL_CHECK_REQUIRED'
  | 'APPROVED'
  | 'VERIFICATION_FAILED'
  | 'SUSPENDED'
  | 'BLOCKED';

export type VerificationEvent =
  | { type: 'VERIFY_CONTACT' }
  | { type: 'SUBMIT_IDENTITY' }
  | { type: 'IDENTITY_APPROVED' }
  | { type: 'IDENTITY_FLAGGED' }
  | { type: 'MANUAL_REVIEW_APPROVED' }
  | { type: 'FAIL_VERIFICATION' }
  | { type: 'SUSPEND' }
  | { type: 'BLOCK' };

export const verificationStateMachine = (
  currentState: VerificationState,
  event: VerificationEvent
): VerificationState => {
  if (event.type === 'BLOCK') return 'BLOCKED';
  if (event.type === 'SUSPEND') return 'SUSPENDED';

  switch (currentState) {
    case 'REGISTERED':
      if (event.type === 'VERIFY_CONTACT') return 'CONTACT_VERIFIED';
      break;
    case 'CONTACT_VERIFIED':
      if (event.type === 'SUBMIT_IDENTITY') return 'IDENTITY_VERIFICATION_PENDING';
      break;
    case 'IDENTITY_VERIFICATION_PENDING':
      if (event.type === 'IDENTITY_APPROVED') return 'IDENTITY_VERIFIED';
      if (event.type === 'IDENTITY_FLAGGED') return 'ADDITIONAL_CHECK_REQUIRED';
      if (event.type === 'FAIL_VERIFICATION') return 'VERIFICATION_FAILED';
      break;
    case 'ADDITIONAL_CHECK_REQUIRED':
      if (event.type === 'MANUAL_REVIEW_APPROVED') return 'IDENTITY_VERIFIED';
      if (event.type === 'FAIL_VERIFICATION') return 'VERIFICATION_FAILED';
      break;
    case 'IDENTITY_VERIFIED':
      // After identity is verified, background checks or professional checks can happen.
      // For simplicity in the companion flow, they move to APPROVED.
      if (event.type === 'MANUAL_REVIEW_APPROVED') return 'APPROVED'; // Admin approval
      break;
    case 'VERIFICATION_FAILED':
    case 'SUSPENDED':
    case 'BLOCKED':
    case 'APPROVED':
      // Terminal or admin-only override states
      break;
  }
  return currentState;
};

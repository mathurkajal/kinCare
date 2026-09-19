import { describe, it, expect } from 'vitest';
import { SafetyEngine } from '../domain/safety/SafetyEngine';
import { MatchingEngine } from '../domain/matching/MatchingEngine';
import { verificationStateMachine } from '../domain/verification/VerificationStateMachine';
import { INITIAL_SENIORS, INITIAL_VOLUNTEERS, INITIAL_REQUESTS } from '../infrastructure/testing/mockData';

describe('Elder Safety & Companion Workflow Integration', () => {
  it('enforces complete companion verification and matching workflow', () => {
    // 1. Volunteer Onboarding progression through state machine
    let volunteerState = verificationStateMachine('REGISTERED', { type: 'VERIFY_CONTACT' });
    expect(volunteerState).toBe('CONTACT_VERIFIED');

    volunteerState = verificationStateMachine(volunteerState, { type: 'SUBMIT_IDENTITY' });
    expect(volunteerState).toBe('IDENTITY_VERIFICATION_PENDING');

    volunteerState = verificationStateMachine(volunteerState, { type: 'IDENTITY_APPROVED' });
    expect(volunteerState).toBe('IDENTITY_VERIFIED');

    volunteerState = verificationStateMachine(volunteerState, { type: 'MANUAL_REVIEW_APPROVED' });
    expect(volunteerState).toBe('APPROVED');

    // 2. Proximity and capability matching for senior care request
    const senior = INITIAL_SENIORS[0];
    const matchingCandidates = MatchingEngine.generateCandidates(
      {
        preferredLanguages: ['English', 'Spanish'],
        interests: senior.interests,
        requiredCapabilities: ['reading_aloud'],
        maxDistanceMiles: 10,
      },
      INITIAL_VOLUNTEERS.map(v => ({
        id: v.id,
        verificationState: 'APPROVED',
        languages: v.languages,
        interests: ['Gardening', 'Books'],
        distanceMiles: 1.2,
        rating: v.rating,
        specialCapabilities: ['reading_aloud'],
      })),
      3
    );

    expect(matchingCandidates.length).toBeGreaterThan(0);
    expect(matchingCandidates[0].verificationState).toBe('APPROVED');

    // 3. Senior doorstep arrival PIN security
    expect(senior.safetyPin).toBeDefined();
    expect(senior.safetyPin).toMatch(/^\d{4}$/);

    // 4. SafetyEngine prevents elder financial exploitation and imposter scam attempts
    const scamAttempt = "Hello grandma this is your grandson in jail and I need $1000 in gift cards right now";
    const auditResult = SafetyEngine.evaluateMessage({
      senderId: 'vol-1',
      senderRole: 'volunteer',
      receiverId: 'senior-1',
      content: scamAttempt,
    });
    expect(auditResult.riskLevel).toBe('BLOCK');
    expect(auditResult.reason).toMatch(/financial transactions|scam/i);

    // 5. Safe neighbor request passes standard audit
    const safeRequest = "Would love someone to share a warm cup of herbal tea and talk about gardening";
    const safeResult = SafetyEngine.evaluateMessage({
      senderId: 'vol-1',
      senderRole: 'volunteer',
      receiverId: 'senior-1',
      content: safeRequest,
    });
    expect(safeResult.riskLevel).toBe('SAFE');
  });

  it('enforces clinical vs volunteer role boundary integrity', () => {
    // Ordinary volunteer request for groceries
    const groceryReq = INITIAL_REQUESTS.find(r => r.category === 'groceries');
    expect(Boolean(groceryReq?.isProfessionalOnly)).toBe(false);

    // Clinical request requiring registered healthcare professional
    const clinicalReq = INITIAL_REQUESTS.find(r => r.category === 'professional_care');
    expect(clinicalReq?.isProfessionalOnly).toBe(true);
  });
});

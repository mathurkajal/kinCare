import { describe, it, expect } from 'vitest';
import { MatchingEngine, CompanionCandidate, ElderRequirements } from './MatchingEngine';

describe('MatchingEngine', () => {
  const sampleRequirements: ElderRequirements = {
    preferredLanguages: ['en', 'es'],
    interests: ['gardening', 'classical music', 'baking'],
    maxDistanceMiles: 10,
  };

  const candidateApprovedA: CompanionCandidate = {
    id: 'cand-1',
    verificationState: 'APPROVED',
    languages: ['en'],
    interests: ['gardening', 'baking'],
    distanceMiles: 3,
    rating: 4.9,
  };

  const candidateApprovedB: CompanionCandidate = {
    id: 'cand-2',
    verificationState: 'APPROVED',
    languages: ['es', 'fr'],
    interests: ['classical music'],
    distanceMiles: 8,
    rating: 4.7,
  };

  const candidatePendingVerification: CompanionCandidate = {
    id: 'cand-unverified',
    verificationState: 'IDENTITY_VERIFICATION_PENDING',
    languages: ['en', 'es'],
    interests: ['gardening', 'classical music', 'baking'],
    distanceMiles: 1,
    rating: 5.0,
  };

  const candidateBlocked: CompanionCandidate = {
    id: 'cand-blocked',
    verificationState: 'BLOCKED',
    languages: ['en'],
    interests: ['gardening'],
    distanceMiles: 2,
    rating: 5.0,
  };

  it('strictly filters out candidates who are not APPROVED, even if they have perfect match', () => {
    const pool = [candidatePendingVerification, candidateBlocked, candidateApprovedA];
    const matches = MatchingEngine.generateCandidates(sampleRequirements, pool, 5);

    expect(matches.length).toBe(1);
    expect(matches[0].id).toBe('cand-1');
  });

  it('ranks candidates with higher compatibility scores first', () => {
    const pool = [candidateApprovedB, candidateApprovedA];
    const matches = MatchingEngine.generateCandidates(sampleRequirements, pool, 5);

    // Candidate A has 2 shared interests and closer distance (3 miles vs 8 miles)
    expect(matches[0].id).toBe('cand-1');
    expect(matches[1].id).toBe('cand-2');
  });

  it('respects the limit argument', () => {
    const pool = [candidateApprovedA, candidateApprovedB];
    const matches = MatchingEngine.generateCandidates(sampleRequirements, pool, 1);

    expect(matches.length).toBe(1);
    expect(matches[0].id).toBe('cand-1');
  });

  it('penalizes candidates that exceed the maximum distance limit', () => {
    const candidateFarAway: CompanionCandidate = {
      id: 'cand-far',
      verificationState: 'APPROVED',
      languages: ['de'], // No language match
      interests: [], // No interests
      distanceMiles: 50, // Far exceeds 10 miles
      rating: 3.0,
    };

    const matches = MatchingEngine.generateCandidates(sampleRequirements, [candidateFarAway], 5);
    expect(matches).toEqual([]);
  });

  it('handles empty pool or zero limit gracefully', () => {
    expect(MatchingEngine.generateCandidates(sampleRequirements, [], 3)).toEqual([]);
    expect(MatchingEngine.generateCandidates(sampleRequirements, [candidateApprovedA], 0)).toEqual([]);
  });
});

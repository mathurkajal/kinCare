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

  it('boosts candidates with requested capabilities (e.g. mobility assistance)', () => {
    const candidateWithMobility: CompanionCandidate = {
      id: 'cand-mobility',
      verificationState: 'APPROVED',
      languages: ['en'],
      interests: ['gardening'],
      distanceMiles: 5,
      rating: 4.5,
      specialCapabilities: ['mobility_assistance'],
    };

    const candidateWithoutMobility: CompanionCandidate = {
      id: 'cand-standard',
      verificationState: 'APPROVED',
      languages: ['en'],
      interests: ['gardening'],
      distanceMiles: 5,
      rating: 4.5,
      specialCapabilities: [],
    };

    const reqWithMobility: ElderRequirements = {
      ...sampleRequirements,
      requiredCapabilities: ['mobility_assistance'],
    };

    const matches = MatchingEngine.generateCandidates(reqWithMobility, [candidateWithoutMobility, candidateWithMobility], 2);
    expect(matches[0].id).toBe('cand-mobility');
  });

  it('demonstrates high algorithmic efficiency on large candidate pools', () => {
    // Generate 1,000 synthetic candidates to test scalability and efficiency
    const largePool: CompanionCandidate[] = Array.from({ length: 1000 }, (_, i) => ({
      id: `cand-${i}`,
      verificationState: i % 2 === 0 ? 'APPROVED' : 'IDENTITY_VERIFICATION_PENDING',
      languages: i % 3 === 0 ? ['en', 'es'] : ['fr'],
      interests: ['gardening', 'walking', 'reading', 'cooking'],
      distanceMiles: (i % 25) + 1,
      rating: 4.0 + (i % 10) * 0.1,
      specialCapabilities: i % 5 === 0 ? ['mobility_assistance'] : [],
    }));

    const startTime = performance.now();
    const results = MatchingEngine.generateCandidates(sampleRequirements, largePool, 5);
    const durationMs = performance.now() - startTime;

    expect(results.length).toBe(5);
    // Algorithm must run sub-15ms even for 1,000 candidates
    expect(durationMs).toBeLessThan(15);
  });
});

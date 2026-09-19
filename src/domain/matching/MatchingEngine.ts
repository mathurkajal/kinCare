import { VerificationState } from '../verification/VerificationStateMachine';

export interface CompanionCandidate {
  id: string;
  verificationState: VerificationState;
  languages: string[];
  interests: string[];
  distanceMiles: number; // Approximate
  rating: number;
}

export interface ElderRequirements {
  preferredLanguages: string[];
  interests: string[];
  maxDistanceMiles: number;
}

export class MatchingEngine {
  /**
   * Safely matches an elder with potential volunteers.
   * Time Complexity: O(N log N) where N is the number of eligible candidates due to sorting.
   * Safety eligibility happens strictly BEFORE compatibility scoring.
   */
  public static generateCandidates(
    requirements: ElderRequirements,
    pool: CompanionCandidate[],
    limit: number = 3
  ): CompanionCandidate[] {
    
    // 1. Eligibility Filtering (Strict Safety Check)
    const eligiblePool = pool.filter(candidate => 
      candidate.verificationState === 'APPROVED'
    );

    // 2. Compatibility Scoring
    const scoredCandidates = eligiblePool.map(candidate => {
      let score = 0;
      
      // Language match is heavily weighted
      const hasLanguageMatch = candidate.languages.some(lang => requirements.preferredLanguages.includes(lang));
      if (hasLanguageMatch) score += 50;

      // Interests match
      const sharedInterests = candidate.interests.filter(int => requirements.interests.includes(int));
      score += (sharedInterests.length * 10);

      // Distance penalty (closer is better, but exact address is never used here)
      if (candidate.distanceMiles <= requirements.maxDistanceMiles) {
        score += (requirements.maxDistanceMiles - candidate.distanceMiles);
      } else {
        score -= 100; // Out of range
      }

      // Rating bonus
      score += (candidate.rating * 5);

      return { candidate, score };
    });

    // 3. Ranking & Selection
    return scoredCandidates
      .filter(item => item.score > 0) // Must have at least basic compatibility
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.candidate);
  }
}

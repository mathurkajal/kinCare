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
   * Safety eligibility check strictly gates compatibility scoring:
   * Only candidates with 'APPROVED' verification state are scored.
   * Time Complexity: O(N log N) where N is eligible candidates.
   */
  public static generateCandidates(
    requirements: ElderRequirements,
    pool: CompanionCandidate[],
    limit: number = 3
  ): CompanionCandidate[] {
    if (!pool || pool.length === 0 || limit <= 0) {
      return [];
    }

    const preferredLangs = requirements?.preferredLanguages || [];
    const elderInterests = requirements?.interests || [];
    const maxDist = Math.max(0, requirements?.maxDistanceMiles ?? 10);

    // 1. Eligibility Filtering (Strict Safety Check - zero tolerance for unverified volunteers)
    const eligiblePool = pool.filter(candidate => 
      candidate && candidate.verificationState === 'APPROVED'
    );

    if (eligiblePool.length === 0) {
      return [];
    }

    // 2. Compatibility Scoring
    const scoredCandidates = eligiblePool.map(candidate => {
      let score = 0;
      const candidateLangs = candidate.languages || [];
      const candidateInterests = candidate.interests || [];
      
      // Language match is heavily weighted (comfort and comprehension)
      const hasLanguageMatch = candidateLangs.some(lang => preferredLangs.includes(lang));
      if (hasLanguageMatch) score += 50;

      // Shared interests match (companionship rapport)
      const sharedInterests = candidateInterests.filter(int => elderInterests.includes(int));
      score += (sharedInterests.length * 10);

      // Distance penalty (closer is better, but exact address is never exposed)
      if (candidate.distanceMiles <= maxDist) {
        score += (maxDist - candidate.distanceMiles);
      } else {
        score -= 100; // Out of range penalty
      }

      // Vetted community rating bonus
      score += ((candidate.rating || 0) * 5);

      return { candidate, score };
    });

    // 3. Ranking & Selection
    return scoredCandidates
      .filter(item => item.score > 0) // Must maintain positive net compatibility
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.candidate);
  }
}

import { VerificationState } from '../verification/VerificationStateMachine';

export interface CompanionCandidate {
  id: string;
  verificationState: VerificationState;
  languages: string[];
  interests: string[];
  distanceMiles: number; // Approximate
  rating: number;
  specialCapabilities?: string[]; // e.g. 'mobility_assistance', 'dementia_friendly', 'sign_language'
}

export interface ElderRequirements {
  preferredLanguages: string[];
  interests: string[];
  maxDistanceMiles: number;
  requiredCapabilities?: string[];
}

export class MatchingEngine {
  /**
   * Safely matches an elder with potential volunteers.
   * Safety eligibility check strictly gates compatibility scoring:
   * Only candidates with 'APPROVED' verification state are scored.
   * Uses O(1) Set lookups for rapid multi-attribute matching and bounded top-K ranking.
   */
  public static generateCandidates(
    requirements: ElderRequirements,
    pool: CompanionCandidate[],
    limit: number = 3
  ): CompanionCandidate[] {
    if (!pool || pool.length === 0 || limit <= 0) {
      return [];
    }

    // Convert requirements into O(1) lookup Sets to avoid O(N*M) nested loops
    const preferredLangSet = new Set(requirements?.preferredLanguages || []);
    const elderInterestSet = new Set(requirements?.interests || []);
    const requiredCapSet = new Set(requirements?.requiredCapabilities || []);
    const maxDist = Math.max(0, requirements?.maxDistanceMiles ?? 10);
    const hasRequiredCaps = requiredCapSet.size > 0;

    // 1. Eligibility Filtering (Strict Safety Check - zero tolerance for unverified volunteers)
    const eligiblePool = pool.filter(candidate => 
      candidate && candidate.verificationState === 'APPROVED'
    );

    if (eligiblePool.length === 0) {
      return [];
    }

    // 2. Compatibility Scoring with O(1) Set operations
    const scoredCandidates: { candidate: CompanionCandidate; score: number }[] = [];

    for (let i = 0; i < eligiblePool.length; i++) {
      const candidate = eligiblePool[i];
      let score = 0;
      const candidateLangs = candidate.languages || [];
      const candidateInterests = candidate.interests || [];
      const candidateCaps = candidate.specialCapabilities || [];

      // Language match is heavily weighted (comfort and comprehension)
      let hasLanguageMatch = false;
      for (let j = 0; j < candidateLangs.length; j++) {
        if (preferredLangSet.has(candidateLangs[j])) {
          hasLanguageMatch = true;
          break;
        }
      }
      if (hasLanguageMatch) score += 50;

      // Shared interests match (companionship rapport)
      let sharedCount = 0;
      for (let j = 0; j < candidateInterests.length; j++) {
        if (elderInterestSet.has(candidateInterests[j])) {
          sharedCount++;
        }
      }
      score += (sharedCount * 10);

      // Distance penalty (closer is better, but exact address is never exposed)
      const distance = Math.max(0, candidate.distanceMiles || 0);
      if (distance <= maxDist) {
        score += (maxDist - distance);
      } else {
        score -= 100; // Out of range penalty
      }

      // Vetted community rating bonus
      score += ((candidate.rating || 0) * 5);

      // Special capability accommodations bonus
      if (hasRequiredCaps) {
        let matchedCapsCount = 0;
        for (let j = 0; j < candidateCaps.length; j++) {
          if (requiredCapSet.has(candidateCaps[j])) {
            matchedCapsCount++;
          }
        }
        score += (matchedCapsCount * 30);
        if (matchedCapsCount < requiredCapSet.size) {
          score -= 40 * (requiredCapSet.size - matchedCapsCount);
        }
      }

      // Must maintain positive net compatibility
      if (score > 0) {
        scoredCandidates.push({ candidate, score });
      }
    }

    // 3. Top-K Selection
    scoredCandidates.sort((a, b) => b.score - a.score);

    const results: CompanionCandidate[] = [];
    const maxResults = Math.min(limit, scoredCandidates.length);
    for (let i = 0; i < maxResults; i++) {
      results.push(scoredCandidates[i].candidate);
    }

    return results;
  }
}

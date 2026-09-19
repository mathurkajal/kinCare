import { LruTtlCache } from '../../infrastructure/cache/LruTtlCache';

export interface MessageContext {
  senderId: string;
  senderRole: 'elderly' | 'volunteer' | 'professional';
  receiverId: string;
  content: string;
}

export type RiskLevel = 'SAFE' | 'WARNING' | 'BLOCK' | 'FLAG_FOR_REVIEW';

export interface SafetyResult {
  riskLevel: RiskLevel;
  reason?: string;
  userFacingMessage?: string;
}

export class SafetyEngine {
  // Linear-time, ReDoS-safe heuristic patterns for elder abuse prevention.
  // Patterns avoid nested quantifiers to guarantee O(N) evaluation time.
  private static readonly RESTRICTED_PATTERNS = [
    { pattern: /(otp|password|code|verification pin|login credentials)/i, reason: 'Requesting secure credentials' },
    { pattern: /(send money|gift card|bank account|transfer|crypto|bitcoin|western union|moneygram|wire transfer|zelle|venmo|cash app|\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b)/i, reason: 'Requesting financial transactions' },
    { pattern: /(what is your address|where do you live exactly|give me your home keys)/i, reason: 'Requesting exact location' },
    { pattern: /\b\d{3}-\d{2}-\d{4}\b/, reason: 'Requesting Social Security Number' },
    { pattern: /(grandson|granddaughter|grandchild)[^]{0,100}?(jail|arrested|hospital|accident|bail)/i, reason: 'Grandchild emergency imposter scam' },
    { pattern: /(new medicare card|plastic medicare card|verify your medicare number|medicare refund)/i, reason: 'Medicare identity fraud' },
    { pattern: /(irs audit|back taxes owed|federal tax warrant|irs payment via gift card)/i, reason: 'IRS tax impersonation fraud' },
    { pattern: /(anydesk|teamviewer|quicksupport|ultraviewer|screen connect|logmein|remote control of your pc|remote access)/i, reason: 'Requesting unauthorized remote computer access' },
    { pattern: /(power of attorney|sign over the deed|change your will|make me your beneficiary|inherit your house)/i, reason: 'Requesting legal or inheritance documents' },
    { pattern: /(sell your medication|give me your oxy|percocet|pain pills|narcotics prescription)/i, reason: 'Requesting controlled prescription medications' },
    { pattern: /(you won the lottery|sweepstakes prize winner|processing fee to collect your prize|tax fee before receiving millions)/i, reason: 'Promoting sweepstakes or lottery scams' },
    { pattern: /(power will be cut off|water will be disconnected|pay your utility immediately or shut off)/i, reason: 'Simulating utility disconnection threats' },
    { pattern: /(arrest|police will come|jail|warrant for your arrest|fbi will visit)/i, reason: 'Threatening or coercive language' },
  ];

  // High-efficiency evaluation cache for identical message payloads
  private static readonly evaluationCache = new LruTtlCache<string, SafetyResult>(500, 180_000);

  public static evaluateMessage(message: MessageContext): SafetyResult {
    // Only messages from volunteers to elders require restriction checks
    if (message.senderRole !== 'volunteer') {
      return { riskLevel: 'SAFE' };
    }

    // Defensive input bounding to prevent DoS attacks and memory bloat
    const rawContent = message.content || '';
    const boundedContent = rawContent.length > 4000 ? rawContent.slice(0, 4000) : rawContent;
    const lowerContent = boundedContent.toLowerCase();

    // Cache check for high throughput efficiency
    const cacheKey = `${message.senderRole}:${lowerContent}`;
    const cached = this.evaluationCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    for (const rule of this.RESTRICTED_PATTERNS) {
      if (rule.pattern.test(lowerContent)) {
        const detail = rule.reason.split(' ').pop() || 'sensitive information';
        const result: SafetyResult = {
          riskLevel: 'BLOCK',
          reason: rule.reason,
          userFacingMessage: `Message blocked to protect privacy. Volunteers are not permitted to ask for ${detail}.`
        };
        this.evaluationCache.set(cacheKey, result);
        return result;
      }
    }

    // Check for off-platform communication evasion
    if (/(whatsapp|telegram|signal|facebook|wechat|discord)/i.test(lowerContent)) {
      const result: SafetyResult = {
        riskLevel: 'WARNING',
        reason: 'Attempting to move communication off-platform',
        userFacingMessage: 'For your safety, please keep all communication on the KinCare platform.'
      };
      this.evaluationCache.set(cacheKey, result);
      return result;
    }

    const safeResult: SafetyResult = { riskLevel: 'SAFE' };
    this.evaluationCache.set(cacheKey, safeResult);
    return safeResult;
  }
}

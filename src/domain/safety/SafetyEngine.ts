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
  // Heuristic-based fraud and elder abuse defense engine.
  private static readonly RESTRICTED_PATTERNS = [
    { pattern: /(otp|password|code|verification pin)/i, reason: 'Requesting secure credentials' },
    { pattern: /(send money|gift card|bank account|transfer|crypto|bitcoin|western union|moneygram|\b(?:\d{4}[- ]?){3}\d{4}\b)/i, reason: 'Requesting financial transactions' },
    { pattern: /(what is your address|where do you live exactly)/i, reason: 'Requesting exact location' },
    { pattern: /\b\d{3}-\d{2}-\d{4}\b/, reason: 'Requesting Social Security Number' },
    { pattern: /(arrest|police will come|jail|warrant for your arrest)/i, reason: 'Threatening or coercive language' },
  ];

  public static evaluateMessage(message: MessageContext): SafetyResult {
    // We strictly evaluate messages from volunteers to elders to prevent exploitation.
    if (message.senderRole === 'volunteer') {
      const lowerContent = (message.content || '').toLowerCase();
      
      for (const rule of this.RESTRICTED_PATTERNS) {
        if (rule.pattern.test(lowerContent)) {
          const detail = rule.reason.split(' ').pop() || 'sensitive information';
          return {
            riskLevel: 'BLOCK',
            reason: rule.reason,
            userFacingMessage: `Message blocked to protect privacy. Volunteers are not permitted to ask for ${detail}.`
          };
        }
      }
      
      // If attempting to move communication off-platform to avoid auditing
      if (/(whatsapp|telegram|signal|facebook|wechat|discord)/i.test(lowerContent)) {
        return {
          riskLevel: 'WARNING',
          reason: 'Attempting to move communication off-platform',
          userFacingMessage: 'For your safety, please keep all communication on the KinCare platform.'
        };
      }
    }

    return { riskLevel: 'SAFE' };
  }
}

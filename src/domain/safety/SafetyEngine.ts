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
  // Simple heuristic-based fraud detection for demonstration.
  // In production, this would be backed by ML and Strategy pattern.
  private static readonly RESTRICTED_PATTERNS = [
    { pattern: /(otp|password|code|verification pin)/i, reason: 'Requesting secure credentials' },
    { pattern: /(send money|gift card|bank account|transfer)/i, reason: 'Requesting financial transactions' },
    { pattern: /(what is your address|where do you live exactly)/i, reason: 'Requesting exact location' },
  ];

  public static evaluateMessage(message: MessageContext): SafetyResult {
    // We strictly evaluate messages from volunteers to elders.
    if (message.senderRole === 'volunteer') {
      const lowerContent = message.content.toLowerCase();
      
      for (const rule of this.RESTRICTED_PATTERNS) {
        if (rule.pattern.test(lowerContent)) {
          return {
            riskLevel: 'BLOCK',
            reason: rule.reason,
            userFacingMessage: `Message blocked to protect privacy. Volunteers are not permitted to ask for ${rule.reason.split(' ').pop()}.`
          };
        }
      }
      
      // If asking for external communication apps
      if (/(whatsapp|telegram|signal|facebook)/i.test(lowerContent)) {
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

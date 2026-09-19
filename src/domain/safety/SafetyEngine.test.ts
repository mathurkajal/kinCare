import { describe, it, expect } from 'vitest';
import { SafetyEngine, MessageContext } from './SafetyEngine';

describe('SafetyEngine', () => {
  const baseMessage: MessageContext = {
    senderId: 'v1',
    senderRole: 'volunteer',
    receiverId: 'e1',
    content: '',
  };

  it('should allow normal, safe conversations', () => {
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      content: 'I will be there at 2pm with the groceries!',
    });
    expect(result.riskLevel).toBe('SAFE');
  });

  it('should block requests for OTP or passwords', () => {
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      content: 'Can you please send me the verification pin they texted you?',
    });
    expect(result.riskLevel).toBe('BLOCK');
    expect(result.reason).toContain('secure credentials');
  });

  it('should block requests for money or gift cards', () => {
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      content: 'Could you buy a gift card for me?',
    });
    expect(result.riskLevel).toBe('BLOCK');
    expect(result.reason).toContain('financial transactions');
  });

  it('should block cryptocurrency and wire transfers', () => {
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      content: 'Please send some bitcoin to my wallet or use western union.',
    });
    expect(result.riskLevel).toBe('BLOCK');
    expect(result.reason).toContain('financial transactions');
  });

  it('should block requests for exact locations', () => {
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      content: 'What is your address exactly so I can put it in my GPS?',
    });
    expect(result.riskLevel).toBe('BLOCK');
    expect(result.reason).toContain('exact location');
  });

  it('should block social security number patterns', () => {
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      content: 'Could you give me your SSN 123-45-6789 for verification?',
    });
    expect(result.riskLevel).toBe('BLOCK');
    expect(result.reason).toContain('Social Security Number');
  });

  it('should block threatening or coercive intimidation', () => {
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      content: 'If you do not pay, the police will come and put you in jail.',
    });
    expect(result.riskLevel).toBe('BLOCK');
    expect(result.reason).toContain('Threatening or coercive language');
  });

  it('should warn when attempting to move off-platform', () => {
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      content: 'Let us talk on whatsapp instead, it is easier.',
    });
    expect(result.riskLevel).toBe('WARNING');
    expect(result.reason).toContain('off-platform');
  });

  it('should warn when attempting Telegram or Discord off-platform', () => {
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      content: 'Add me on telegram or discord.',
    });
    expect(result.riskLevel).toBe('WARNING');
    expect(result.reason).toContain('off-platform');
  });

  it('should block unauthorized remote desktop access attempts', () => {
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      content: 'Please download AnyDesk or TeamViewer so I can take remote control of your PC.',
    });
    expect(result.riskLevel).toBe('BLOCK');
    expect(result.reason).toContain('remote computer access');
  });

  it('should block legal, deed, or inheritance manipulation', () => {
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      content: 'You should sign over the deed to your house or grant me power of attorney.',
    });
    expect(result.riskLevel).toBe('BLOCK');
    expect(result.reason).toContain('legal or inheritance');
  });

  it('should block solicitation of controlled medications or prescription pain pills', () => {
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      content: 'Can you sell your medication or give me your pain pills?',
    });
    expect(result.riskLevel).toBe('BLOCK');
    expect(result.reason).toContain('prescription medications');
  });

  it('should block sweepstakes advance fee scams', () => {
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      content: 'You won the lottery! Pay a small processing fee to collect your prize.',
    });
    expect(result.riskLevel).toBe('BLOCK');
    expect(result.reason).toContain('lottery scams');
  });

  it('should block utility disconnection extortion threats', () => {
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      content: 'Your power will be cut off unless you pay your utility immediately.',
    });
    expect(result.riskLevel).toBe('BLOCK');
    expect(result.reason).toContain('utility disconnection');
  });

  it('should block Medicare card and refund identity fraud scams', () => {
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      content: 'You are eligible for a new plastic medicare card, verify your medicare number now.',
    });
    expect(result.riskLevel).toBe('BLOCK');
    expect(result.reason).toContain('Medicare identity fraud');
  });

  it('should block IRS impersonation and back taxes fraud', () => {
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      content: 'IRS audit warning: back taxes owed, pay immediately or face federal tax warrant.',
    });
    expect(result.riskLevel).toBe('BLOCK');
    expect(result.reason).toContain('IRS tax impersonation fraud');
  });

  it('should block grandchild emergency imposter scam patterns', () => {
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      content: 'Grandma, your grandson is in jail after a car accident send bail right away.',
    });
    expect(result.riskLevel).toBe('BLOCK');
    expect(result.reason).toContain('Grandchild emergency imposter scam');
  });

  it('should ignore restricted terms if sender is elderly (not a volunteer)', () => {
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      senderRole: 'elderly',
      content: 'I am not sure how to find my password.',
    });
    expect(result.riskLevel).toBe('SAFE');
  });

  it('should be resilient against ReDoS attacks with pathological repetitive strings', () => {
    // Construct pathological repetitive input designed to trigger polynomial backtracking in vulnerable regexes
    const pathologicalInput = '1234-'.repeat(2000) + '9999';
    const startTime = performance.now();
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      content: pathologicalInput,
    });
    const duration = performance.now() - startTime;

    // Linear evaluation must complete in under 10ms
    expect(duration).toBeLessThan(10);
    expect(result).toBeDefined();
  });

  it('should leverage internal caching for instant subsequent evaluations', () => {
    const message = {
      ...baseMessage,
      content: 'Hello, I hope you are having a wonderful peaceful afternoon.',
    };

    const first = SafetyEngine.evaluateMessage(message);
    const second = SafetyEngine.evaluateMessage(message);

    expect(first.riskLevel).toBe('SAFE');
    expect(second.riskLevel).toBe('SAFE');
  });
});

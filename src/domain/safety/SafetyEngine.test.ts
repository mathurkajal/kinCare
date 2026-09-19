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

  it('should block requests for exact locations', () => {
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      content: 'What is your address exactly so I can put it in my GPS?',
    });
    expect(result.riskLevel).toBe('BLOCK');
    expect(result.reason).toContain('exact location');
  });

  it('should warn when attempting to move off-platform', () => {
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      content: 'Let us talk on whatsapp instead, it is easier.',
    });
    expect(result.riskLevel).toBe('WARNING');
    expect(result.reason).toContain('off-platform');
  });

  it('should ignore restricted terms if sender is elderly (not a volunteer)', () => {
    const result = SafetyEngine.evaluateMessage({
      ...baseMessage,
      senderRole: 'elderly',
      content: 'I am not sure how to find my password.',
    });
    expect(result.riskLevel).toBe('SAFE');
  });
});

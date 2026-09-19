import { describe, it, expect } from 'vitest';
import { IntentRecognitionEngine } from './voiceAssistant';

describe('IntentRecognitionEngine', () => {
  const engine = new IntentRecognitionEngine();

  it('classifies navigation intents accurately with low risk level', () => {
    const homeIntent = engine.classify('take me to the living room');
    expect(homeIntent?.intentId).toBe('nav_home');
    expect(homeIntent?.riskLevel).toBe('low');

    const trustedIntent = engine.classify('show my trusted people circle');
    expect(trustedIntent?.intentId).toBe('nav_trusted');
    expect(trustedIntent?.riskLevel).toBe('low');

    const storiesIntent = engine.classify('i want to tell a story');
    expect(storiesIntent?.intentId).toBe('nav_stories');
  });

  it('classifies read aloud intent with low risk level', () => {
    const readIntent = engine.classify('read this to me please');
    expect(readIntent?.intentId).toBe('read_page');
    expect(readIntent?.riskLevel).toBe('low');
  });

  it('classifies assistance requests with medium risk and required confirmation text', () => {
    const helpIntent = engine.classify('i need help with groceries');
    expect(helpIntent?.intentId).toBe('request_help');
    expect(helpIntent?.riskLevel).toBe('medium');
    expect(helpIntent?.requiredConfirmationText).toBeDefined();
  });

  it('classifies emergency SOS intents with critical risk level', () => {
    const sosIntent = engine.classify('emergency urgent help call 911');
    expect(sosIntent?.intentId).toBe('emergency_sos');
    expect(sosIntent?.riskLevel).toBe('critical');
    expect(sosIntent?.requiredConfirmationText).toContain('urgent medical help');
  });

  it('returns null for unrecognized chatter', () => {
    expect(engine.classify('the weather is nice today')).toBeNull();
  });
});

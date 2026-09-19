// Voice Assistant Architecture
// Abstract pipeline:
// VoiceAssistant -> SpeechRecognitionProvider -> IntentRecognition -> CommandValidator -> PermissionCheck -> Action -> VoiceConfirmation

export type CommandRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface VoiceIntent {
  intentId: string;
  actionName: string;
  category: 'navigation' | 'communication' | 'assistance' | 'read_aloud' | 'settings' | 'security';
  riskLevel: CommandRiskLevel;
  requiredConfirmationText?: string;
  parameters?: Record<string, any>;
}

export interface VoiceConfirmationRequest {
  intent: VoiceIntent;
  promptText: string;
  actionToExecute: () => void;
  onCancel?: () => void;
}

export interface SpeechRecognitionProvider {
  isSupported: () => boolean;
  startListening: (onResult: (transcript: string) => void, onError: (err: any) => void) => void;
  stopListening: () => void;
}

// Default Browser Web Speech API Provider with graceful fallback
export class BrowserSpeechRecognitionProvider implements SpeechRecognitionProvider {
  private recognition: any = null;

  isSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  startListening(onResult: (transcript: string) => void, onError: (err: any) => void): void {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      onError(new Error('Speech recognition not supported in this browser'));
      return;
    }

    try {
      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult && lastResult[0]) {
          const text = lastResult[0].transcript.trim();
          onResult(text);
        }
      };

      this.recognition.onerror = (e: any) => {
        onError(e);
      };

      this.recognition.start();
    } catch (e) {
      onError(e);
    }
  }

  stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.recognition = null;
    }
  }
}

// Intent Recognition Engine
export class IntentRecognitionEngine {
  classify(phrase: string): VoiceIntent | null {
    const p = phrase.toLowerCase().trim();

    // 1. Navigation (Low Risk)
    if (p.includes('go home') || p.includes('home page') || p.includes('living room')) {
      return {
        intentId: 'nav_home',
        actionName: 'Go Home',
        category: 'navigation',
        riskLevel: 'low',
      };
    }

    if (p.includes('trusted people') || p.includes('my circle') || p.includes('my contacts')) {
      return {
        intentId: 'nav_trusted',
        actionName: 'Open Trusted People',
        category: 'navigation',
        riskLevel: 'low',
      };
    }

    if (p.includes('my stories') || p.includes('open stories') || p.includes('tell a story') || p.includes('family memory')) {
      return {
        intentId: 'nav_stories',
        actionName: 'Open My Stories',
        category: 'navigation',
        riskLevel: 'low',
      };
    }

    if (p.includes('my wishes') || p.includes('open wishes') || p.includes('cherished dream')) {
      return {
        intentId: 'nav_wishes',
        actionName: 'Open My Wishes',
        category: 'navigation',
        riskLevel: 'low',
      };
    }

    if (p.includes('settings') || p.includes('preferences') || p.includes('text size') || p.includes('volume')) {
      return {
        intentId: 'nav_settings',
        actionName: 'Open Settings',
        category: 'navigation',
        riskLevel: 'low',
      };
    }

    // 2. Read Aloud (Low Risk)
    if (p.includes('read this') || p.includes('read aloud') || p.includes('read to me') || p.includes('speak this page')) {
      return {
        intentId: 'read_page',
        actionName: 'Read Current Page Aloud',
        category: 'read_aloud',
        riskLevel: 'low',
      };
    }

    // 3. Talk to someone (Low-to-Medium Risk)
    if (p.includes('talk to someone') || p.includes('friendly talk') || p.includes('companion') || p.includes('chat with someone')) {
      return {
        intentId: 'talk_companion',
        actionName: 'Open Friendly Conversation',
        category: 'communication',
        riskLevel: 'low',
      };
    }

    // 4. Everyday Help Request (Medium Risk - requires confirmation)
    if (p.includes('i need help') || p.includes('need groceries') || p.includes('ask for help') || p.includes('helping hand')) {
      return {
        intentId: 'request_help',
        actionName: 'Request Everyday Helping Hand',
        category: 'assistance',
        riskLevel: 'medium',
        requiredConfirmationText: 'You asked for everyday help with groceries or companionship. Would you like to open the request form now?',
      };
    }

    // 5. Calling trusted family (Medium Risk)
    if (p.includes('call my son') || p.includes('call david') || p.includes('call my daughter') || p.includes('call family')) {
      return {
        intentId: 'call_guardian',
        actionName: 'Call Primary Family Guardian',
        category: 'communication',
        riskLevel: 'medium',
        requiredConfirmationText: 'Would you like to initiate a phone call with your family contact right now?',
      };
    }

    // 6. High Risk: Location Sharing or PIN disclosure
    if (p.includes('share my location') || p.includes('share address') || p.includes('where am i')) {
      return {
        intentId: 'share_location',
        actionName: 'Share Home Location with Volunteer',
        category: 'security',
        riskLevel: 'high',
        requiredConfirmationText: 'You are about to share your home location with a verified volunteer. Do you want to continue?',
      };
    }

    // 7. Critical: Emergency SOS or Account Deletion
    if (p.includes('emergency') || p.includes('urgent help') || p.includes('call 911') || p.includes('send sos')) {
      return {
        intentId: 'emergency_sos',
        actionName: 'Trigger Urgent Emergency Assistance',
        category: 'assistance',
        riskLevel: 'critical',
        requiredConfirmationText: 'Are you in danger or do you need urgent medical help? We will immediately notify your son David and emergency responders.',
      };
    }

    return null;
  }
}

// Global Voice Assistant Controller
export class VoiceAssistantService {
  private speechProvider: SpeechRecognitionProvider;
  private intentEngine: IntentRecognitionEngine;
  private isListening = false;
  private onIntentDetected?: (intent: VoiceIntent, requiresConfirmation: boolean) => void;

  constructor(provider?: SpeechRecognitionProvider) {
    this.speechProvider = provider || new BrowserSpeechRecognitionProvider();
    this.intentEngine = new IntentRecognitionEngine();
  }

  isSupported(): boolean {
    return this.speechProvider.isSupported();
  }

  start(onIntent: (intent: VoiceIntent, requiresConfirmation: boolean) => void, onError: (err: any) => void): void {
    if (this.isListening) return;
    this.onIntentDetected = onIntent;
    this.isListening = true;

    this.speechProvider.startListening(
      (transcript) => {
        const intent = this.intentEngine.classify(transcript);
        if (intent && this.onIntentDetected) {
          const requiresConfirmation = intent.riskLevel !== 'low';
          this.onIntentDetected(intent, requiresConfirmation);
        }
      },
      (err) => {
        onError(err);
      }
    );
  }

  stop(): void {
    this.isListening = false;
    this.speechProvider.stopListening();
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}

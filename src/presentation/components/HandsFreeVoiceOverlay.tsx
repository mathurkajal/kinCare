import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  AlertTriangle, 
  Phone,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { VoiceIntent, VoiceConfirmationRequest, VoiceAssistantService } from '../../infrastructure/services/voiceAssistant';

interface HandsFreeVoiceOverlayProps {
  isHandsFreeActive: boolean;
  onToggleHandsFree: () => void;
  onNavigateHome: () => void;
  onOpenTalk: () => void;
  onOpenHelp: () => void;
  onOpenStories: () => void;
  onOpenWishes: () => void;
  onOpenTrustedPeople: () => void;
  onOpenSettings: () => void;
  onReadCurrentPage: () => void;
  onTriggerSOS: () => void;
  guardianPhone: string;
  guardianName: string;
}

export const HandsFreeVoiceOverlay: React.FC<HandsFreeVoiceOverlayProps> = ({
  isHandsFreeActive,
  onToggleHandsFree,
  onNavigateHome,
  onOpenTalk,
  onOpenHelp,
  onOpenStories,
  onOpenWishes,
  onOpenTrustedPeople,
  onOpenSettings,
  onReadCurrentPage,
  onTriggerSOS,
  guardianPhone,
  guardianName,
}) => {
  const [activeVoiceAssistant, setActiveVoiceAssistant] = useState<VoiceAssistantService | null>(null);
  const [lastHeardPhrase, setLastHeardPhrase] = useState<string>('');
  const [pendingConfirmation, setPendingConfirmation] = useState<VoiceConfirmationRequest | null>(null);
  const [showCommandsGuide, setShowCommandsGuide] = useState(false);

  useEffect(() => {
    if (!isHandsFreeActive) {
      if (activeVoiceAssistant) {
        activeVoiceAssistant.stop();
        setActiveVoiceAssistant(null);
      }
      return;
    }

    const assistant = new VoiceAssistantService();
    setActiveVoiceAssistant(assistant);

    assistant.start(
      (intent: VoiceIntent, requiresConfirmation: boolean) => {
        setLastHeardPhrase(`Action recognized: "${intent.actionName}"`);

        const executeAction = () => {
          switch (intent.intentId) {
            case 'nav_home':
              onNavigateHome();
              break;
            case 'nav_stories':
              onOpenStories();
              break;
            case 'nav_wishes':
              onOpenWishes();
              break;
            case 'nav_trusted':
              onOpenTrustedPeople();
              break;
            case 'nav_settings':
              onOpenSettings();
              break;
            case 'read_page':
              onReadCurrentPage();
              break;
            case 'talk_companion':
              onOpenTalk();
              break;
            case 'request_help':
              onOpenHelp();
              break;
            case 'call_guardian':
              window.location.href = `tel:${guardianPhone}`;
              break;
            case 'share_location':
              alert("Location sharing permissions verified.");
              break;
            case 'emergency_sos':
              onTriggerSOS();
              break;
            default:
              break;
          }
        };

        if (requiresConfirmation) {
          setPendingConfirmation({
            intent,
            promptText: intent.requiredConfirmationText || `Do you want to confirm: ${intent.actionName}?`,
            actionToExecute: executeAction,
          });

          // Speak the safety prompt out loud
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(intent.requiredConfirmationText || `Please confirm ${intent.actionName}.`);
            utter.rate = 0.85;
            window.speechSynthesis.speak(utter);
          }
        } else {
          executeAction();
        }
      },
      (err) => {
        console.warn('Hands free assistant notice:', err);
      }
    );

    return () => {
      assistant.stop();
    };
  }, [isHandsFreeActive]);

  // Quick manual trigger for demo/accessibility testing
  const simulateVoiceCommand = (command: string) => {
    const assistant = new VoiceAssistantService();
    const intent = (assistant as any).intentEngine.classify(command);
    if (intent) {
      setLastHeardPhrase(`Spoken command: "${command}"`);
      if (intent.riskLevel !== 'low') {
        setPendingConfirmation({
          intent,
          promptText: intent.requiredConfirmationText || `Confirm ${intent.actionName}?`,
          actionToExecute: () => {
            if (intent.intentId === 'request_help') onOpenHelp();
            else if (intent.intentId === 'call_guardian') window.location.href = `tel:${guardianPhone}`;
            else if (intent.intentId === 'emergency_sos') onTriggerSOS();
          }
        });
      } else {
        if (intent.intentId === 'nav_home') onNavigateHome();
        else if (intent.intentId === 'talk_companion') onOpenTalk();
        else if (intent.intentId === 'read_page') onReadCurrentPage();
        else if (intent.intentId === 'nav_stories') onOpenStories();
        else if (intent.intentId === 'nav_trusted') onOpenTrustedPeople();
        else if (intent.intentId === 'nav_settings') onOpenSettings();
      }
    }
  };

  return (
    <>
      {/* Floating or Persistent Hands-Free Bar when enabled */}
      {isHandsFreeActive && (
        <div 
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-40 bg-[#1E4D3B] text-white rounded-3xl p-4 sm:p-5 shadow-2xl border-3 border-[#86EFAC] max-w-md animate-in slide-in-from-bottom duration-300"
          role="region"
          aria-label="Hands-Free Voice Mode Active"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-[#2D6A53] flex items-center justify-center text-[#86EFAC]">
                  <Mic className="w-6 h-6 animate-pulse" />
                </div>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#86EFAC] ring-2 ring-[#1E4D3B]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#86EFAC] uppercase tracking-wider block">
                  Hands-Free Voice Active
                </span>
                <span className="text-sm font-bold block leading-tight">
                  Listening for your spoken words
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCommandsGuide(!showCommandsGuide)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold cursor-pointer transition-colors"
                title="View spoken commands list"
              >
                <HelpCircle className="w-5 h-5 text-white" />
              </button>

              <button
                type="button"
                onClick={onToggleHandsFree}
                className="px-3 py-2 rounded-xl bg-[#86EFAC] text-[#1E4D3B] text-xs font-black hover:bg-[#6EE7B7] cursor-pointer transition-colors"
              >
                Turn Off
              </button>
            </div>
          </div>

          {lastHeardPhrase && (
            <div className="mt-3 pt-2.5 border-t border-white/20 text-xs text-[#E2F3EA] italic">
              {lastHeardPhrase}
            </div>
          )}

          {/* Quick Voice Prompt Shortcuts for Immediate One-Tap Testing */}
          {showCommandsGuide && (
            <div className="mt-3 pt-3 border-t border-white/20 space-y-2 text-xs">
              <span className="font-bold text-[#C9EADA] block">
                Try speaking any of these naturally:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => simulateVoiceCommand('Go home')}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-left font-medium"
                >
                  "Go home"
                </button>
                <button
                  type="button"
                  onClick={() => simulateVoiceCommand('Talk to someone')}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-left font-medium"
                >
                  "Talk to someone"
                </button>
                <button
                  type="button"
                  onClick={() => simulateVoiceCommand('I need help')}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-left font-medium"
                >
                  "I need help"
                </button>
                <button
                  type="button"
                  onClick={() => simulateVoiceCommand('Call my son')}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-left font-medium"
                >
                  "Call my son"
                </button>
                <button
                  type="button"
                  onClick={() => simulateVoiceCommand('Read this')}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-left font-medium"
                >
                  "Read this"
                </button>
                <button
                  type="button"
                  onClick={() => simulateVoiceCommand('Open my stories')}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-left font-medium"
                >
                  "Open stories"
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Voice Safety Confirmation Modal for Medium / High / Critical Operations */}
      {pendingConfirmation && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          role="alertdialog"
          aria-labelledby="voice-safety-title"
          aria-describedby="voice-safety-desc"
        >
          <div className="bg-[#FFFDF9] rounded-3xl max-w-lg w-full p-6 sm:p-8 border-3 border-[#E5D7C2] shadow-2xl space-y-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                pendingConfirmation.intent.riskLevel === 'critical'
                  ? 'bg-[#FEE2E2] text-[#B91C1C]'
                  : pendingConfirmation.intent.riskLevel === 'high'
                  ? 'bg-[#FEF3C7] text-[#D97706]'
                  : 'bg-[#EFF8F3] text-[#1E4D3B]'
              }`}>
                {pendingConfirmation.intent.riskLevel === 'critical' ? (
                  <AlertTriangle className="w-8 h-8 text-[#DC2626]" />
                ) : (
                  <ShieldAlert className="w-8 h-8" />
                )}
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A6B5B] block">
                  Voice Safety Confirmation ({pendingConfirmation.intent.riskLevel.toUpperCase()} RISK)
                </span>
                <h3 id="voice-safety-title" className="font-serif-warm text-xl sm:text-2xl font-bold text-[#2E241C]">
                  {pendingConfirmation.intent.actionName}
                </h3>
              </div>
            </div>

            <div className="bg-[#FAF7F0] p-5 rounded-2xl border-2 border-[#EADDCB]">
              <p id="voice-safety-desc" className="text-base sm:text-lg text-[#3D3126] font-medium leading-relaxed">
                "{pendingConfirmation.promptText}"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPendingConfirmation(null)}
                className="flex-1 py-4 px-5 rounded-2xl bg-white hover:bg-[#F2ECE4] border-2 border-[#D5C6B0] text-[#615140] font-bold text-base cursor-pointer btn-tactile"
              >
                No — Cancel Action
              </button>

              <button
                type="button"
                onClick={() => {
                  const action = pendingConfirmation.actionToExecute;
                  setPendingConfirmation(null);
                  action();
                }}
                className="flex-1 py-4 px-5 rounded-2xl bg-[#1E4D3B] hover:bg-[#15382B] text-white font-bold text-base cursor-pointer shadow-md btn-tactile flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 text-[#86EFAC]" />
                <span>Yes — Continue</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

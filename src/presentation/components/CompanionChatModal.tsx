import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Volume2, 
  VolumeX, 
  Heart, 
  Sparkles, 
  UserCheck, 
  Coffee, 
  Mic,
  RotateCcw,
  Square
} from 'lucide-react';
import { SeniorProfile } from '../../shared/types';
import { VoiceInputReview } from './VoiceInputReview';

interface CompanionChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  senior: SeniorProfile;
  onRequestHumanCompanion: () => void;
}

interface Message {
  sender: 'companion' | 'senior';
  text: string;
}

export const CompanionChatModal: React.FC<CompanionChatModalProps> = ({
  isOpen,
  onClose,
  senior,
  onRequestHumanCompanion,
}) => {
  if (!isOpen) return null;

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'companion',
      text: `Hello ${senior.preferredName}. It is so lovely to sit with you today. There is no rush at all. What is on your mind or in your heart? Would you like to talk about a favorite memory, or simply chat about your day?`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const speakText = (text: string) => {
    if (speechEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const newHistory = [...messages, { sender: 'senior' as const, text: textToSend }];
    setMessages(newHistory);
    setLoading(true);

    try {
      const response = await fetch('/api/companion-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: newHistory,
          seniorName: senior.preferredName,
        }),
      });

      const data = await response.json();
      const reply = data.reply || `It is always a comfort to hear your voice, ${senior.preferredName}. Tell me more about that.`;

      setMessages(prev => [...prev, { sender: 'companion', text: reply }]);
      speakText(reply);
    } catch (err) {
      console.error(err);
      const fallback = `Thank you for sharing that with me, ${senior.preferredName}. You have such wonderful life stories and strength. What brought you the most joy this morning?`;
      setMessages(prev => [...prev, { sender: 'companion', text: fallback }]);
      speakText(fallback);
    } finally {
      setLoading(false);
    }
  };

  const easyTapPrompts = [
    'Tell me a peaceful story about nature or gardens',
    'What was life like fifty years ago?',
    'I feel a little quiet today and just want to listen',
    'How do I make my favorite childhood lemon tea?'
  ];

  return (
    <div 
      id="companion-chat-modal"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-labelledby="companion-modal-title"
    >
      <div className="bg-[#FAF6F0] rounded-3xl max-w-2xl w-full border-2 border-[#EADCCB] shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        {/* Warm Cozy Header */}
        <div className="bg-[#FFFDF9] px-6 py-4 border-b-2 border-[#EFE5D6] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF5F0] text-[#1E4D3B] flex items-center justify-center border border-[#CDE5DC] shadow-xs">
              <Coffee className="w-6 h-6 text-[#1E4D3B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="companion-modal-title" className="font-serif-warm font-bold text-[#1E4D3B] text-xl">
                  KinCare Hearthside Companion
                </h3>
                <span className="text-xs bg-[#EFF8F3] text-[#1E4D3B] font-bold px-2.5 py-0.5 rounded-full border border-[#C9E7D7]">
                  Patient Listener
                </span>
              </div>
              <p className="text-xs text-[#7A6B5B]">
                Gentle conversation • No typing required • Speak naturally
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSpeechEnabled(!speechEnabled);
                if (speechEnabled && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`p-2 sm:px-3 sm:py-2 rounded-2xl border-2 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 btn-tactile ${
                speechEnabled ? 'bg-[#1E4D3B] border-[#1E4D3B] text-white' : 'bg-white border-[#DFD8CC] text-[#7B8B88]'
              }`}
              title="Toggle Voice Reading"
            >
              {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{speechEnabled ? 'Voice: On' : 'Voice: Off'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-3 py-2 rounded-2xl border-2 border-[#E5D7C2] bg-white text-xs font-bold text-[#615140] hover:bg-[#F2ECE4] cursor-pointer btn-tactile"
              aria-label="Close chat and go back"
            >
              Close
            </button>
          </div>
        </div>

        {/* Real Human Companion Callout */}
        <div className="bg-[#EFF8F3] px-6 py-3 border-b border-[#CBE7D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-[#1E4D3B]">
          <span className="flex items-center gap-2 font-medium">
            <UserCheck className="w-4 h-4 text-[#1E4D3B] shrink-0" />
            Prefer to have a real human neighbor visit for tea and conversation?
          </span>
          <button
            onClick={() => {
              onClose();
              onRequestHumanCompanion();
            }}
            className="font-bold underline cursor-pointer hover:text-[#143528]"
          >
            Request Neighbor Tea Visit →
          </button>
        </div>

        {/* Conversation Message Feed */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-[#FAF6F0]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'senior' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[82%] rounded-3xl p-4 sm:p-5 text-base sm:text-lg leading-relaxed ${
                  m.sender === 'senior'
                    ? 'bg-[#1E4D3B] text-white rounded-br-xs shadow-xs font-medium'
                    : 'bg-white text-[#332A24] border-2 border-[#EAE0D2] rounded-bl-xs shadow-xs'
                }`}
              >
                {m.text}

                {m.sender === 'companion' && (
                  <div className="mt-3 pt-2.5 border-t border-[#F2ECE2] flex justify-end">
                    <button
                      onClick={() => speakText(m.text)}
                      className="text-xs sm:text-sm text-[#1E4D3B] font-bold flex items-center gap-1.5 hover:underline cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" /> Hear this message aloud
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border-2 border-[#EAE0D2] rounded-2xl p-4 text-sm text-[#736352] flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-[#1E4D3B]" />
                Listening warmly and reflecting with you...
              </div>
            </div>
          )}
        </div>

        {/* Voice Input with Review and Confirm (Never Forces Typing) */}
        <div className="p-4 sm:p-5 bg-white border-t-2 border-[#EFE5D6]">
          <VoiceInputReview
            title="What would you like to say?"
            subtitle="You can speak naturally. We will write it for you."
            confirmLabel="Confirm & Send to Companion"
            suggestedPhrases={easyTapPrompts}
            onConfirm={(text) => handleSend(text)}
          />
        </div>
      </div>
    </div>
  );
};

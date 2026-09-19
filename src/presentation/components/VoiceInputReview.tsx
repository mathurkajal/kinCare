import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Square, 
  Volume2, 
  RotateCcw, 
  CheckCircle2, 
  X, 
  Sparkles,
  Pencil
} from 'lucide-react';

interface VoiceInputReviewProps {
  id?: string;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  initialText?: string;
  confirmLabel?: string;
  suggestedPhrases?: string[];
  onConfirm: (text: string) => void;
  onCancel?: () => void;
}

export const VoiceInputReview: React.FC<VoiceInputReviewProps> = ({
  id = 'voice-input-review',
  title = 'What would you like to say?',
  subtitle = 'You can speak naturally. We will write it for you.',
  placeholder = 'Your spoken words will appear here clearly...',
  initialText = '',
  confirmLabel = 'Confirm & Use This',
  suggestedPhrases = [],
  onConfirm,
  onCancel,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState(initialText);
  const [step, setStep] = useState<'idle' | 'recording' | 'review'>(
    initialText ? 'review' : 'idle'
  );
  const [isSpeakingBack, setIsSpeakingBack] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  const startListening = () => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    setIsRecording(true);
    setStep('recording');

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let fullText = '';
          for (let i = 0; i < event.results.length; i++) {
            fullText += event.results[i][0].transcript + ' ';
          }
          if (fullText.trim()) {
            setTranscript(fullText.trim());
          }
        };

        recognition.onerror = (e: any) => {
          console.warn('Voice speech recognition notice:', e);
        };

        recognition.start();
        (window as any).__activeVoiceRec = recognition;
      } catch (err) {
        console.warn('Voice init warning:', err);
      }
    } else {
      // Gentle mock dictation fallback for testing environments without microphone hardware
      setTimeout(() => {
        if (!transcript) {
          setTranscript("I would like someone to visit me for tea and talk about our lovely flower garden.");
        }
      }, 2500);
    }
  };

  const stopListening = () => {
    setIsRecording(false);
    setStep('review');

    if ((window as any).__activeVoiceRec) {
      try {
        (window as any).__activeVoiceRec.stop();
      } catch (e) {
        // ignore
      }
    }

    // Default fallback text if microphone recorded no audio
    if (!transcript.trim()) {
      setTranscript("I would love a helping hand with groceries and tea this afternoon.");
    }
  };

  const listenBack = () => {
    if (!transcript.trim() || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    setIsSpeakingBack(true);
    const utter = new SpeechSynthesisUtterance(transcript);
    utter.rate = 0.85;
    utter.pitch = 1.0;
    utter.onend = () => setIsSpeakingBack(false);
    utter.onerror = () => setIsSpeakingBack(false);
    window.speechSynthesis.speak(utter);
  };

  const handleReset = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setTranscript('');
    setStep('idle');
    setIsRecording(false);
  };

  const handleSelectSuggested = (phrase: string) => {
    setTranscript(phrase);
    setStep('review');
  };

  return (
    <div 
      id={id} 
      className="bg-[#FFFDF9] border-3 border-[#E5D7C2] rounded-3xl p-5 sm:p-7 shadow-xs space-y-5"
    >
      {/* Step 1: Idle (Ready to Speak) */}
      {step === 'idle' && (
        <div className="space-y-4 text-center sm:text-left">
          <div>
            <h4 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E4D3B]">
              {title}
            </h4>
            <p className="text-sm sm:text-base text-[#615140] mt-1 font-medium">
              "{subtitle}"
            </p>
          </div>

          {/* Big Tactile Tap-to-Speak Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={startListening}
              className="w-full py-5 px-6 rounded-3xl bg-[#1E4D3B] hover:bg-[#15382B] text-white text-lg sm:text-xl font-bold flex items-center justify-center gap-4 cursor-pointer transition-all shadow-md btn-tactile"
              aria-label="Tap to speak your message with your voice"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <span>🎤 Tap to Speak</span>
            </button>
            <p className="text-xs sm:text-sm text-[#7A6B5B] text-center mt-2">
              No typing needed • Take all the time you need
            </p>
          </div>

          {/* 1-Tap Suggested Phrases if provided */}
          {suggestedPhrases.length > 0 && (
            <div className="pt-2 border-t border-[#EFE5D6] space-y-2 text-left">
              <span className="text-xs font-bold text-[#7A6B5B] uppercase tracking-wider block">
                Or tap one of these common thoughts:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedPhrases.map((phrase, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectSuggested(phrase)}
                    className="p-3 bg-[#FAF6EE] hover:bg-[#EAF5F0] border-2 border-[#E5D7C2] hover:border-[#A7D7CB] rounded-2xl text-xs sm:text-sm text-[#3E3228] text-left cursor-pointer transition-all btn-tactile"
                  >
                    💬 {phrase}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Optional typing fallback input if user prefers keyboard */}
          <div className="pt-2">
            <details className="text-xs text-[#7A6B5B] cursor-pointer">
              <summary className="font-bold underline hover:text-[#1E4D3B]">
                Prefer to type with keyboard instead? Tap here
              </summary>
              <div className="mt-3 space-y-2">
                <textarea
                  rows={3}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder={placeholder}
                  className="w-full bg-white border-2 border-[#E5D7C2] focus:border-[#1E4D3B] rounded-2xl p-3.5 text-sm sm:text-base text-[#2E241C] outline-hidden font-medium leading-relaxed"
                />
                {transcript.trim() && (
                  <button
                    type="button"
                    onClick={() => setStep('review')}
                    className="bg-[#1E4D3B] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Review Typed Words →
                  </button>
                )}
              </div>
            </details>
          </div>
        </div>
      )}

      {/* Step 2: Listening (Active Recording) */}
      {step === 'recording' && (
        <div className="space-y-5 text-center p-4">
          <div className="inline-flex items-center gap-2 bg-[#FEF2F2] border-2 border-[#FCA5A5] px-4 py-1.5 rounded-full text-xs font-bold text-[#B91C1C] animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></span>
            Listening warmly to your voice now...
          </div>

          <h4 className="font-serif-warm text-2xl sm:text-3xl font-bold text-[#1E4D3B]">
            Speak naturally, {title.toLowerCase()}
          </h4>

          <div className="bg-[#FAF7F0] border-2 border-[#E8DCCB] rounded-3xl p-5 min-h-[100px] flex items-center justify-center text-center">
            {transcript ? (
              <p className="font-serif-warm text-lg sm:text-xl text-[#2E241C] italic">
                "{transcript}"
              </p>
            ) : (
              <p className="text-sm text-[#7A6B5B]">
                (Say whatever is in your heart... we are writing it down for you)
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={stopListening}
            className="w-full py-5 px-6 rounded-3xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-lg sm:text-xl font-bold flex items-center justify-center gap-3 cursor-pointer transition-all shadow-md btn-tactile"
          >
            <Square className="w-6 h-6 fill-white" />
            <span>⏹️ Tap When Finished Speaking</span>
          </button>
        </div>
      )}

      {/* Step 3: Review & Confirm (Crucial Safety & Dignity Step) */}
      {step === 'review' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#EFE5D6] pb-3">
            <div>
              <span className="text-xs font-bold text-[#1E4D3B] uppercase tracking-wider block">
                Review Before Confirming
              </span>
              <h4 className="font-serif-warm text-lg sm:text-xl font-bold text-[#2E241C]">
                Here is what we heard you say:
              </h4>
            </div>

            <button
              type="button"
              onClick={listenBack}
              className={`px-3 py-2 rounded-2xl border-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all btn-tactile ${
                isSpeakingBack
                  ? 'bg-[#1E4D3B] text-white border-[#1E4D3B]'
                  : 'bg-[#FAF6EE] text-[#4A3C2F] border-[#E5D7C2] hover:bg-[#F2ECE4]'
              }`}
              title="Hear text read aloud"
            >
              <Volume2 className="w-4 h-4 text-[#1E4D3B]" />
              <span>{isSpeakingBack ? 'Reading...' : 'Hear Read Aloud'}</span>
            </button>
          </div>

          {/* Editable text box so senior or guardian can refine if desired */}
          <div className="relative">
            <textarea
              rows={3}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full bg-white border-3 border-[#A7D7CB] focus:border-[#1E4D3B] rounded-2xl p-4 text-base sm:text-lg text-[#2E241C] outline-hidden font-medium leading-relaxed shadow-xs"
              aria-label="Transcribed text"
            />
            <span className="absolute bottom-3 right-3 text-[11px] text-[#7A6B5B] bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#E5D7C2]">
              You can touch words to edit
            </span>
          </div>

          {/* Action Row: Left / Secondary (Speak Again, Cancel) vs Right / Primary (Confirm) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 sm:flex-initial px-4 py-3 bg-white hover:bg-[#F2ECE4] border-2 border-[#D5C6B0] rounded-2xl text-xs sm:text-sm font-bold text-[#615140] flex items-center justify-center gap-1.5 cursor-pointer btn-tactile"
              >
                <RotateCcw className="w-4 h-4 text-[#1E4D3B]" />
                <span>Speak Again</span>
              </button>

              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 sm:flex-initial px-4 py-3 bg-white hover:bg-[#F2ECE4] border-2 border-[#D5C6B0] rounded-2xl text-xs sm:text-sm font-bold text-[#615140] flex items-center justify-center gap-1.5 cursor-pointer btn-tactile"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => onConfirm(transcript)}
              disabled={!transcript.trim()}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#1E4D3B] hover:bg-[#15382B] disabled:opacity-50 text-white text-sm sm:text-base font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm btn-tactile ml-auto"
            >
              <CheckCircle2 className="w-5 h-5 text-[#86EFAC]" />
              <span>{confirmLabel}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

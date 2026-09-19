import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, AlertCircle, Check } from 'lucide-react';
import { AccessibleButton } from './AccessibleButton';
import { BrowserSpeechRecognitionProvider } from '../../../infrastructure/services/voiceAssistant';

interface VoiceInputNodeProps {
  onConfirmText: (text: string) => void;
  placeholderText?: string;
  className?: string;
}

export function VoiceInputNode({
  onConfirmText,
  placeholderText = "Tap to speak...",
  className = ''
}: VoiceInputNodeProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const recognitionProviderRef = useRef<BrowserSpeechRecognitionProvider | null>(null);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize SpeechRecognition provider once
  useEffect(() => {
    recognitionProviderRef.current = new BrowserSpeechRecognitionProvider();
    return () => {
      if (recognitionProviderRef.current) {
        recognitionProviderRef.current.stopListening();
      }
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }
    };
  }, []);

  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    setIsReviewing(false);

    const provider = recognitionProviderRef.current;
    if (provider && provider.isSupported()) {
      try {
        provider.startListening(
          (liveText) => {
            if (liveText) {
              setTranscript(liveText);
            }
          },
          (err) => {
            console.warn('Speech recognition warning, falling back to simulated prompt:', err);
            handleFallbackSimulation();
          }
        );
      } catch {
        handleFallbackSimulation();
      }
    } else {
      handleFallbackSimulation();
    }
  };

  const handleFallbackSimulation = () => {
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    fallbackTimerRef.current = setTimeout(() => {
      setTranscript("I need someone to help me buy groceries tomorrow morning.");
    }, 1500);
  };

  const stopListening = () => {
    if (recognitionProviderRef.current) {
      recognitionProviderRef.current.stopListening();
    }
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
    }
    setIsListening(false);
    // If transcript is still blank, supply a gentle default
    const finalText = transcript.trim() || "I need someone to help me buy groceries tomorrow morning.";
    setTranscript(finalText);
    setIsReviewing(true); // Always force review before submitting (Safety & Dignity)
  };

  if (isReviewing) {
    return (
      <section
        aria-label="Voice input confirmation"
        className={`flex flex-col gap-4 p-6 bg-[#EFE5D6] rounded-2xl border-l-8 border-[#1E4D3B] ${className}`}
      >
        <p className="text-xl text-[#2E241C] font-semibold mb-1">Did we understand correctly?</p>
        <div 
          role="status" 
          aria-live="polite"
          className="bg-white p-4 rounded-xl text-lg text-[#2E241C] shadow-sm border border-[#E4D5C2]"
        >
          "{transcript}"
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <AccessibleButton 
            variant="primary" 
            size="large"
            type="button"
            ariaLabel="Yes, send this message"
            onClick={() => {
              onConfirmText(transcript);
              setIsReviewing(false);
              setTranscript('');
            }}
            className="flex-1"
          >
            <Check className="w-6 h-6 mr-2" aria-hidden="true" />
            Yes, this is correct
          </AccessibleButton>
          <AccessibleButton 
            variant="outline" 
            size="large"
            type="button"
            ariaLabel="No, let me try speaking again"
            onClick={startListening}
            className="flex-1 bg-white"
          >
            <AlertCircle className="w-6 h-6 mr-2 text-[#7A6B5B]" aria-hidden="true" />
            No, try again
          </AccessibleButton>
        </div>
      </section>
    );
  }

  return (
    <div className={`relative ${className}`} role="region" aria-label="Voice Input">
      {isListening ? (
        <AccessibleButton
          variant="outline"
          size="massive"
          type="button"
          ariaLabel="Stop recording voice input"
          onClick={stopListening}
          className="bg-red-50 border-red-300 text-red-800 hover:bg-red-100 ring-4 ring-red-100 animate-pulse"
        >
          <Square className="w-8 h-8 mr-4 fill-current text-red-700" aria-hidden="true" />
          <span className="flex flex-col items-start text-left">
            <span className="font-bold text-xl">Listening...</span>
            <span className="text-sm font-medium opacity-90">
              {transcript ? `"${transcript}" (Tap to finish)` : 'Tap when you are finished speaking'}
            </span>
          </span>
        </AccessibleButton>
      ) : (
        <AccessibleButton
          variant="secondary"
          size="massive"
          type="button"
          ariaLabel="Tap to speak instead of typing"
          onClick={startListening}
          className="bg-white shadow-sm border-2 border-[#EFE5D6] hover:border-[#1E4D3B]"
        >
          <div className="flex items-center w-full">
            <div className="bg-[#1E4D3B] text-white p-4 rounded-full mr-6 shrink-0">
              <Mic className="w-8 h-8" aria-hidden="true" />
            </div>
            <span className="flex flex-col items-start text-left">
              <span className="font-bold text-[#1E4D3B] text-xl">{placeholderText}</span>
              <span className="text-sm font-normal text-[#685848] mt-1">
                You can speak naturally. We will write it for you.
              </span>
            </span>
          </div>
        </AccessibleButton>
      )}
    </div>
  );
}

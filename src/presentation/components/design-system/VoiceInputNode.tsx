import React, { useState, useRef } from 'react';
import { Mic, Square, AlertCircle, Check } from 'lucide-react';
import { AccessibleButton } from './AccessibleButton';

interface VoiceInputNodeProps {
  onConfirmText: (text: string) => void;
  placeholderText?: string;
  className?: string;
}

export function VoiceInputNode({ onConfirmText, placeholderText = "Tap to speak...", className = '' }: VoiceInputNodeProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    // Note: In a real app, we'd use an abstraction over SpeechRecognition
    // For this vertical slice, we simulate the speech API behavior
    setIsListening(true);
    setTranscript('');
    setIsReviewing(false);
    
    // Simulating someone speaking
    setTimeout(() => {
      setTranscript("I need someone to help me buy groceries tomorrow morning.");
    }, 1500);

    setTimeout(() => {
      stopListening("I need someone to help me buy groceries tomorrow morning.");
    }, 4000);
  };

  const stopListening = (finalText: string) => {
    setIsListening(false);
    setTranscript(finalText);
    setIsReviewing(true); // Always force review (Safety & Dignity)
  };

  if (isReviewing) {
    return (
      <div className={`flex flex-col gap-4 p-6 bg-[#EFE5D6] rounded-2xl border-l-8 border-[#1E4D3B] ${className}`}>
        <p className="text-xl text-[#2E241C] font-medium mb-2">Did we understand correctly?</p>
        <div className="bg-white p-4 rounded-xl text-lg shadow-sm">
          "{transcript}"
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <AccessibleButton 
            variant="primary" 
            size="large"
            ariaLabel="Yes, send this message"
            onClick={() => {
              onConfirmText(transcript);
              setIsReviewing(false);
              setTranscript('');
            }}
            className="flex-1"
          >
            <Check className="w-6 h-6 mr-2" />
            Yes, this is correct
          </AccessibleButton>
          <AccessibleButton 
            variant="outline" 
            size="large"
            ariaLabel="No, let me try speaking again"
            onClick={startListening}
            className="flex-1 bg-white"
          >
            <AlertCircle className="w-6 h-6 mr-2" />
            No, try again
          </AccessibleButton>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isListening ? (
        <AccessibleButton
          variant="outline"
          size="massive"
          ariaLabel="Stop recording"
          onClick={() => stopListening(transcript)}
          className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 ring-4 ring-red-100 animate-pulse"
        >
          <Square className="w-8 h-8 mr-4 fill-current" />
          <span className="flex flex-col items-start text-left">
            <span className="font-bold">Listening...</span>
            <span className="text-base font-normal opacity-80">Tap to stop</span>
          </span>
        </AccessibleButton>
      ) : (
        <AccessibleButton
          variant="secondary"
          size="massive"
          ariaLabel="Tap to speak instead of typing"
          onClick={startListening}
          className="bg-white shadow-sm border-2 border-transparent hover:border-[#1E4D3B]"
        >
          <div className="flex items-center w-full">
            <div className="bg-[#1E4D3B] text-white p-4 rounded-full mr-6">
              <Mic className="w-8 h-8" />
            </div>
            <span className="flex flex-col items-start text-left">
              <span className="font-bold text-[#1E4D3B]">{placeholderText}</span>
              <span className="text-base font-normal text-[#7A6B5B] mt-1">You can speak naturally. We will write it for you.</span>
            </span>
          </div>
        </AccessibleButton>
      )}
    </div>
  );
}

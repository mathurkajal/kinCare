import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';

interface VoiceSettingsSectionProps {
  isVoiceActive: boolean;
  onToggleVoice: () => void;
}

export const VoiceSettingsSection: React.FC<VoiceSettingsSectionProps> = ({
  isVoiceActive,
  onToggleVoice,
}) => {
  const [speechRate, setSpeechRate] = useState<number>(0.85);
  const [testVoicePlaying, setTestVoicePlaying] = useState(false);

  const testVoice = (customRate?: number) => {
    const rate = customRate ?? speechRate;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setTestVoicePlaying(true);
      const text = `Hello Margaret. This is your KinCare reading voice speaking at a gentle and clear pace. Everything is working smoothly.`;
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = rate;
      utter.pitch = 1.0;
      utter.onend = () => setTestVoicePlaying(false);
      utter.onerror = () => setTestVoicePlaying(false);
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF5FF] text-[#7C3AED] flex items-center justify-center border border-[#E9D5FF]">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E4D3B]">
              Screen Reader Voice Speed
            </h3>
            <p className="text-xs sm:text-sm text-[#736352]">
              Control how fast or slow words are spoken to you.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleVoice}
          className={`px-4 py-2 rounded-2xl text-xs font-bold border-2 cursor-pointer btn-tactile ${
            isVoiceActive
              ? 'bg-[#1E4D3B] text-white border-[#1E4D3B]'
              : 'bg-white text-[#7A6B5B] border-[#D5C6B0]'
          }`}
        >
          {isVoiceActive ? 'Voice: Enabled' : 'Voice: Muted'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => {
            setSpeechRate(0.75);
            testVoice(0.75);
          }}
          className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all btn-tactile ${
            speechRate === 0.75
              ? 'bg-[#FAF5FF] border-[#7C3AED] text-[#581C87] font-bold'
              : 'bg-white border-[#E5D9C7] text-[#4A3C2F]'
          }`}
        >
          <span className="block font-bold">Gentle & Relaxed (0.75x)</span>
          <span className="text-[11px] text-[#7A6B5B] block mt-0.5">Very slow, patient cadence</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSpeechRate(0.85);
            testVoice(0.85);
          }}
          className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all btn-tactile ${
            speechRate === 0.85
              ? 'bg-[#FAF5FF] border-[#7C3AED] text-[#581C87] font-bold'
              : 'bg-white border-[#E5D9C7] text-[#4A3C2F]'
          }`}
        >
          <span className="block font-bold">Natural & Calm (0.85x)</span>
          <span className="text-[11px] text-[#7A6B5B] block mt-0.5">Recommended comfortable speed</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSpeechRate(1.0);
            testVoice(1.0);
          }}
          className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all btn-tactile ${
            speechRate === 1.0
              ? 'bg-[#FAF5FF] border-[#7C3AED] text-[#581C87] font-bold'
              : 'bg-white border-[#E5D9C7] text-[#4A3C2F]'
          }`}
        >
          <span className="block font-bold">Standard Speed (1.0x)</span>
          <span className="text-[11px] text-[#7A6B5B] block mt-0.5">Normal conversation pace</span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => testVoice()}
        disabled={testVoicePlaying}
        className="w-full py-4 rounded-2xl bg-[#EFF8F3] hover:bg-[#E2F3EA] border-2 border-[#BDE7D1] text-[#1E4D3B] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer btn-tactile"
      >
        <Volume2 className="w-5 h-5 text-[#1E4D3B]" />
        <span>{testVoicePlaying ? 'Playing voice sample...' : '🔊 Test Voice Loudness Now'}</span>
      </button>
    </div>
  );
};

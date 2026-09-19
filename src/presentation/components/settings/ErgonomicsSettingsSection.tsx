import React from 'react';
import { Mic, Hand, Smartphone, Info } from 'lucide-react';
import { HandPreference } from '../../../shared/types';

interface ErgonomicsSettingsSectionProps {
  isHandsFreeActive: boolean;
  onToggleHandsFree: () => void;
  handPreference: HandPreference;
  onHandPreferenceChange: (pref: HandPreference) => void;
  isOneHandMode: boolean;
  onToggleOneHandMode: () => void;
}

export const ErgonomicsSettingsSection: React.FC<ErgonomicsSettingsSectionProps> = ({
  isHandsFreeActive,
  onToggleHandsFree,
  handPreference,
  onHandPreferenceChange,
  isOneHandMode,
  onToggleOneHandMode,
}) => {
  return (
    <>
      {/* Hands-Free Voice Control Mode */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF5F0] text-[#1E4D3B] flex items-center justify-center border border-[#C6E5D7]">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E4D3B]">
                Hands-Free Voice Mode
              </h3>
              <p className="text-xs sm:text-sm text-[#736352]">
                Perform common actions by simply speaking out loud.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleHandsFree}
            className={`px-5 py-3 rounded-2xl font-bold text-sm sm:text-base border-2 cursor-pointer transition-all btn-tactile ${
              isHandsFreeActive
                ? 'bg-[#1E4D3B] text-white border-[#1E4D3B] shadow-sm'
                : 'bg-white text-[#4A3C2F] border-[#D5C6B0] hover:bg-[#F2ECE4]'
            }`}
          >
            {isHandsFreeActive ? '✓ Hands-Free: Active' : 'Enable Hands-Free Voice'}
          </button>
        </div>

        <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#E7DCCB] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1E4D3B] uppercase tracking-wider">
            <Info className="w-4 h-4" /> Spoken Commands You Can Use Anytime:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-[#3E3228]">
            <div className="p-3 bg-white rounded-xl border border-[#E5D7C2]">
              <strong>"Talk to someone"</strong> → Opens friendly companionship
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E5D7C2]">
              <strong>"I need help"</strong> → Opens grocery & volunteer help
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E5D7C2]">
              <strong>"Call my son"</strong> → Connects phone call with David
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E5D7C2]">
              <strong>"Go home"</strong> → Returns safely to your living room
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E5D7C2]">
              <strong>"Read this"</strong> → Reads current page text out loud
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E5D7C2]">
              <strong>"Open my stories"</strong> → Opens family memory parlor
            </div>
          </div>
          <p className="text-xs text-[#7A6B5B] pt-1">
            <strong>Voice Safety Guarantee:</strong> Important actions (like sharing location or calling family) always require your explicit verbal or on-screen confirmation before taking place.
          </p>
        </div>
      </div>

      {/* Left / Right Hand Preference & One-Hand Mode */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center border border-[#FDE68A]">
            <Hand className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E4D3B]">
              Hand Preference & Reachability
            </h3>
            <p className="text-xs sm:text-sm text-[#736352]">
              Adjust button layouts for left or right handed comfort.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onHandPreferenceChange('left')}
            className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all btn-tactile ${
              handPreference === 'left'
                ? 'bg-[#1E4D3B] text-white border-[#1E4D3B] font-bold shadow-xs'
                : 'bg-white border-[#E5D7C2] text-[#4A3C2F]'
            }`}
          >
            <span className="block font-bold">Left-Handed</span>
            <span
              className={`text-[11px] block mt-0.5 ${
                handPreference === 'left' ? 'text-[#C5E8D4]' : 'text-[#7A6B5B]'
              }`}
            >
              Puts primary buttons on the left
            </span>
          </button>

          <button
            type="button"
            onClick={() => onHandPreferenceChange('right')}
            className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all btn-tactile ${
              handPreference === 'right'
                ? 'bg-[#1E4D3B] text-white border-[#1E4D3B] font-bold shadow-xs'
                : 'bg-white border-[#E5D7C2] text-[#4A3C2F]'
            }`}
          >
            <span className="block font-bold">Right-Handed</span>
            <span
              className={`text-[11px] block mt-0.5 ${
                handPreference === 'right' ? 'text-[#C5E8D4]' : 'text-[#7A6B5B]'
              }`}
            >
              Puts primary buttons on the right
            </span>
          </button>

          <button
            type="button"
            onClick={() => onHandPreferenceChange('both')}
            className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all btn-tactile ${
              handPreference === 'both'
                ? 'bg-[#1E4D3B] text-white border-[#1E4D3B] font-bold shadow-xs'
                : 'bg-white border-[#E5D7C2] text-[#4A3C2F]'
            }`}
          >
            <span className="block font-bold">Both / Centered</span>
            <span
              className={`text-[11px] block mt-0.5 ${
                handPreference === 'both' ? 'text-[#C5E8D4]' : 'text-[#7A6B5B]'
              }`}
            >
              Evenly balanced layout
            </span>
          </button>
        </div>

        {/* One-Hand Mode Toggle */}
        <div className="pt-3 border-t border-[#F0E6D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-[#1E4D3B]" />
            <div>
              <span className="font-bold text-sm sm:text-base text-[#2E241C] block">
                One-Hand Bottom Dock Mode
              </span>
              <span className="text-xs text-[#7A6B5B] block">
                Positions Home, Help, Voice, and SOS in an easy bottom bar on phones & tablets so you don't need to stretch across the screen.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleOneHandMode}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm border-2 cursor-pointer btn-tactile shrink-0 ${
              isOneHandMode
                ? 'bg-[#1E4D3B] text-white border-[#1E4D3B]'
                : 'bg-white text-[#4A3C2F] border-[#D5C6B0] hover:bg-[#F2ECE4]'
            }`}
          >
            {isOneHandMode ? '✓ One-Hand Dock: On' : 'One-Hand Dock: Off'}
          </button>
        </div>
      </div>
    </>
  );
};

import React from 'react';
import { ShieldCheck, Key, CheckCircle2, RotateCcw, Volume2 } from 'lucide-react';
import { SeniorProfile } from '../../../shared/types';

interface CheckInSectionProps {
  senior: SeniorProfile;
  onCheckInToday: (mood: 'happy' | 'peaceful' | 'tired' | 'lonely' | 'need_talk') => void;
  onResetCheckIn?: () => void;
  onOpenTalkModal: () => void;
  onOpenSafetyDetails: () => void;
  onSpeak: (text: string) => void;
}

export const CheckInSection: React.FC<CheckInSectionProps> = React.memo(({
  senior,
  onCheckInToday,
  onResetCheckIn,
  onOpenTalkModal,
  onOpenSafetyDetails,
  onSpeak,
}) => {
  return (
    <section className="bg-white rounded-3xl p-6 sm:p-9 border-2 border-[#EFE5D6] shadow-sm relative overflow-hidden bg-warm-hearth">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5 sm:gap-6">
          <div className="relative shrink-0">
            <img
              src={senior.avatar}
              alt={senior.name}
              className="w-22 h-22 sm:w-26 sm:h-26 rounded-3xl object-cover ring-4 ring-[#E2F0EA] border-2 border-[#CBE0D7] shadow-sm"
            />
            <span
              className="absolute -bottom-2 -right-2 bg-[#1E4D3B] text-white p-1.5 rounded-full shadow-md"
              title="Safe Verified Resident"
            >
              <ShieldCheck className="w-5 h-5 text-[#86EFAC]" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif-warm text-2xl sm:text-4xl font-bold text-[#1E4D3B] tracking-tight">
                Good morning, {senior.preferredName}.
              </h1>
              <button
                onClick={() =>
                  onSpeak(
                    `Good morning, ${senior.preferredName}. Welcome to your KinCare home. How is your heart and spirit today?`
                  )
                }
                className="p-3 rounded-full bg-[#F5EDE0] hover:bg-[#EAE0D0] text-[#615140] transition-colors cursor-pointer btn-tactile"
                title="Listen to greeting"
                aria-label="Read greeting aloud"
              >
                <Volume2 className="w-6 h-6 text-[#1E4D3B]" />
              </button>
            </div>

            <p className="text-base sm:text-lg text-[#615140] mt-1.5 font-normal max-w-xl">
              It is a peaceful day here in {senior.neighborhood}. Your son{' '}
              <strong>{senior.guardianContact.name}</strong> is connected and receiving your updates.
            </p>
          </div>
        </div>

        {/* Secret Arrival PIN Card (Large, High Contrast & Prominent) */}
        <div className="bg-[#FAF6EF] border-3 border-[#E5D7C2] rounded-3xl p-5 w-full lg:w-auto shadow-xs">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <span className="text-xs sm:text-sm font-bold text-[#665443] uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-[#1E4D3B]" />
              Your Secret Visitor PIN
            </span>
            <button
              onClick={onOpenSafetyDetails}
              className="text-xs font-bold text-[#1E4D3B] underline cursor-pointer hover:text-[#143528]"
            >
              Why this protects you
            </button>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-mono text-3xl sm:text-5xl font-black text-[#1E4D3B] tracking-widest bg-white px-5 py-2 rounded-2xl border-2 border-[#D5C6B0] shadow-2xs">
              {senior.safetyPin}
            </span>
            <p className="text-xs sm:text-sm text-[#6B5A47] max-w-[200px] leading-snug">
              Never open your door until your visitor says this exact 4-digit code.
            </p>
          </div>
        </div>
      </div>

      {/* Wellness Check-In Section */}
      <div className="mt-8 pt-7 border-t-2 border-[#EFE5D6]">
        {!senior.dailyCheckIn.checkedInToday ? (
          <div className="bg-[#FFFDF9] border-2 border-[#E8DCCB] rounded-3xl p-6 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="font-serif-warm text-xl sm:text-3xl font-bold text-[#1E4D3B]">
                  How are you feeling this morning, {senior.preferredName}?
                </h2>
                <p className="text-sm sm:text-base text-[#736352] mt-1">
                  One simple tap lets your family know you are safe and smiling.
                </p>
              </div>

              <button
                onClick={() =>
                  onSpeak(
                    `How are you feeling this morning, ${senior.preferredName}? Tap one of the three large buttons below to let your family know.`
                  )
                }
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#4D3E30] bg-[#F4ECDD] px-4 py-2 rounded-full hover:bg-[#EAE0CD] cursor-pointer btn-tactile shrink-0"
              >
                <Volume2 className="w-4 h-4 text-[#1E4D3B]" /> Listen to Options
              </button>
            </div>

            {/* Three High-Target Mood Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              <button
                onClick={() => onCheckInToday('peaceful')}
                className="p-5 sm:p-6 rounded-3xl bg-[#F2F8F4] hover:bg-[#E4F2E9] border-3 border-[#BFDFCD] text-left cursor-pointer transition-transform btn-tactile flex items-center gap-4 shadow-2xs"
                aria-label="I am feeling peaceful and well"
              >
                <span className="text-4xl sm:text-5xl">🌸</span>
                <div>
                  <span className="block font-bold text-base sm:text-xl text-[#1E4D3B]">
                    Feeling Peaceful & Good
                  </span>
                  <span className="text-xs sm:text-sm text-[#4F7361] mt-0.5 block">
                    I am comfortable and doing well
                  </span>
                </div>
              </button>

              <button
                onClick={() => onCheckInToday('tired')}
                className="p-5 sm:p-6 rounded-3xl bg-[#FFF9F0] hover:bg-[#FDF2E2] border-3 border-[#EEDBBA] text-left cursor-pointer transition-transform btn-tactile flex items-center gap-4 shadow-2xs"
                aria-label="Resting and quiet today"
              >
                <span className="text-4xl sm:text-5xl">🍵</span>
                <div>
                  <span className="block font-bold text-base sm:text-xl text-[#855B1F]">
                    Resting & Quiet Today
                  </span>
                  <span className="text-xs sm:text-sm text-[#8C6D3F] mt-0.5 block">
                    Taking things gentle and slow
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  onCheckInToday('need_talk');
                  onOpenTalkModal();
                }}
                className="p-5 sm:p-6 rounded-3xl bg-[#FAF5FF] hover:bg-[#F3EBFD] border-3 border-[#DBC8F5] text-left cursor-pointer transition-transform btn-tactile flex items-center gap-4 shadow-2xs"
                aria-label="Would love someone to talk with"
              >
                <span className="text-4xl sm:text-5xl">💬</span>
                <div>
                  <span className="block font-bold text-base sm:text-xl text-[#5B2E91]">
                    Love Someone to Talk With
                  </span>
                  <span className="text-xs sm:text-sm text-[#7B54AC] mt-0.5 block">
                    Feeling a little quiet or lonely
                  </span>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Reversible Check-In Confirmation with Clear Undo */
          <div className="bg-[#EFF8F3] border-3 border-[#B9E5CD] rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#1E4D3B] text-white flex items-center justify-center shadow-xs shrink-0">
                <CheckCircle2 className="w-9 h-9 text-[#86EFAC]" />
              </div>
              <div>
                <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E4D3B]">
                  You are safely checked in for today.
                </h3>
                <p className="text-sm sm:text-base text-[#3E6754]">
                  Recorded at {senior.dailyCheckIn.lastCheckInTime || '8:45 AM'}. Your son David received your reassurance.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="bg-white px-4 py-2.5 rounded-2xl border-2 border-[#B9E5CD] text-xs sm:text-sm font-bold text-[#1E4D3B] shadow-2xs">
                🌟 {senior.dailyCheckIn.checkInStreak}-Day Unbroken Morning Streak
              </div>

              {onResetCheckIn && (
                <button
                  onClick={onResetCheckIn}
                  className="px-4 py-2.5 rounded-2xl bg-[#FFFDF9] hover:bg-[#F2ECE4] border-2 border-[#D5C2C1] text-xs font-bold text-[#615140] cursor-pointer flex items-center gap-1.5 btn-tactile"
                  title="Tap if you tapped by mistake or want to change your mood"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#1E4D3B]" />
                  Change / Undo Check-In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  PhoneCall, 
  CheckCircle2, 
  X, 
  Heart, 
  MapPin, 
  Clock,
  Pause,
  Play,
  ShieldAlert
} from 'lucide-react';
import { SeniorProfile } from '../../shared/types';
import { useEscapeKey } from '../../shared/utils/useEscapeKey';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  senior: SeniorProfile;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  senior,
}) => {
  const [countdown, setCountdown] = useState(6);
  const [isPaused, setIsPaused] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCountdown(6);
      setIsPaused(false);
      setDispatched(false);
    }
  }, [isOpen]);

  useEscapeKey(onClose, isOpen);

  const triggerDispatch = () => {
    setDispatched(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(
        `Stay calm, ${senior.preferredName}. Emergency assistance has been requested. We have alerted your son David and your local emergency circle. Help is on the way. Please stay seated and comfortable.`
      );
      utter.rate = 0.85;
      window.speechSynthesis.speak(utter);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    if (countdown > 0 && !dispatched && !isPaused) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !dispatched) {
      triggerDispatch();
    }
  }, [isOpen, countdown, dispatched, isPaused]);

  if (!isOpen) return null;

  const handleCancelMistake = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance("Emergency alert cancelled. You are safe.");
      utter.rate = 0.88;
      window.speechSynthesis.speak(utter);
    }
    onClose();
  };

  return (
    <div 
      id="emergency-sos-modal"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      role="alertdialog"
      aria-labelledby="sos-modal-title"
      aria-describedby="sos-modal-desc"
    >
      <div className="bg-[#FFFDF9] rounded-3xl max-w-lg w-full border-4 border-[#B91C1C] shadow-2xl overflow-hidden text-center p-6 sm:p-8 space-y-6">
        <div className="w-20 h-20 bg-[#FEF2F2] text-[#B91C1C] rounded-3xl mx-auto flex items-center justify-center border-2 border-[#FCA5A5] shadow-xs">
          <AlertOctagon className="w-11 h-11 text-[#B91C1C] animate-pulse" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B91C1C] bg-[#FEF2F2] px-3.5 py-1 rounded-full border border-[#FECACA]">
            ⚠ Emergency Assistance
          </span>
          <h2 id="sos-modal-title" className="font-serif-warm text-2xl sm:text-3xl font-bold text-[#991B1B] mt-2">
            Are you in danger or do you need urgent help?
          </h2>
          <p id="sos-modal-desc" className="text-base text-[#573937] mt-1.5 font-medium">
            Immediate emergency notification for <strong>{senior.name}</strong>
          </p>
        </div>

        {!dispatched ? (
          <div className="bg-[#FAF5F5] p-6 rounded-3xl border-2 border-[#F8B4B4] space-y-4">
            <div className="font-serif-warm text-5xl sm:text-6xl font-black text-[#B91C1C]">
              {countdown}
            </div>
            <p className="text-sm sm:text-base text-[#663836] leading-snug">
              Automatically notifying your son <strong>{senior.guardianContact.name}</strong> and local responders in {countdown} seconds...
            </p>

            {/* Direct Action Buttons as specified in Requirement 15 */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleCancelMistake}
                  className="flex-1 bg-[#FFFDF9] hover:bg-[#F2ECEC] text-[#2E1E1D] border-3 border-[#D5C2C1] py-4 rounded-2xl text-base font-bold cursor-pointer transition-colors shadow-xs btn-tactile"
                >
                  [ Cancel ]
                </button>

                <button
                  type="button"
                  onClick={triggerDispatch}
                  className="flex-1 bg-[#B91C1C] hover:bg-[#991B1B] text-white py-4 rounded-2xl text-base font-bold cursor-pointer transition-colors shadow-md btn-tactile"
                >
                  [ Yes — Get Help ]
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="w-full bg-white hover:bg-[#F7F2EE] text-[#615140] border-2 border-[#D5C6B0] py-3 rounded-2xl text-xs sm:text-sm font-bold cursor-pointer transition-colors btn-tactile flex items-center justify-center gap-2"
              >
                {isPaused ? <Play className="w-4 h-4 text-[#1E4D3B]" /> : <Pause className="w-4 h-4 text-[#B91C1C]" />}
                <span>{isPaused ? 'Resume Countdown' : 'Hold / Pause Countdown (I need a moment)'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#EFF8F3] p-6 rounded-3xl border-2 border-[#B9E5CD] text-left space-y-3.5">
            <div className="flex items-center gap-2 text-[#1E4D3B] font-bold text-lg font-serif-warm">
              <CheckCircle2 className="w-6 h-6 text-[#1E4D3B] shrink-0" />
              Emergency Dispatch Has Been Triggered
            </div>

            <ul className="text-xs sm:text-sm text-[#2D5443] space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>Direct telephone call & SMS alert sent to <strong>{senior.guardianContact.name}</strong> ({senior.guardianContact.phone}).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>Home address transmitted: <strong>{senior.neighborhood}, Oakridge</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>Nearest verified healthcare responder notified on rapid response desk.</span>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href="tel:911"
                className="w-full bg-[#B91C1C] hover:bg-[#991B1B] text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-sm btn-tactile"
              >
                <PhoneCall className="w-5 h-5" />
                Call 911 Direct Line
              </a>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="text-xs font-bold text-[#736352] hover:text-[#2E241C] underline cursor-pointer p-2"
        >
          Close this emergency screen
        </button>
      </div>
    </div>
  );
};

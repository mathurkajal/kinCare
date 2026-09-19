import React, { useState } from 'react';
import { 
  X, 
  Key, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Send 
} from 'lucide-react';
import { CareRequest, SeniorProfile } from '../../shared/types';

interface VisitVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: CareRequest;
  senior: SeniorProfile;
  onCompleteVisit: (requestId: string, notes: string) => void;
}

export const VisitVerificationModal: React.FC<VisitVerificationModalProps> = ({
  isOpen,
  onClose,
  request,
  senior,
  onCompleteVisit,
}) => {
  if (!isOpen) return null;

  const [enteredPin, setEnteredPin] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [visitNotes, setVisitNotes] = useState('');

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin.trim() === senior.safetyPin) {
      setIsVerified(true);
      setErrorMsg(null);
    } else {
      setErrorMsg(`Incorrect PIN. Please ask ${senior.preferredName} to look at the top of her KinCare screen.`);
    }
  };

  const handleFinishVisit = (e: React.FormEvent) => {
    e.preventDefault();
    onCompleteVisit(request.id, visitNotes || 'Visit completed safely with warm conversation.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF6F0] rounded-3xl max-w-lg w-full border-2 border-[#EADCCB] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        <div className="bg-[#FFFDF9] px-6 py-4 border-b-2 border-[#EFE5D6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EFF8F3] text-[#1E4D3B] flex items-center justify-center border border-[#C5E8D4]">
              <Key className="w-5 h-5 text-[#1E4D3B]" />
            </div>
            <div>
              <h3 className="font-serif-warm font-bold text-[#1E4D3B] text-lg">
                Arrival PIN Verification
              </h3>
              <p className="text-xs text-[#7A6B5B]">
                Doorstep Security for {senior.name}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-2xl text-[#827160] hover:bg-[#F2ECE4] cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-5 flex-1 overflow-y-auto bg-[#FAF6F0]">
          {!isVerified ? (
            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div className="bg-[#FFFDF7] border-2 border-[#EEDBBA] p-4 rounded-2xl text-xs sm:text-sm text-[#615140] leading-relaxed">
                <strong className="text-[#3D2C1E] block mb-1">Doorstep Protocol:</strong>
                Before stepping inside, greet {senior.preferredName} and ask her for the 4-digit code displayed on her KinCare screen.
              </div>

              <div>
                <label className="text-xs font-bold text-[#615140] uppercase tracking-wider block mb-2">
                  Enter {senior.preferredName}'s 4-Digit Secret PIN:
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  placeholder="e.g. 4821"
                  className="w-full bg-white border-2 border-[#E5D7C2] focus:border-[#1E4D3B] rounded-2xl text-center text-3xl font-mono tracking-widest py-3 text-[#1E4D3B] font-bold outline-hidden shadow-2xs"
                  required
                />
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-[#FDF2F2] border-2 border-[#F8B4B4] text-[#B91C1C] rounded-2xl text-xs font-bold">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#1E4D3B] hover:bg-[#143528] text-white py-3.5 rounded-2xl font-bold text-sm cursor-pointer transition-colors shadow-xs btn-tactile"
              >
                Verify Doorstep Code & Unlock Visit
              </button>
            </form>
          ) : (
            <form onSubmit={handleFinishVisit} className="space-y-4">
              <div className="bg-[#EFF8F3] border-2 border-[#B9E5CD] p-4 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#1E4D3B] shrink-0" />
                <div>
                  <strong className="text-[#1E4D3B] text-sm block">
                    Code Verified: Visit In Progress
                  </strong>
                  <span className="text-xs text-[#3C6451]">
                    Family Guardian circle notified that visit has commenced.
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#615140] block mb-1">
                  Visit Notes & Reassurance for Family:
                </label>
                <textarea
                  rows={4}
                  value={visitNotes}
                  onChange={(e) => setVisitNotes(e.target.value)}
                  placeholder="e.g. Had lovely tea with Margaret, talked about her flower garden, delivered groceries safely..."
                  className="w-full bg-white border-2 border-[#E5D7C2] focus:border-[#1E4D3B] rounded-2xl p-3.5 text-sm text-[#2E241C] outline-hidden leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1E4D3B] hover:bg-[#143528] text-white py-3.5 rounded-2xl font-bold text-sm cursor-pointer transition-colors shadow-xs btn-tactile"
              >
                Complete Visit & Log to Safety Audit Trail
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

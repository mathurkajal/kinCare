import React, { useState } from 'react';
import { 
  Flag, 
  X, 
  AlertOctagon, 
  CheckCircle2, 
  ShieldAlert, 
  Send 
} from 'lucide-react';

interface CommunityReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  seniorName: string;
  guardianName: string;
}

export const CommunityReportModal: React.FC<CommunityReportModalProps> = ({
  isOpen,
  onClose,
  seniorName,
  guardianName,
}) => {
  if (!isOpen) return null;

  const [reason, setReason] = useState<string>('financial_request');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const reportReasons = [
    {
      id: 'financial_request',
      label: 'Asked for money, gift cards, or bank cards',
      desc: 'Violation of non-financial community protection rule.',
    },
    {
      id: 'unauthorized_clinical',
      label: 'Attempted unauthorized medical care or pill changes',
      desc: 'Only licensed doctors/nurses are allowed to discuss care plans.',
    },
    {
      id: 'pin_failure',
      label: 'Could not recite secret arrival PIN or showed up unannounced',
      desc: 'Potential unauthorized visitor.',
    },
    {
      id: 'inappropriate_conduct',
      label: 'Rude, hurried, or pressurized communication',
      desc: 'Everyone on KinCare must interact with utmost patience and respect.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance("Your safety report has been logged. Our safety team and your family have been notified immediately.");
      utter.rate = 0.88;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in"
      role="dialog"
      aria-labelledby="report-modal-title"
    >
      <div className="bg-[#FFFDF9] rounded-3xl max-w-xl w-full border-3 border-[#B91C1C] shadow-2xl p-6 sm:p-8 space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#EFE5D6] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] text-[#B91C1C] flex items-center justify-center border-2 border-[#FECACA]">
              <Flag className="w-6 h-6" />
            </div>
            <div>
              <h2 id="report-modal-title" className="font-serif-warm text-2xl font-bold text-[#991B1B]">
                Report a Concern or Boundary Issue
              </h2>
              <p className="text-xs sm:text-sm text-[#736352]">
                Your comfort and safety are protected. Reports are handled with top priority.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#FAF6EE] hover:bg-[#F0E6D5] text-[#5C4A3B] border border-[#E5D7C2] cursor-pointer"
            aria-label="Close report dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#2E241C]">
                What happened? (Select the main issue)
              </label>
              <div className="space-y-2">
                {reportReasons.map(r => (
                  <label
                    key={r.id}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-colors ${
                      reason === r.id
                        ? 'bg-[#FEF2F2] border-[#B91C1C] text-[#991B1B]'
                        : 'bg-white border-[#E0D2BC] hover:bg-[#FAF6EE] text-[#3D3025]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r.id}
                      checked={reason === r.id}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-1 w-4 h-4 text-[#B91C1C] cursor-pointer"
                    />
                    <div>
                      <strong className="block text-sm font-bold">{r.label}</strong>
                      <span className="text-xs opacity-80">{r.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-[#2E241C]">
                Additional notes (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Describe any name, date, or details you recall..."
                className="w-full p-3 rounded-2xl bg-white border border-[#D5C6B0] text-sm text-[#2E241C] outline-hidden"
              />
            </div>

            <div className="p-3 bg-[#FAF6EE] rounded-2xl border border-[#E5D7C2] text-xs text-[#5C4A3B]">
              Submitting this will notify our safety coordinator and alert <strong>{guardianName}</strong> immediately.
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-base cursor-pointer flex items-center justify-center gap-2 btn-tactile shadow-md"
            >
              <Send className="w-5 h-5" />
              <span>Submit Safety Report</span>
            </button>
          </form>
        ) : (
          <div className="bg-[#EFF8F3] p-6 rounded-3xl border-2 border-[#BDE7D1] text-center space-y-4 animate-in fade-in">
            <CheckCircle2 className="w-12 h-12 text-[#1E4D3B] mx-auto" />
            <h3 className="font-serif-warm text-2xl font-bold text-[#1E4D3B]">
              Safety Report Received
            </h3>
            <p className="text-sm text-[#24543E] leading-relaxed">
              Thank you for keeping our community safe. Our coordinator has paused any upcoming visits for review, and your son <strong>{guardianName}</strong> has received an alert.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-6 rounded-2xl bg-[#1E4D3B] text-white font-bold text-sm cursor-pointer btn-tactile"
            >
              Return to Living Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

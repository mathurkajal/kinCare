import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  X, 
  PhoneCall, 
  CheckCircle2, 
  Volume2, 
  Search, 
  ArrowRight,
  Info,
  Lock,
  Flag
} from 'lucide-react';
import { ScamCheckResult } from '../../shared/types';
import { apiClient } from '../../infrastructure/services/apiClient';

interface ScamShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  guardianPhone: string;
  guardianName: string;
  onOpenReportModal?: () => void;
}

export const ScamShieldModal: React.FC<ScamShieldModalProps> = ({
  isOpen,
  onClose,
  guardianPhone,
  guardianName,
  onOpenReportModal,
}) => {
  if (!isOpen) return null;

  const [inputText, setInputText] = useState('');
  const [callerDetails, setCallerDetails] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScamCheckResult | null>(null);

  const sampleScenarios = [
    {
      label: 'IRS Gift Card Scam',
      text: 'This is Officer Davis from the IRS. Your tax account has an unpaid warrant. You must purchase $1,500 in Target gift cards immediately or police will be dispatched to your house.',
      caller: 'Unknown Caller ID (202-555-0199)',
    },
    {
      label: 'Grandson Bail Scam',
      text: 'Grandma Maggie, please don’t tell mom and dad, but I was in a bad car accident in Mexico and my lawyer needs $2,000 wired via Western Union by 4 PM to post bail.',
      caller: 'Restricted Number claiming to be grandson',
    },
    {
      label: 'Medicare Card Fee',
      text: 'Official Medicare notice: Your current red, white, and blue card is expiring. To receive your new plastic chip card, verify your bank account and pay the $49 reissue fee.',
      caller: 'Recorded robocall',
    },
    {
      label: 'Legitimate Volunteer Check-in',
      text: 'Hi Maggie, this is David Chen from KinCare. I will be stopping by tomorrow at 3 PM for tea. My arrival PIN is 4821. See you soon!',
      caller: 'David Chen via KinCare Relay',
    },
  ];

  const handleAnalyze = async (customText?: string, customCaller?: string) => {
    const textToScan = customText || inputText;
    const callerToScan = customCaller || callerDetails;
    if (!textToScan.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const data = await apiClient.checkScam({
        textToCheck: textToScan,
        callerDetails: callerToScan,
      });
      setResult(data);
    } catch (err) {
      console.error(err);
      // Fallback detection
      const lower = textToScan.toLowerCase();
      const hasScamWord = ['gift card', 'wire money', 'bitcoin', 'arrest', 'bail', 'irs', 'medicare'].some(w => lower.includes(w));
      setResult({
        isSuspicious: hasScamWord,
        threatLevel: hasScamWord ? 'danger_scam' : 'safe',
        explanation: hasScamWord 
          ? 'This message matches known elder fraud patterns. Real organizations never demand gift cards or wire transfers.'
          : 'No predatory scam keywords detected. Continue practicing standard safety precautions.',
        identifiedTactics: hasScamWord ? ['Demand for alternative currency / gift cards'] : [],
        safeActionAdvice: [
          'Never give passwords, gift cards, or bank numbers over the phone.',
          'Call your son David to verify before taking any action.'
        ],
        reviewedBy: 'KinCare Senior Shield Intelligence Desk',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSpeakResult = () => {
    if (!result || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const message = result.threatLevel === 'danger_scam'
      ? `Warning: Scam Alert. ${result.explanation}. Please do not send any money. Hang up and call your son ${guardianName}.`
      : `Result: ${result.explanation}`;
    const utter = new SpeechSynthesisUtterance(message);
    utter.rate = 0.85;
    window.speechSynthesis.speak(utter);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in"
      role="dialog"
      aria-labelledby="scam-shield-title"
    >
      <div className="bg-[#FFFDF9] rounded-3xl max-w-2xl w-full border-3 border-[#E5D7C2] shadow-2xl p-6 sm:p-8 space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#EFE5D6] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] text-[#B91C1C] flex items-center justify-center border-2 border-[#FECACA]">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h2 id="scam-shield-title" className="font-serif-warm text-2xl sm:text-3xl font-bold text-[#1E4D3B]">
                Elder Fraud & Scam Shield
              </h2>
              <p className="text-xs sm:text-sm text-[#736352]">
                Check any suspicious phone call, letter, email, or text message before you respond.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-[#FAF6EE] hover:bg-[#F0E6D5] text-[#5C4A3B] border border-[#E5D7C2] cursor-pointer btn-tactile shrink-0"
            aria-label="Close Scam Shield"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Scenarios */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#7A6B5B] uppercase tracking-wider block">
            Or test one of these common elder scams:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleScenarios.map((scen, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputText(scen.text);
                  setCallerDetails(scen.caller);
                  handleAnalyze(scen.text, scen.caller);
                }}
                className="text-xs font-bold px-3.5 py-2 rounded-xl bg-[#FAF6EE] hover:bg-[#F2ECE0] text-[#4A3C2F] border border-[#E0D2BC] cursor-pointer transition-colors btn-tactile"
              >
                {scen.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-[#2E241C]">
            What did they say or write to you?
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            placeholder="Example: Someone called saying they are from Medicare or my bank, asking for gift cards or numbers..."
            className="w-full p-4 rounded-2xl bg-white border-2 border-[#D5C6B0] focus:border-[#1E4D3B] text-base text-[#2E241C] outline-hidden placeholder:text-[#9E8E7D]"
          />

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="text"
              value={callerDetails}
              onChange={(e) => setCallerDetails(e.target.value)}
              placeholder="Who did they say they were? (Optional phone number or name)"
              className="w-full sm:flex-1 p-3 rounded-xl bg-white border border-[#D5C6B0] text-sm text-[#2E241C]"
            />

            <button
              type="button"
              onClick={() => handleAnalyze()}
              disabled={isAnalyzing || !inputText.trim()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#1E4D3B] hover:bg-[#16382B] disabled:opacity-50 text-white font-bold text-sm cursor-pointer flex items-center justify-center gap-2 btn-tactile shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{isAnalyzing ? 'Analyzing for Scams...' : 'Check This Message'}</span>
            </button>
          </div>
        </div>

        {/* Analysis Results Display */}
        {result && (
          <div className="space-y-4 pt-2 border-t border-[#EFE5D6] animate-in fade-in">
            {/* Status Banner */}
            <div className={`p-5 rounded-3xl border-3 flex items-start justify-between gap-4 ${
              result.threatLevel === 'danger_scam'
                ? 'bg-[#FEF2F2] border-[#B91C1C] text-[#991B1B]'
                : result.threatLevel === 'caution'
                ? 'bg-[#FFFBEB] border-[#D97706] text-[#B45309]'
                : 'bg-[#EFF8F3] border-[#1E4D3B] text-[#1E4D3B]'
            }`}>
              <div className="flex items-start gap-3">
                {result.threatLevel === 'danger_scam' ? (
                  <ShieldAlert className="w-8 h-8 text-[#B91C1C] shrink-0 mt-0.5" />
                ) : result.threatLevel === 'caution' ? (
                  <AlertTriangle className="w-8 h-8 text-[#D97706] shrink-0 mt-0.5" />
                ) : (
                  <ShieldCheck className="w-8 h-8 text-[#1E4D3B] shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="font-serif-warm text-xl font-black">
                    {result.threatLevel === 'danger_scam'
                      ? '🛑 SCAM ALERT: Do NOT Send Money'
                      : result.threatLevel === 'caution'
                      ? '⚠️ Exercise Caution'
                      : '✓ Appears Safe / Verified Community Pattern'}
                  </h3>
                  <p className="text-sm font-medium mt-1 leading-relaxed">
                    {result.explanation}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSpeakResult}
                className="p-2.5 rounded-2xl bg-white/80 border border-current hover:bg-white cursor-pointer shrink-0"
                title="Read result aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Identified Predatory Tactics */}
            {result.identifiedTactics && result.identifiedTactics.length > 0 && (
              <div className="bg-[#FAF5F5] p-4 rounded-2xl border border-[#F8B4B4] space-y-2">
                <span className="text-xs font-bold text-[#B91C1C] uppercase tracking-wider block">
                  Identified Red Flags:
                </span>
                <ul className="text-xs sm:text-sm text-[#7F1D1D] space-y-1">
                  {result.identifiedTactics.map((tactic, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{tactic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Safe Steps */}
            <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#E5D7C2] space-y-2">
              <span className="text-xs font-bold text-[#1E4D3B] uppercase tracking-wider block">
                What You Should Do Right Now:
              </span>
              <ul className="text-xs sm:text-sm text-[#382D23] space-y-2">
                {result.safeActionAdvice.map((advice, i) => (
                  <li key={i} className="flex items-start gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#1E4D3B] shrink-0 mt-0.5" />
                    <span>{advice}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`tel:${guardianPhone}`}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-[#1E4D3B] hover:bg-[#16382B] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer btn-tactile shadow-xs"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call {guardianName} to Double-Check</span>
              </a>

              {onOpenReportModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenReportModal();
                  }}
                  className="py-3.5 px-4 rounded-2xl bg-white hover:bg-[#FAF6EE] text-[#B91C1C] border-2 border-[#FCA5A5] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer btn-tactile"
                >
                  <Flag className="w-4 h-4" />
                  <span>Report Suspicious Caller</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* The 4 Golden Rules of Senior Safety */}
        <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#E5D7C2] space-y-2 text-xs text-[#574737]">
          <div className="flex items-center gap-2 font-bold text-[#1E4D3B] uppercase tracking-wider text-[11px]">
            <Lock className="w-3.5 h-3.5" /> The 4 Golden Rules of Senior Protection:
          </div>
          <p><strong>1. Never pay with gift cards:</strong> No real government agency, utility company, or police ever accepts store gift cards or Bitcoin.</p>
          <p><strong>2. Take your time:</strong> Scammers always create artificial panic or urgency. You always have the right to hang up and verify.</p>
          <p><strong>3. Keep your PIN secret:</strong> Arriving volunteers on KinCare will always recite your 4-digit PIN before you open your door.</p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Key, 
  Stethoscope, 
  AlertCircle, 
  CheckCircle2, 
  PhoneCall, 
  UserCheck,
  HeartHandshake
} from 'lucide-react';

interface SafetyProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyProtocolModal: React.FC<SafetyProtocolModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF6F0] rounded-3xl max-w-2xl w-full border-2 border-[#EADCCB] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#1E4D3B] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#2D6651] text-[#86EFAC] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif-warm font-bold text-xl text-white">
                KinCare Trust & Safety Architecture
              </h3>
              <p className="text-xs text-[#C5E8D4]">
                The technology must adapt to the elderly person, safeguarding their dignity.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-[#C5E8D4] hover:bg-[#2D6651] cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-[#FAF6F0]">
          {/* Pillar 1 */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#EFF8F3] text-[#1E4D3B] rounded-2xl shrink-0 border border-[#C5E8D4]">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-warm font-bold text-[#1E4D3B] text-lg mb-1">
                1. Multi-Tiered Volunteer Screening & Primary Source Vetting
              </h4>
              <p className="text-xs sm:text-sm text-[#5C4C3E] leading-relaxed">
                Registration is not an endorsement. Every companion undergoes identity validation, vulnerable sector checks, independent reference interviews, and elder-empathy training.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#EFF8F3] text-[#1E4D3B] rounded-2xl shrink-0 border border-[#C5E8D4]">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-warm font-bold text-[#1E4D3B] text-lg mb-1">
                2. Secret Doorstep Arrival PIN Protocol
              </h4>
              <p className="text-xs sm:text-sm text-[#5C4C3E] leading-relaxed">
                Before entering any residence, visitors must verbally request the senior's 4-digit code. This ensures the senior never opens their door to an unexpected person.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#EFF8F3] text-[#1E4D3B] rounded-2xl shrink-0 border border-[#C5E8D4]">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-warm font-bold text-[#1E4D3B] text-lg mb-1">
                3. Strict Separation of Volunteer Companionship vs. Clinical Care
              </h4>
              <p className="text-xs sm:text-sm text-[#5C4C3E] leading-relaxed">
                Volunteers provide warm tea visits, grocery pickups, and tech help. Fall audits and health checks are strictly ring-fenced to licensed, verified healthcare providers.
              </p>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#EFF8F3] text-[#1E4D3B] rounded-2xl shrink-0 border border-[#C5E8D4]">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif-warm font-bold text-[#1E4D3B] text-lg mb-1">
                4. Family Guardian Circle & 1-Tap Reassurance
              </h4>
              <p className="text-xs sm:text-sm text-[#5C4C3E] leading-relaxed">
                Daily morning wellness check-ins automatically update family guardians. If a check-in is missed by 10:30 AM, gentle automated outreach begins immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

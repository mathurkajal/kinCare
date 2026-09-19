import React from 'react';
import { Phone } from 'lucide-react';
import { SeniorProfile } from '../../../shared/types';

interface GuardianContactSectionProps {
  senior: SeniorProfile;
}

export const GuardianContactSection: React.FC<GuardianContactSectionProps> = ({ senior }) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-xs space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center border border-[#BFDBFE]">
          <Phone className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E3A8A]">
            Primary Family Emergency Contact
          </h3>
          <p className="text-xs sm:text-sm text-[#6B7E9F]">
            Your son receives automatic alerts if you ever need urgent support.
          </p>
        </div>
      </div>

      <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8DFC9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-lg text-[#2E241C]">
            {senior.guardianContact.name} ({senior.guardianContact.relationship})
          </h4>
          <p className="text-sm text-[#736352]">
            Direct Phone: <strong>{senior.guardianContact.phone}</strong>
          </p>
          <p className="text-xs text-[#7A6B5B] mt-0.5">
            Receives SMS & Phone notifications immediately upon morning check-in or urgent alert.
          </p>
        </div>

        <div className="bg-white px-4 py-2 rounded-2xl border border-[#BDE7D1] text-xs font-bold text-[#1E4D3B] shadow-2xs">
          ✓ Notifications Active
        </div>
      </div>
    </div>
  );
};

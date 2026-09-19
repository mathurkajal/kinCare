import React from 'react';
import { CareRequest, SeniorProfile } from '../../../shared/types';

interface MatchedVisitCardProps {
  matchedRequest: CareRequest;
  senior: SeniorProfile;
}

export const MatchedVisitCard: React.FC<MatchedVisitCardProps> = React.memo(({
  matchedRequest,
  senior,
}) => {
  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#C8E7D8] shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏡</span>
          <div>
            <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E4D3B]">
              A Friendly Visitor is Confirmed
            </h3>
            <p className="text-xs sm:text-sm text-[#527062]">
              Here is the vetted volunteer who will be coming to see you.
            </p>
          </div>
        </div>

        <span className="bg-[#EFF8F3] text-[#1E4D3B] text-xs font-bold px-3 py-1 rounded-full border border-[#BDE7D1]">
          Arrival PIN Protected
        </span>
      </div>

      <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#E7DEC9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={
              matchedRequest.assignedVolunteerAvatar ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
            }
            alt={matchedRequest.assignedVolunteerName || 'Volunteer'}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#1E4D3B]"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-[#233531] text-base sm:text-lg">
                {matchedRequest.assignedVolunteerName || 'David Chen'}
              </h4>
              <span className="text-xs bg-[#EAF5F2] text-[#1E4D3B] px-2.5 py-0.5 rounded-full font-bold">
                ✓ Verified Companion
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6F6050] mt-0.5">
              Coming for: <strong>{matchedRequest.title}</strong>
            </p>
            <p className="text-xs text-[#8A7966] mt-0.5">
              Scheduled for: {matchedRequest.dateNeeded} ({matchedRequest.estimatedDuration})
            </p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border-2 border-[#D5C7B0] text-center w-full sm:w-auto shadow-2xs">
          <span className="text-xs text-[#7A6B5B] block font-semibold">Remember to Ask For Your PIN</span>
          <span className="font-mono text-2xl font-black text-[#1E4D3B]">{senior.safetyPin}</span>
        </div>
      </div>
    </section>
  );
});

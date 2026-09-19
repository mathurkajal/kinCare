import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  Clock, 
  MapPin, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  ShoppingBag, 
  Laptop, 
  Coffee, 
  Key, 
  BookOpen, 
  Filter 
} from 'lucide-react';
import { VolunteerProfile, CareRequest, GoldenWish } from '../../shared/types';

interface VolunteerViewProps {
  volunteer: VolunteerProfile;
  requests: CareRequest[];
  wishes: GoldenWish[];
  onAcceptRequest: (requestId: string) => void;
  onOpenVisitPinModal: (requestId: string) => void;
  onPledgeWish: (wishId: string) => void;
  onOpenSafetyCode: () => void;
}

export const VolunteerView: React.FC<VolunteerViewProps> = ({
  volunteer,
  requests,
  wishes,
  onAcceptRequest,
  onOpenVisitPinModal,
  onPledgeWish,
  onOpenSafetyCode,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'conversation' | 'groceries' | 'tech_help' | 'golden_wish'>('all');

  const volunteerEligibleRequests = requests.filter(r => !r.isProfessionalOnly);

  const filteredRequests = volunteerEligibleRequests.filter(req => {
    if (selectedFilter === 'all') return true;
    return req.category === selectedFilter;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Volunteer Profile Header */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="relative shrink-0">
              <img
                src={volunteer.avatar}
                alt={volunteer.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-[#E2F0EA] border-2 border-[#CBE0D7] shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 bg-[#1E4D3B] text-white p-1 rounded-full shadow-xs">
                <ShieldCheck className="w-5 h-5 text-[#86EFAC]" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif-warm text-2xl sm:text-3xl font-bold text-[#1E4D3B]">
                  {volunteer.name}
                </h1>
                <span className="bg-[#EFF8F3] text-[#1E4D3B] text-xs font-bold px-3 py-1 rounded-full border border-[#C5E8D4] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1E4D3B]" />
                  Level 3: Vetted Senior Companion
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#736352] mt-1 font-medium">
                {volunteer.profession} • {volunteer.neighborhood}
              </p>
              <p className="text-xs text-[#8A7966] mt-1 italic">
                "{volunteer.bio}"
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full lg:w-auto bg-[#FAF6EF] p-4 rounded-2xl border-2 border-[#E5D7C2]">
            <div className="text-center px-2">
              <span className="text-xs text-[#7A6B5B] block font-medium">Trust Score</span>
              <span className="font-serif-warm text-2xl font-black text-[#1E4D3B]">{volunteer.trustScore}%</span>
            </div>
            <div className="text-center px-2 border-x border-[#DFD0BC]">
              <span className="text-xs text-[#7A6B5B] block font-medium">Visits Done</span>
              <span className="font-serif-warm text-2xl font-black text-[#33251B]">{volunteer.completedVisitsCount}</span>
            </div>
            <div className="text-center px-2">
              <span className="text-xs text-[#7A6B5B] block font-medium">Hours Given</span>
              <span className="font-serif-warm text-2xl font-black text-[#33251B]">{volunteer.volunteerHours}h</span>
            </div>
          </div>
        </div>

        {/* Verification Badges */}
        <div className="mt-6 pt-5 border-t-2 border-[#EFE5D6] flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#1E4D3B] bg-[#EFF8F3] px-3 py-1.5 rounded-xl border border-[#C5E8D4] font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#1E4D3B]" />
            Gov ID Verified
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#1E4D3B] bg-[#EFF8F3] px-3 py-1.5 rounded-xl border border-[#C5E8D4] font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#1E4D3B]" />
            Vulnerable Sector Background Cleared
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#1E4D3B] bg-[#EFF8F3] px-3 py-1.5 rounded-xl border border-[#C5E8D4] font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#1E4D3B]" />
            Elder Empathy & Safety Certified
          </div>
          <button
            onClick={onOpenSafetyCode}
            className="ml-auto text-xs text-[#1E4D3B] font-bold underline cursor-pointer hover:text-[#143528]"
          >
            Review Volunteer Safety Guidelines & Code of Conduct →
          </button>
        </div>
      </section>

      {/* Boundary Safeguard */}
      <section className="bg-[#FFFDF7] border-2 border-[#EEDBBA] rounded-3xl p-5 flex items-start gap-4">
        <div className="p-2.5 bg-[#FBF0D8] text-[#8D5B18] rounded-2xl shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-[#5B4834] leading-relaxed">
          <strong className="font-bold text-[#423425] block mb-0.5">
            Strict Volunteer Boundary Protocol:
          </strong>
          Companions provide conversation, friendly tea visits, grocery errands, and non-medical tech assistance. 
          <strong> Never provide clinical nursing, medication dispensing, or private financial actions.</strong> Always verbally request the elder's 4-digit arrival PIN before entering their home.
        </div>
      </section>

      {/* Community Requests */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif-warm text-2xl font-bold text-[#1E4D3B]">
              Neighborly Companionship & Care Requests
            </h2>
            <p className="text-xs sm:text-sm text-[#736352]">
              Connect with seniors seeking friendly company, groceries, or tech help.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                selectedFilter === 'all' ? 'bg-[#1E4D3B] text-white shadow-xs' : 'bg-white text-[#524434] border border-[#E5D7C2]'
              }`}
            >
              All Requests
            </button>
            <button
              onClick={() => setSelectedFilter('conversation')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                selectedFilter === 'conversation' ? 'bg-[#1E4D3B] text-white shadow-xs' : 'bg-white text-[#524434] border border-[#E5D7C2]'
              }`}
            >
              Tea & Conversation
            </button>
            <button
              onClick={() => setSelectedFilter('groceries')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                selectedFilter === 'groceries' ? 'bg-[#1E4D3B] text-white shadow-xs' : 'bg-white text-[#524434] border border-[#E5D7C2]'
              }`}
            >
              Groceries
            </button>
            <button
              onClick={() => setSelectedFilter('tech_help')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                selectedFilter === 'tech_help' ? 'bg-[#1E4D3B] text-white shadow-xs' : 'bg-white text-[#524434] border border-[#E5D7C2]'
              }`}
            >
              Tech Help
            </button>
          </div>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRequests.map((req) => {
            const isAssignedToMe = req.assignedVolunteerId === volunteer.id;

            return (
              <div
                key={req.id}
                className={`bg-white rounded-3xl p-6 sm:p-7 border-2 transition-all flex flex-col justify-between ${
                  isAssignedToMe ? 'border-[#1E4D3B] ring-2 ring-[#C5E8D4]' : 'border-[#EFE5D6] hover:border-[#D5C6B0]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.seniorAvatar}
                        alt={req.seniorName}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#E2F0EA]"
                      />
                      <div>
                        <h3 className="font-serif-warm font-bold text-[#1E4D3B] text-lg">
                          {req.seniorName} ({req.seniorAge})
                        </h3>
                        <span className="text-xs text-[#736352] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#1E4D3B]" />
                          {req.neighborhood}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#FAF5EE] text-[#8D5B18] border border-[#EBD9BE]">
                      {req.category.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#2A1E15] mb-1.5">
                    {req.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#615140] leading-relaxed mb-4">
                    {req.description}
                  </p>

                  <div className="bg-[#FAF6EF] p-3.5 rounded-2xl border border-[#E5D7C2] text-xs text-[#665443] space-y-1 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#1E4D3B]" />
                      <span><strong>When:</strong> {req.dateNeeded} ({req.estimatedDuration})</span>
                    </div>
                    <div className="text-[11px] text-[#7A6B5B]">
                      <strong>Safety Protocol:</strong> {req.safetyNotes}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F2ECE2]">
                  {isAssignedToMe ? (
                    <div className="space-y-2">
                      <div className="bg-[#EFF8F3] text-[#1E4D3B] text-xs font-bold p-2.5 rounded-xl flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#1E4D3B]" />
                          Confirmed for this visit
                        </span>
                        <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-[#A7D7CB]">
                          Active
                        </span>
                      </div>
                      <button
                        onClick={() => onOpenVisitPinModal(req.id)}
                        className="w-full bg-[#1E4D3B] hover:bg-[#143528] text-white py-3 rounded-2xl text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-2 btn-tactile shadow-xs"
                      >
                        <Key className="w-4 h-4 text-[#86EFAC]" />
                        Enter Senior's 4-Digit Arrival PIN to Start Visit
                      </button>
                    </div>
                  ) : req.status === 'open' ? (
                    <button
                      onClick={() => onAcceptRequest(req.id)}
                      className="w-full bg-[#1E4D3B] hover:bg-[#143528] text-white py-3 rounded-2xl text-xs font-bold cursor-pointer transition-colors shadow-xs btn-tactile"
                    >
                      Offer Companionship / Accept Request
                    </button>
                  ) : (
                    <span className="text-xs text-[#8A7966] font-medium block text-center py-1">
                      Matched with another companion
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Golden Wishes */}
      <section className="bg-[#FAF5FF] rounded-3xl p-6 sm:p-8 border-2 border-[#E9DCFA] shadow-xs">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 bg-[#7C3AED] text-white rounded-2xl shadow-xs">
            <Sparkles className="w-6 h-6 text-[#E9D5FF]" />
          </div>
          <div>
            <h2 className="font-serif-warm text-2xl font-bold text-[#4C1D95]">
              Golden Wishes: Cherished Experiences to Fulfill
            </h2>
            <p className="text-xs sm:text-sm text-[#6D28D9]">
              Help an elderly neighbor experience a cherished dream they never got to accomplish in life.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishes.map((wish) => (
            <div
              key={wish.id}
              className="bg-white rounded-3xl p-5 border-2 border-[#EADDF8] flex flex-col justify-between shadow-2xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={wish.seniorAvatar}
                    alt={wish.seniorName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-xs font-bold text-[#4C1D95]">
                    {wish.seniorName}
                  </span>
                  <span className="ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F3EBFC] text-[#7C3AED]">
                    {wish.category.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-serif-warm font-bold text-[#2E1065] text-base mb-1.5">
                  "{wish.title}"
                </h3>
                <p className="text-xs text-[#5C4C6C] leading-relaxed mb-4">
                  {wish.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F2E8FB]">
                {wish.status === 'pledged' ? (
                  <div className="text-xs text-[#7C3AED] font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7C3AED]" />
                    Pledged by {wish.pledgedByVolunteerName}
                  </div>
                ) : (
                  <button
                    onClick={() => onPledgeWish(wish.id)}
                    className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5 btn-tactile"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#F3E8FF]" />
                    Pledge to Fulfill This Wish
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

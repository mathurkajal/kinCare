import React from 'react';
import { 
  ShieldCheck, 
  Phone, 
  Heart, 
  Key, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  MapPin,
  Volume2
} from 'lucide-react';
import { SeniorProfile } from '../../shared/types';

interface TrustedPeopleViewProps {
  senior: SeniorProfile;
  onOpenSafetyProtocol: () => void;
  onSpeakText?: (text: string) => void;
}

export const TrustedPeopleView: React.FC<TrustedPeopleViewProps> = ({
  senior,
  onOpenSafetyProtocol,
  onSpeakText,
}) => {
  const speak = (text: string) => {
    if (onSpeakText) {
      onSpeakText(text);
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.85;
      window.speechSynthesis.speak(utter);
    }
  };

  const trustedCircle = [
    {
      name: senior.guardianContact.name,
      relation: 'Son & Primary Family Guardian',
      phone: senior.guardianContact.phone,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      badge: 'Family Guardian Circle',
      status: 'Connected & Receiving Morning Updates',
      canCallDirect: true,
    },
    {
      name: 'David Chen',
      relation: 'Verified Community Companion',
      phone: '(555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      badge: 'Police Background Checked & Certified',
      status: 'Coming tomorrow for afternoon tea',
      canCallDirect: true,
    },
    {
      name: 'Sarah Jenkins, RN',
      relation: 'Licensed Healthcare Provider & Nurse',
      phone: '(555) 876-5432',
      avatar: 'https://images.unsplash.com/photo-1594824813629-450f68d6f903?w=150&auto=format&fit=crop&q=80',
      badge: 'State License #RN-884920 Verified',
      status: 'Available for fall-prevention & vitals',
      canCallDirect: true,
    },
  ];

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Header Reassurance */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E4D3B] bg-[#EFF8F3] px-3 py-1 rounded-full border border-[#BDE7D1]">
              Verified Protective Circle
            </span>
          </div>
          <h2 className="font-serif-warm text-2xl sm:text-4xl font-bold text-[#1E4D3B]">
            Margaret's Trusted People
          </h2>
          <p className="text-sm sm:text-base text-[#615140] mt-1 max-w-xl">
            Every person in this circle has been vetted, background-cleared, and verified to keep your home peaceful and safe.
          </p>
        </div>

        <button
          onClick={() => speak("Here are your trusted people. Your son David, your verified companion David Chen, and your licensed nurse Sarah Jenkins. All are connected to protect you.")}
          className="px-4 py-2.5 rounded-2xl bg-[#FAF6EE] hover:bg-[#F2ECE0] border-2 border-[#E5D7C2] text-xs sm:text-sm font-bold text-[#4A3C2F] flex items-center gap-2 cursor-pointer btn-tactile shrink-0"
        >
          <Volume2 className="w-4 h-4 text-[#1E4D3B]" /> Listen Aloud
        </button>
      </div>

      {/* Secret PIN Hero Box */}
      <div className="bg-[#FAF6EF] border-3 border-[#E5D7C2] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-[#1E4D3B]" />
            <span className="text-xs sm:text-sm font-bold text-[#665443] uppercase tracking-wider">
              Your Secret Doorstep Arrival PIN
            </span>
          </div>
          <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E4D3B]">
            Never open your door unless your visitor says this code:
          </h3>
          <p className="text-sm text-[#736352] max-w-lg">
            Every verified volunteer and nurse must verbally recite this 4-digit number before you turn your deadbolt.
          </p>
        </div>

        <div className="bg-white px-7 py-4 rounded-3xl border-3 border-[#1E4D3B] text-center shadow-sm shrink-0">
          <span className="text-xs text-[#7A6B5B] block font-bold uppercase">Secret Code</span>
          <span className="font-mono text-4xl sm:text-5xl font-black text-[#1E4D3B] tracking-widest">
            {senior.safetyPin}
          </span>
        </div>
      </div>

      {/* Trusted People Cards */}
      <div className="space-y-4">
        <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E4D3B]">
          People In Your Care & Support Circle
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {trustedCircle.map((person, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border-2 border-[#EFE5D6] shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#CBE0D7]"
                  />
                  <div>
                    <h4 className="font-bold text-lg text-[#2E241C]">
                      {person.name}
                    </h4>
                    <span className="text-xs text-[#7A6B5B] block">
                      {person.relation}
                    </span>
                  </div>
                </div>

                <div className="bg-[#EFF8F3] p-3 rounded-2xl border border-[#BDE7D1] text-xs text-[#1E4D3B] font-medium space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#1E4D3B]" />
                    {person.badge}
                  </span>
                  <p className="text-[11px] text-[#3D6352]">
                    Status: {person.status}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F2ECE2]">
                <a
                  href={`tel:${person.phone}`}
                  className="w-full py-3 px-4 rounded-2xl bg-[#FAF6EE] hover:bg-[#1E4D3B] hover:text-white text-[#4A3C2F] border-2 border-[#E5D7C2] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors btn-tactile"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {person.name.split(' ')[0]} ({person.phone})</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Protocol Full Review */}
      <div className="bg-[#FFFDF9] border-2 border-[#E8DCCB] rounded-3xl p-6 sm:p-7 flex items-center justify-between gap-4">
        <div>
          <h4 className="font-serif-warm text-lg sm:text-xl font-bold text-[#1E4D3B]">
            Have questions about how volunteers are vetted?
          </h4>
          <p className="text-xs sm:text-sm text-[#736352] mt-0.5">
            Read the 5-layer KinCare safety and security shield guidelines.
          </p>
        </div>

        <button
          onClick={onOpenSafetyProtocol}
          className="px-5 py-3 rounded-2xl bg-[#1E4D3B] hover:bg-[#143528] text-white text-xs sm:text-sm font-bold cursor-pointer transition-colors btn-tactile shrink-0"
        >
          View Full Safety Shield →
        </button>
      </div>
    </div>
  );
};

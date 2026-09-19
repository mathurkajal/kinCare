import React, { useState } from 'react';
import { 
  Stethoscope, 
  ShieldCheck, 
  Award, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  UserCheck, 
  Plus, 
  Lock, 
  Clock, 
  Activity 
} from 'lucide-react';
import { ProfessionalProfile, CareRequest } from '../../shared/types';

interface ProfessionalViewProps {
  professional: ProfessionalProfile;
  requests: CareRequest[];
  onAcceptClinicalRequest: (requestId: string) => void;
  onAddCareNote: (seniorName: string, noteText: string) => void;
}

export const ProfessionalView: React.FC<ProfessionalViewProps> = ({
  professional,
  requests,
  onAcceptClinicalRequest,
  onAddCareNote,
}) => {
  const [activeTab, setActiveTab] = useState<'consultations' | 'credentials' | 'notes'>('consultations');
  const [selectedSeniorForNote, setSelectedSeniorForNote] = useState('Margaret Higgins');
  const [newCareNoteText, setNewCareNoteText] = useState('');
  const [noteSubmitted, setNoteSubmitted] = useState(false);

  const clinicalRequests = requests.filter(r => r.isProfessionalOnly || r.category === 'professional_care');

  const handleSubmitCareNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCareNoteText.trim()) return;
    onAddCareNote(selectedSeniorForNote, newCareNoteText);
    setNewCareNoteText('');
    setNoteSubmitted(true);
    setTimeout(() => setNoteSubmitted(false), 3000);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Professional Credential Header */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="relative shrink-0">
              <img
                src={professional.avatar}
                alt={professional.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-[#E0EFF8] border-2 border-[#BCD8EC] shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 bg-[#18537A] text-white p-1 rounded-full shadow-xs" title="Verified Medical Credential">
                <ShieldCheck className="w-5 h-5 text-[#86EFAC]" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif-warm text-2xl sm:text-3xl font-bold text-[#18537A]">
                  {professional.name}
                </h1>
                <span className="bg-[#EFF7FC] text-[#18537A] text-xs font-bold px-3 py-1 rounded-full border border-[#BCD8EC] flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-[#18537A]" />
                  {professional.specialties[0] || professional.profession}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#5B6D7A] mt-1 font-medium">
                Board: {professional.issuingBoard} • License: {professional.licenseNumber}
              </p>
              <p className="text-xs text-[#7B8D9A] mt-1 italic">
                "{professional.bio}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#F2F8FC] p-4 rounded-2xl border-2 border-[#D1E6F5] w-full lg:w-auto">
            <div className="p-3 bg-white text-[#18537A] rounded-xl shadow-2xs">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-[#526C80] block font-bold">HIPAA & Clinical Boundary</span>
              <span className="text-xs text-[#204460]">State Registry Verified • Active RN Standing</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 pt-5 border-t-2 border-[#EFE5D6] flex items-center gap-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('consultations')}
            className={`py-2 px-4 rounded-2xl text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
              activeTab === 'consultations'
                ? 'bg-[#18537A] text-white shadow-xs'
                : 'bg-[#FAF6F0] text-[#554739] hover:bg-[#EFE5D6]'
            }`}
          >
            Clinical & Fall-Safety Requests ({clinicalRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-2 px-4 rounded-2xl text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
              activeTab === 'notes'
                ? 'bg-[#18537A] text-white shadow-xs'
                : 'bg-[#FAF6F0] text-[#554739] hover:bg-[#EFE5D6]'
            }`}
          >
            Family Care Circle Briefings
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`py-2 px-4 rounded-2xl text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
              activeTab === 'credentials'
                ? 'bg-[#18537A] text-white shadow-xs'
                : 'bg-[#FAF6F0] text-[#554739] hover:bg-[#EFE5D6]'
            }`}
          >
            Credentials & Malpractice Insurance
          </button>
        </div>
      </section>

      {/* Main Tab Content */}
      {activeTab === 'consultations' && (
        <section className="space-y-4">
          <div>
            <h2 className="font-serif-warm text-2xl font-bold text-[#18537A]">
              Specialized Healthcare & Fall-Risk Consultations
            </h2>
            <p className="text-xs sm:text-sm text-[#5B6D7A]">
              These requests are gated to licensed healthcare practitioners for dignity and safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {clinicalRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#D1E6F5] space-y-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.seniorAvatar}
                        alt={req.seniorName}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#BCD8EC]"
                      />
                      <div>
                        <h3 className="font-serif-warm font-bold text-[#18537A] text-lg">
                          {req.seniorName} ({req.seniorAge})
                        </h3>
                        <span className="text-xs text-[#556977]">
                          {req.neighborhood}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#EBF5FB] text-[#18537A] border border-[#BCD8EC]">
                      CLINICAL ONLY
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#1B3245] mb-1">
                    {req.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#4E6170] leading-relaxed mb-3">
                    {req.description}
                  </p>

                  <div className="p-3 bg-[#F2F8FC] rounded-2xl border border-[#D5E8F5] text-xs text-[#18537A]">
                    <strong>Clinical Note:</strong> {req.safetyNotes}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAF2F8]">
                  {req.status === 'matched' ? (
                    <div className="bg-[#EFF8F3] text-[#1E4D3B] text-xs font-bold p-3 rounded-2xl flex items-center justify-between">
                      <span>✓ Consultation Scheduled</span>
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#C5E8D4]">
                        Assigned
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAcceptClinicalRequest(req.id)}
                      className="w-full bg-[#18537A] hover:bg-[#12405E] text-white py-3 rounded-2xl text-xs font-bold cursor-pointer transition-colors shadow-xs btn-tactile"
                    >
                      Accept Clinical Consultation
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'notes' && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] space-y-6 shadow-xs">
          <div>
            <h3 className="font-serif-warm text-2xl font-bold text-[#18537A]">
              Family Care Circle Briefing
            </h3>
            <p className="text-xs sm:text-sm text-[#5B6D7A]">
              Post verified clinical observations that family guardians can securely review.
            </p>
          </div>

          <form onSubmit={handleSubmitCareNote} className="space-y-4 max-w-2xl">
            <div>
              <label className="text-xs font-bold text-[#554739] block mb-1">
                Select Senior:
              </label>
              <select
                value={selectedSeniorForNote}
                onChange={(e) => setSelectedSeniorForNote(e.target.value)}
                className="w-full bg-[#FAF6EF] border-2 border-[#E5D7C2] rounded-2xl p-3 text-sm text-[#2E241C]"
              >
                <option value="Margaret Higgins">Margaret Higgins (Age 82, Oakridge)</option>
                <option value="Robert Vance">Robert Vance (Age 79, Oakridge)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#554739] block mb-1">
                Clinical Observation & Home Safety Recommendation:
              </label>
              <textarea
                rows={4}
                value={newCareNoteText}
                onChange={(e) => setNewCareNoteText(e.target.value)}
                placeholder="e.g. Conducted a home threshold audit today. Noticed entryway rug needs slip-proof underlay. Margaret's gait and balance are stable with her quad-cane..."
                className="w-full bg-[#FAF6EF] border-2 border-[#E5D7C2] focus:border-[#18537A] rounded-2xl p-3.5 text-sm text-[#2E241C]"
                required
              />
            </div>

            {noteSubmitted && (
              <div className="p-3 bg-[#EFF8F3] border border-[#B9E5CD] text-[#1E4D3B] rounded-2xl text-xs font-bold">
                ✓ Care note successfully published to the Family Guardian Circle.
              </div>
            )}

            <button
              type="submit"
              className="bg-[#18537A] hover:bg-[#12405E] text-white px-6 py-3.5 rounded-2xl font-bold text-sm cursor-pointer transition-colors shadow-xs btn-tactile"
            >
              Publish to Family Guardian Circle
            </button>
          </form>
        </section>
      )}

      {activeTab === 'credentials' && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] space-y-4 shadow-xs">
          <h3 className="font-serif-warm text-2xl font-bold text-[#18537A]">
            Verified Professional Credentials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-[#F4F9FC] rounded-2xl border border-[#D5E8F5]">
              <span className="text-xs font-bold text-[#18537A] block">RN License Status</span>
              <strong className="text-base text-[#10344D] block mt-1">Active & In Good Standing</strong>
              <span className="text-[11px] text-[#617E93]">Expires: Dec 2027</span>
            </div>
            <div className="p-5 bg-[#F4F9FC] rounded-2xl border border-[#D5E8F5]">
              <span className="text-xs font-bold text-[#18537A] block">Professional Liability</span>
              <strong className="text-base text-[#10344D] block mt-1">$2,000,000 / $4,000,000</strong>
              <span className="text-[11px] text-[#617E93]">Underwritten by HPSO</span>
            </div>
            <div className="p-5 bg-[#F4F9FC] rounded-2xl border border-[#D5E8F5]">
              <span className="text-xs font-bold text-[#18537A] block">Background Screening</span>
              <strong className="text-base text-[#10344D] block mt-1">Fingerprint Cleared</strong>
              <span className="text-[11px] text-[#617E93]">DOJ / FBI Level 2</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

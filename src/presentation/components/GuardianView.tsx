import React from 'react';
import { 
  ShieldCheck, 
  Heart, 
  Clock, 
  Calendar, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2, 
  PhoneCall, 
  Bell, 
  UserCheck, 
  Eye, 
  FileText, 
  Key,
  Coffee
} from 'lucide-react';
import { SeniorProfile, VisitAuditLog, LifeStoryChapter, CareRequest } from '../../shared/types';

interface GuardianViewProps {
  senior: SeniorProfile;
  auditLogs: VisitAuditLog[];
  stories: LifeStoryChapter[];
  requests: CareRequest[];
  careNotes: { id: string; seniorName: string; text: string; date: string; author: string }[];
  onTriggerSOS: () => void;
  onOpenStoryModal: () => void;
}

export const GuardianView: React.FC<GuardianViewProps> = ({
  senior,
  auditLogs,
  stories,
  requests,
  careNotes,
  onTriggerSOS,
  onOpenStoryModal,
}) => {
  return (
    <div className="space-y-8 pb-20">
      {/* Guardian Overview Banner */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="relative shrink-0">
              <img
                src={senior.avatar}
                alt={senior.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-[#E2F0EA] border-2 border-[#CBE0D7] shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 bg-[#1E4D3B] text-white p-1 rounded-full shadow-xs">
                <ShieldCheck className="w-5 h-5 text-[#86EFAC]" />
              </span>
            </div>

            <div>
              <span className="bg-[#EFF8F3] text-[#1E4D3B] text-xs font-bold px-3 py-1 rounded-full border border-[#C5E8D4]">
                Family Guardian Circle Active
              </span>
              <h1 className="font-serif-warm text-2xl sm:text-3xl font-bold text-[#1E4D3B] mt-1.5">
                {senior.name}'s Peace of Mind Circle
              </h1>
              <p className="text-xs sm:text-sm text-[#736352] mt-0.5">
                Monitoring by Son: <strong>{senior.guardianContact.name}</strong> ({senior.guardianContact.phone})
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 bg-[#FAF6EF] p-4 rounded-2xl border-2 border-[#E5D7C2] w-full md:w-auto">
            <div>
              <span className="text-xs text-[#7A6B5B] block font-medium">Daily Streak</span>
              <strong className="font-serif-warm text-2xl font-black text-[#1E4D3B]">
                {senior.dailyCheckIn.checkInStreak} Days
              </strong>
            </div>
            <div className="border-l border-[#DFD0BC] pl-4">
              <span className="text-xs text-[#7A6B5B] block font-medium">Arrival PIN</span>
              <strong className="font-mono text-2xl font-black text-[#1E4D3B]">
                {senior.safetyPin}
              </strong>
            </div>
          </div>
        </div>

        {/* Real-time Status */}
        <div className="mt-6 pt-5 border-t-2 border-[#EFE5D6] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#EFF8F3] border border-[#B9E5CD] flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#1E4D3B] shrink-0" />
            <div>
              <strong className="text-sm font-bold text-[#1E4D3B] block">
                Morning Wellness Check
              </strong>
              <span className="text-xs text-[#4F7361]">
                Completed at {senior.dailyCheckIn.lastCheckInTime || '8:45 AM'} today
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#EEDBBA] flex items-center gap-3">
            <Bell className="w-6 h-6 text-[#D97706] shrink-0" />
            <div>
              <strong className="text-sm font-bold text-[#855B1F] block">
                Automated Alert Threshold
              </strong>
              <span className="text-xs text-[#8C6D3F]">
                Alert triggers if no check-in by 10:30 AM
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F7FF] border border-[#BFDBFE] flex items-center gap-3 sm:col-span-2 lg:col-span-1">
            <Key className="w-6 h-6 text-[#2563EB] shrink-0" />
            <div>
              <strong className="text-sm font-bold text-[#1E40AF] block">
                Visitor Access Code
              </strong>
              <span className="text-xs text-[#4B6B94]">
                Secret PIN: {senior.safetyPin} (Never given without consent)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Notes & Observations */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#EFF7FC] text-[#18537A] rounded-2xl">
            <FileText className="w-6 h-6 text-[#18537A]" />
          </div>
          <div>
            <h2 className="font-serif-warm text-2xl font-bold text-[#18537A]">
              Licensed Clinical Nurse Briefings
            </h2>
            <p className="text-xs sm:text-sm text-[#5B6D7A]">
              Professional observations from visits conducted by Sarah Jenkins, RN.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {careNotes.map((note) => (
            <div
              key={note.id}
              className="bg-[#F8FAFC] p-5 rounded-2xl border border-[#E2E8F0] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#18537A]">
                  🩺 {note.author}
                </span>
                <span className="text-xs text-[#64748B]">
                  {note.date}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                "{note.text}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Verified Visit Audit Trail */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#EFF8F3] text-[#1E4D3B] rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-[#1E4D3B]" />
          </div>
          <div>
            <h2 className="font-serif-warm text-2xl font-bold text-[#1E4D3B]">
              Verified Home Visit Audit Trail
            </h2>
            <p className="text-xs sm:text-sm text-[#527062]">
              Cryptographically verified entrance logs using Margaret's secret PIN.
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#F2ECE2]">
          {auditLogs.map((log) => (
            <div key={log.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-sm font-bold text-[#2E241C]">
                    Visit with {log.volunteerName}
                  </strong>
                  <span className="text-[11px] bg-[#EFF8F3] text-[#1E4D3B] px-2 py-0.5 rounded-full font-bold">
                    ✓ PIN Verified
                  </span>
                </div>
                <p className="text-xs text-[#736352] mt-0.5">
                  Notes: {log.notes}
                </p>
              </div>

              <div className="text-right text-xs text-[#736352]">
                <div>{log.scheduledTime}</div>
                <div className="text-[11px] text-[#948473]">Time: {log.checkInTime} - {log.checkOutTime}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Preserved Family Memories */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#EFF6FF] text-[#2563EB] rounded-2xl">
              <BookOpen className="w-6 h-6 text-[#2563EB]" />
            </div>
            <div>
              <h2 className="font-serif-warm text-2xl font-bold text-[#1E3A8A]">
                Margaret's Family Memoir Archive
              </h2>
              <p className="text-xs sm:text-sm text-[#4B6B94]">
                Recorded memories and life advice for your family.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenStoryModal}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
          >
            + Help Margaret Record a Memory
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stories.map((s) => (
            <div key={s.id} className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8DFC9] space-y-2">
              <span className="text-xs font-bold text-[#2563EB] uppercase">
                {s.theme} • {s.recordedDate}
              </span>
              <h3 className="font-serif-warm text-base font-bold text-[#1E3A8A]">
                "{s.title}"
              </h3>
              <p className="text-xs text-[#52635F] italic">
                "{s.refinedStory}"
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-[#DBEAFE] text-xs text-[#1E40AF]">
                <strong>Family Takeaway:</strong> {s.lifeLessonTakeaway}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

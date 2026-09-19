import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Mic 
} from 'lucide-react';
import { SeniorProfile, CareRequest, RequestCategory } from '../../shared/types';
import { VoiceInputNode } from './design-system/VoiceInputNode';
import { AccessibleButton } from './design-system/AccessibleButton';

interface RequestHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  senior: SeniorProfile;
  onCreateRequest: (newReq: CareRequest) => void;
}

export const RequestHelpModal: React.FC<RequestHelpModalProps> = ({
  isOpen,
  onClose,
  senior,
  onCreateRequest,
}) => {
  if (!isOpen) return null;

  const [inputMode, setInputMode] = useState<'voice' | 'preset'>('voice');
  const [category, setCategory] = useState<RequestCategory>('conversation');
  const [title, setTitle] = useState('Afternoon Tea & Gentle Conversation');
  const [description, setDescription] = useState('Would love a patient companion to visit, enjoy chamomile tea, and talk about gardening and favorite memories.');
  const [dateNeeded] = useState('Tomorrow afternoon around 2 PM');
  const [estimatedDuration, setEstimatedDuration] = useState('1 hour');
  const [safetyNotes] = useState('Visit in comfortable living room. Senior uses a cane.');
  const [auditing, setAuditing] = useState(false);
  const [safetyWarning, setSafetyWarning] = useState<string | null>(null);

  const oneTapPresets = [
    {
      label: '🫖 Friendly Tea & Conversation',
      cat: 'conversation' as RequestCategory,
      title: 'Afternoon Tea & Gentle Conversation',
      desc: 'Would love a patient companion to visit, enjoy chamomile tea, and talk about gardening and memories.',
      duration: '1 hour',
    },
    {
      label: '🥛 Milk, Bread & Fresh Fruit Pickup',
      cat: 'groceries' as RequestCategory,
      title: 'Pantry & Grocery Pickup from Neighborhood Store',
      desc: 'Need assistance picking up fresh whole milk, wheat bread, bananas, and oatmeal.',
      duration: '45 mins',
    },
    {
      label: '📱 Patient Tablet / Video Call Assistance',
      cat: 'tech_help' as RequestCategory,
      title: 'Help Setting Up Family Video Call on Tablet',
      desc: 'Need someone patient to show me how to answer incoming video calls from my son and grandchildren.',
      duration: '30 mins',
    },
    {
      label: '🩺 Doctor Appointment Escort',
      cat: 'appointment_escort' as RequestCategory,
      title: 'Accompaniment & Escort to Doctor Appointment',
      desc: 'Need a verified companion to accompany me to the clinic lobby and sit with me while waiting.',
      duration: '1.5 hours',
    },
  ];

  const handleApplyPreset = (preset: typeof oneTapPresets[0]) => {
    setCategory(preset.cat);
    setTitle(preset.title);
    setDescription(preset.desc);
    setEstimatedDuration(preset.duration);
    setInputMode('preset');
  };

  const handleVoiceConfirm = (spokenText: string) => {
    setDescription(spokenText);
    setTitle(spokenText.length > 35 ? spokenText.substring(0, 35) + '...' : spokenText);
    setInputMode('preset');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !description.trim() || auditing) return;

    setAuditing(true);
    setSafetyWarning(null);

    // Simulated verification logic
    setTimeout(() => {
      const newRequest: CareRequest = {
        id: `req-${Date.now()}`,
        seniorId: senior.id,
        seniorName: senior.name,
        seniorAge: senior.age,
        seniorAvatar: senior.avatar,
        neighborhood: senior.neighborhood,
        title,
        category,
        priority: 'routine',
        description,
        dateNeeded,
        estimatedDuration,
        status: 'open',
        safetyNotes,
        safetyPin: senior.safetyPin,
        isProfessionalOnly: category === 'professional_care',
        createdAt: new Date().toISOString().split('T')[0],
      };
      onCreateRequest(newRequest);
      setAuditing(false);
      onClose();
    }, 800);
  };

  return (
    <div 
      id="request-help-modal"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-labelledby="request-help-title"
    >
      <div className="bg-[#FAF6F0] rounded-3xl max-w-xl w-full border-2 border-[#EADCCB] shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#FFFDF9] px-6 py-4 border-b-2 border-[#EFE5D6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF9ED] text-[#D97706] flex items-center justify-center border border-[#FDE8C7]">
              <ShoppingBag className="w-6 h-6 text-[#D97706]" />
            </div>
            <div>
              <h3 id="request-help-title" className="font-serif-warm font-bold text-[#1E4D3B] text-xl">
                Ask for a Helping Hand
              </h3>
              <p className="text-xs text-[#7A6B5B]">
                Visible • Predictable • Speak or tap
              </p>
            </div>
          </div>

          <AccessibleButton
            variant="ghost"
            size="default"
            ariaLabel="Close Help Modal"
            onClick={onClose}
          >
            Close
          </AccessibleButton>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-[#FAF6F0]">
          {/* Method Chooser Tabs */}
          <div className="flex gap-2 bg-[#F2ECE0] p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setInputMode('voice')}
              className={`flex-1 py-3 rounded-xl text-base font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                inputMode === 'voice' ? 'bg-[#1E4D3B] text-white shadow-xs focus:ring-4 focus:ring-[#1E4D3B] focus:outline-none' : 'text-[#4A3C2F] hover:bg-white/60 focus:ring-4 focus:ring-[#EFE5D6] focus:outline-none'
              }`}
              aria-pressed={inputMode === 'voice'}
            >
              <Mic className="w-5 h-5" />
              <span>Speak What You Need</span>
            </button>

            <button
              type="button"
              onClick={() => setInputMode('preset')}
              className={`flex-1 py-3 rounded-xl text-base font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                inputMode === 'preset' ? 'bg-[#1E4D3B] text-white shadow-xs focus:ring-4 focus:ring-[#1E4D3B] focus:outline-none' : 'text-[#4A3C2F] hover:bg-white/60 focus:ring-4 focus:ring-[#EFE5D6] focus:outline-none'
              }`}
              aria-pressed={inputMode === 'preset'}
            >
              <span>One-Tap Choices</span>
            </button>
          </div>

          {inputMode === 'voice' ? (
            <VoiceInputNode
              onConfirmText={handleVoiceConfirm}
              placeholderText="Tap here and tell us what you need..."
            />
          ) : (
            <div className="bg-[#FFFDF7] p-4 rounded-2xl border-2 border-[#EEDBBA] space-y-3">
              <span className="text-base font-bold text-[#7A5828] block">
                Tap any common request below:
              </span>
              <div className="grid grid-cols-1 gap-3">
                {oneTapPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={`p-4 rounded-xl text-left border-2 text-base cursor-pointer transition-all min-h-[64px] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1E4D3B] ${
                      title === preset.title
                        ? 'bg-[#1E4D3B] text-white font-bold border-[#1E4D3B]'
                        : 'bg-white text-[#3D3126] border-[#E5D9C7] hover:bg-[#FAF5EE]'
                    }`}
                    aria-label={`Select preset: ${preset.label}`}
                  >
                    <span className="block font-bold">{preset.label}</span>
                    <span className={`text-sm block mt-1 ${title === preset.title ? 'text-[#C5E8D4]' : 'text-[#7A6B5B]'}`}>
                      Approx {preset.duration}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Request Review & Summary */}
          {inputMode === 'preset' && (
            <div className="bg-white border-2 border-[#E5D9C7] rounded-2xl p-5 space-y-3 shadow-sm">
              <span className="text-sm font-bold text-[#7A6B5B] uppercase tracking-wider block">
                Current Request Summary:
              </span>
              <h4 className="font-bold text-lg text-[#1E4D3B]">{title}</h4>
              <p className="text-base text-[#4A3C2F] italic">"{description}"</p>
            </div>
          )}

          {/* Secret Arrival PIN Reminder */}
          <div className="bg-[#EFF8F3] border-2 border-[#C5E8D4] p-5 rounded-2xl space-y-3 text-base text-[#1E4D3B]">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#1E4D3B]" />
                What happens next?
              </span>
              <span className="font-mono font-bold bg-white px-3 py-1 rounded-lg border-2 border-[#A7D7CB]">
                PIN: {senior.safetyPin}
              </span>
            </div>
            <p className="text-[#3E6554] leading-relaxed">
              1. A background-checked volunteer reviews your request.<br />
              2. You will see their verified photo and name.<br />
              3. Upon arrival, they must say your PIN: <strong>{senior.safetyPin}</strong>.
            </p>
          </div>

          {safetyWarning && (
            <div className="p-4 bg-[#FDF2F2] border-2 border-[#F8B4B4] text-[#B91C1C] rounded-2xl text-base font-bold" role="alert">
              {safetyWarning}
            </div>
          )}

          {/* Reversible Actions (Confirm vs Cancel) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <AccessibleButton
              variant="outline"
              size="large"
              ariaLabel="Cancel and close modal"
              onClick={onClose}
              className="w-full sm:flex-1"
            >
              Cancel
            </AccessibleButton>

            <AccessibleButton
              variant="primary"
              size="large"
              ariaLabel="Confirm and submit request"
              onClick={() => handleSubmit()}
              disabled={auditing || !title.trim()}
              className="w-full sm:flex-2"
            >
              {auditing ? 'Verifying Safe Protocol...' : 'Confirm Request'}
            </AccessibleButton>
          </div>
        </div>
      </div>
    </div>
  );
};

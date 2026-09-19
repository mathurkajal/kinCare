import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  X, 
  Volume2, 
  CheckCircle2, 
  ArrowRight,
  Heart,
  Smile,
  BookOpen
} from 'lucide-react';
import { SupportedLanguage } from '../../shared/types';
import { apiClient } from '../../infrastructure/services/apiClient';

interface SimplifyExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

export const SimplifyExplainerModal: React.FC<SimplifyExplainerModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  const sampleDocuments = [
    {
      title: 'Nurse Sarah’s Home Inspection Note',
      type: 'Clinical Home Care Report',
      text: 'Conducted fall-risk threshold inspection. Replaced loose hallway runner with non-skid backing. Sitting-to-standing balance is strong. Recommended daily 10-minute porch walks with her cane. Monitored bilateral lower extremity stability.',
    },
    {
      title: 'Prescription Medication Warning',
      type: 'Pharmacy Instructions',
      text: 'Take 1 tablet by mouth daily in the morning with food. Do not discontinue without consulting prescriber. May cause mild orthostatic hypotension upon rapid postural changes. Avoid concomitant intake with grapefruits.',
    },
    {
      title: 'Volunteer Visit Safety Agreement',
      type: 'Community Service Protocol',
      text: 'Both parties agree to in-person verification via two-factor secret PIN confirmation at residential threshold prior to physical ingress. Clinical interventions and financial remuneration are strictly prohibited pursuant to elder protection bylaws.',
    },
  ];

  const [rawText, setRawText] = useState(sampleDocuments[0].text);
  const [docType, setDocType] = useState(sampleDocuments[0].type);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    summaryTitle: string;
    simplifiedExplanation: string;
    actionItems: string[];
    reassuranceNote: string;
  } | null>(null);

  const handleSimplify = async (textToUse?: string, typeToUse?: string) => {
    const text = textToUse || rawText;
    const type = typeToUse || docType;
    if (!text.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const data = await apiClient.simplifyText({
        rawText: text,
        documentType: type,
        targetLanguage: language,
      });
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({
        summaryTitle: 'Key Points in Simple Words',
        simplifiedExplanation: 'This note confirms you are doing well and your living area is safe. Your caregiver or volunteer took care of the small details so you can be comfortable.',
        actionItems: [
          'Continue taking your pleasant morning walks with your cane.',
          'Always ask your arriving volunteer for their secret PIN before opening the door.',
          'Relax and have a nice cup of tea.'
        ],
        reassuranceNote: 'Everything is safe and well in hand. There are no worries.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = () => {
    if (!result || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const textToSpeak = `${result.summaryTitle}. ${result.simplifiedExplanation}. Here is what you need to do: ${result.actionItems.join('. ')}. ${result.reassuranceNote}`;
    const utter = new SpeechSynthesisUtterance(textToSpeak);
    utter.rate = 0.85;
    window.speechSynthesis.speak(utter);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in"
      role="dialog"
      aria-labelledby="simplify-modal-title"
    >
      <div className="bg-[#FFFDF9] rounded-3xl max-w-2xl w-full border-3 border-[#E5D7C2] shadow-2xl p-6 sm:p-8 space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#EFE5D6] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF8F3] text-[#1E4D3B] flex items-center justify-center border-2 border-[#BDE7D1]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 id="simplify-modal-title" className="font-serif-warm text-2xl sm:text-3xl font-bold text-[#1E4D3B]">
                Explain in Simple Words
              </h2>
              <p className="text-xs sm:text-sm text-[#736352]">
                We translate complicated medical reports, instructions, and forms into clear, plain words.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-[#FAF6EE] hover:bg-[#F0E6D5] text-[#5C4A3B] border border-[#E5D7C2] cursor-pointer btn-tactile shrink-0"
            aria-label="Close explainer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#7A6B5B] uppercase tracking-wider block">
            Choose an example or paste your own document:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleDocuments.map((doc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setRawText(doc.text);
                  setDocType(doc.type);
                  handleSimplify(doc.text, doc.type);
                }}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#FAF6EE] hover:bg-[#F2ECE0] text-[#4A3C2F] border border-[#E0D2BC] cursor-pointer btn-tactile"
              >
                {doc.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <div className="space-y-3">
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={4}
            placeholder="Paste any doctor note, insurance paper, or confusing instructions here..."
            className="w-full p-4 rounded-2xl bg-white border-2 border-[#D5C6B0] focus:border-[#1E4D3B] text-base text-[#2E241C] outline-hidden placeholder:text-[#9E8E7D]"
          />

          <button
            type="button"
            onClick={() => handleSimplify()}
            disabled={isLoading || !rawText.trim()}
            className="w-full py-4 rounded-2xl bg-[#1E4D3B] hover:bg-[#16382B] disabled:opacity-50 text-white font-bold text-base cursor-pointer flex items-center justify-center gap-2 btn-tactile shadow-sm"
          >
            <Sparkles className="w-5 h-5 text-[#86EFAC]" />
            <span>{isLoading ? 'Converting to Simple Words...' : 'Make This Easy to Understand'}</span>
          </button>
        </div>

        {/* Result Area */}
        {result && (
          <div className="bg-[#FAF7F0] p-6 rounded-3xl border-3 border-[#D5C6B0] space-y-4 animate-in fade-in">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#1E4D3B] bg-[#EFF8F3] px-2.5 py-0.5 rounded-full border border-[#BDE7D1]">
                  Plain English Summary
                </span>
                <h3 className="font-serif-warm text-2xl font-bold text-[#1E4D3B] mt-1.5">
                  {result.summaryTitle}
                </h3>
              </div>

              <button
                type="button"
                onClick={handleSpeak}
                className="p-3 rounded-2xl bg-white hover:bg-[#F2ECE0] border-2 border-[#D5C6B0] text-[#1E4D3B] cursor-pointer btn-tactile shrink-0"
                title="Read simple summary aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-base sm:text-lg text-[#2E241C] leading-relaxed font-medium bg-white p-4 rounded-2xl border border-[#E5D7C2]">
              {result.simplifiedExplanation}
            </p>

            {/* Action Items */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#635140] uppercase tracking-wider block">
                What you need to do:
              </span>
              <ul className="space-y-2">
                {result.actionItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-[#2E241C]">
                    <div className="w-5 h-5 rounded-full bg-[#1E4D3B] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reassurance */}
            <div className="p-3.5 bg-[#EFF8F3] rounded-2xl border border-[#BDE7D1] flex items-center gap-2.5 text-xs sm:text-sm text-[#1E4D3B] font-bold">
              <Smile className="w-5 h-5 shrink-0" />
              <span>{result.reassuranceNote}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

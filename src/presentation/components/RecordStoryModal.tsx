import React, { useState } from 'react';
import { 
  X, 
  Mic, 
  Square, 
  Sparkles, 
  BookOpen, 
  Volume2, 
  CheckCircle2, 
  Heart,
  VolumeX
} from 'lucide-react';
import { SeniorProfile, LifeStoryChapter } from '../../shared/types';
import { apiClient } from '../../infrastructure/services/apiClient';

interface RecordStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  senior: SeniorProfile;
  onSaveStory: (chapter: LifeStoryChapter) => void;
}

const STORY_PROMPTS = [
  {
    theme: 'Early Memories' as const,
    question: 'What was your favorite childhood possession or neighborhood game, and where did it take you in life?',
  },
  {
    theme: 'Love & Family' as const,
    question: 'What did decades of family life and companionship teach you about kindness through hard times?',
  },
  {
    theme: 'Life Lessons' as const,
    question: 'If you could send a letter back to your 20-year-old self, what mistake would you tell them not to worry about?',
  },
  {
    theme: 'Wisdom for Youth' as const,
    question: 'What simple daily habit has brought you the deepest contentment as the years passed?',
  },
];

export const RecordStoryModal: React.FC<RecordStoryModalProps> = ({
  isOpen,
  onClose,
  senior,
  onSaveStory,
}) => {
  if (!isOpen) return null;

  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSeconds, setRecordedSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [transcriptText, setTranscriptText] = useState(
    'When I was 16, my aunt gave me a small notebook and told me that our days pass like water through fingers unless we notice the quiet gifts. I started writing down the names of birds and small kindnesses neighbors did. That habit saved me through decades of hardship.'
  );
  const [synthesizing, setSynthesizing] = useState(false);
  const [previewChapter, setPreviewChapter] = useState<{
    title: string;
    refinedStory: string;
    lifeLessonTakeaway: string;
  } | null>(null);

  const selectedPrompt = STORY_PROMPTS[selectedPromptIndex];

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordedSeconds(0);
      const id = window.setInterval(() => {
        setRecordedSeconds(s => s + 1);
      }, 1000);
      setIntervalId(id);

      // Attempt live speech recognition if supported
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.lang = 'en-US';
          rec.continuous = true;
          rec.interimResults = true;
          rec.onresult = (e: any) => {
            let current = '';
            for (let i = 0; i < e.results.length; i++) {
              current += e.results[i][0].transcript + ' ';
            }
            if (current.trim()) {
              setTranscriptText(current.trim());
            }
          };
          rec.start();
          (window as any).__storyRecognition = rec;
        } catch (e) {
          console.warn('Speech rec error', e);
        }
      }
    } else {
      setIsRecording(false);
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      if ((window as any).__storyRecognition) {
        try {
          (window as any).__storyRecognition.stop();
        } catch (e) {
          // ignore
        }
      }
    }
  };

  const handleSynthesizeMemoir = async () => {
    if (!transcriptText.trim()) return;
    setSynthesizing(true);

    try {
      const data = await apiClient.transcribeMemoir({
        seniorName: senior.name,
        theme: selectedPrompt.theme,
        promptQuestion: selectedPrompt.question,
        rawTranscript: transcriptText,
      });

      setPreviewChapter({
        title: data.title,
        refinedStory: data.refinedStory,
        lifeLessonTakeaway: data.lifeLessonTakeaway,
      });
    } catch (err) {
      console.error(err);
      setPreviewChapter({
        title: `Treasured Reflection from ${senior.preferredName}`,
        refinedStory: transcriptText,
        lifeLessonTakeaway: 'Small everyday gifts of patience become our lasting family treasure.',
      });
    } finally {
      setSynthesizing(false);
    }
  };

  const handleSaveToFamilyVault = () => {
    if (!previewChapter) return;

    const chapter: LifeStoryChapter = {
      id: `story-${Date.now()}`,
      seniorId: senior.id,
      seniorName: senior.name,
      title: previewChapter.title,
      theme: selectedPrompt.theme,
      promptQuestion: selectedPrompt.question,
      audioDuration: `${Math.floor(recordedSeconds / 60)}m ${recordedSeconds % 60}s`,
      transcript: transcriptText,
      refinedStory: previewChapter.refinedStory,
      lifeLessonTakeaway: previewChapter.lifeLessonTakeaway,
      recordedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      isSharedWithFamily: true,
    };

    onSaveStory(chapter);
    onClose();
  };

  return (
    <div 
      id="record-story-modal"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-labelledby="story-modal-title"
    >
      <div className="bg-[#FAF6F0] rounded-3xl max-w-2xl w-full border-2 border-[#EADCCB] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#FFFDF9] px-6 py-4 border-b-2 border-[#EFE5D6] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center border border-[#BFDBFE] shadow-xs">
              <BookOpen className="w-6 h-6 text-[#2563EB]" />
            </div>
            <div>
              <h3 id="story-modal-title" className="font-serif-warm font-bold text-[#1E3A8A] text-xl">
                Family Memory Parlor
              </h3>
              <p className="text-xs text-[#6B7E9F]">
                Preserving {senior.name}'s voice & guidance for your loved ones
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="px-3 py-2 rounded-2xl border-2 border-[#E5D7C2] bg-white text-xs font-bold text-[#615140] hover:bg-[#F2ECE4] cursor-pointer btn-tactile"
            aria-label="Close memory parlor"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-[#FAF6F0]">
          {/* Prompt Chooser */}
          <div>
            <label className="text-xs font-bold text-[#4B5E88] block mb-2 uppercase tracking-wider">
              Choose a Life Story Topic (No typing needed):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STORY_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPromptIndex(idx);
                    setPreviewChapter(null);
                  }}
                  className={`p-3.5 rounded-2xl text-left border-2 text-xs cursor-pointer transition-all btn-tactile ${
                    selectedPromptIndex === idx
                      ? 'bg-[#1E40AF] text-white border-[#1E40AF] shadow-xs font-semibold'
                      : 'bg-white text-[#3B4D70] border-[#D8E2F2] hover:bg-[#F0F5FD]'
                  }`}
                >
                  <span className="block text-[11px] opacity-80 uppercase tracking-wide">
                    {p.theme}
                  </span>
                  <span className="line-clamp-2 mt-0.5 font-medium">{p.question}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Guiding Question */}
          <div className="bg-[#EFF6FF] border-2 border-[#BFDBFE] p-5 rounded-2xl">
            <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-wider block mb-1">
              Guiding Question for {senior.preferredName}:
            </span>
            <p className="font-serif-warm text-lg sm:text-xl text-[#1E3A8A] font-bold italic leading-snug">
              "{selectedPrompt.question}"
            </p>
          </div>

          {/* Audio & Speaking Card (Massive Voice Button) */}
          <div className="bg-white p-5 rounded-2xl border-2 border-[#E5D7C2] space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <button
                  onClick={toggleRecording}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white cursor-pointer transition-transform active:scale-95 shadow-xs btn-tactile ${
                    isRecording ? 'bg-[#C5221F] animate-pulse' : 'bg-[#1E4D3B] hover:bg-[#143528]'
                  }`}
                  aria-label={isRecording ? 'Stop recording voice' : 'Start speaking your story'}
                >
                  {isRecording ? <Square className="w-7 h-7" /> : <Mic className="w-8 h-8" />}
                </button>
                <div>
                  <strong className="text-base font-bold text-[#2E241C] block">
                    {isRecording ? 'Listening to your voice...' : 'Tap Microphone to Speak Your Story'}
                  </strong>
                  <span className="text-xs text-[#7A6B5B]">
                    {isRecording ? `Recording in progress: ${recordedSeconds}s` : 'Take all the time you need — speak naturally'}
                  </span>
                </div>
              </div>

              {recordedSeconds > 0 && !isRecording && (
                <span className="text-xs font-bold text-[#1E4D3B] bg-[#EFF8F3] px-3 py-1.5 rounded-full border border-[#BDE7D1] self-start sm:self-auto">
                  Voice recorded ({recordedSeconds}s)
                </span>
              )}
            </div>

            <textarea
              rows={4}
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              placeholder="Tell your story in your own words. You can speak with the microphone or edit words here..."
              className="w-full bg-[#FAF6EF] border-2 border-[#E5D7C2] focus:border-[#1E4D3B] rounded-2xl p-3.5 text-sm sm:text-base text-[#2E241C] focus:bg-white leading-relaxed"
            />

            <button
              onClick={handleSynthesizeMemoir}
              disabled={synthesizing || !transcriptText.trim()}
              className="w-full bg-[#1E40AF] hover:bg-[#18348C] disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-sm sm:text-base cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-2 btn-tactile"
            >
              <Sparkles className="w-5 h-5 text-[#BFDBFE]" />
              {synthesizing ? 'Weaving your memories into a chapter...' : 'Refine into Family Heirloom Keepsake'}
            </button>
          </div>

          {/* Keepsake Preview */}
          {previewChapter && (
            <div className="bg-[#EFF6FF] border-2 border-[#BFDBFE] p-6 rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-wider">
                  Memoir Keepsake Chapter Draft
                </span>
                <span className="text-[11px] bg-white text-[#1E40AF] px-3 py-1 rounded-full border border-[#93C5FD] font-bold">
                  Ready to Preserve
                </span>
              </div>

              <h4 className="font-serif-warm text-xl font-bold text-[#1E3A8A]">
                {previewChapter.title}
              </h4>
              <p className="text-sm sm:text-base text-[#334155] leading-relaxed italic">
                "{previewChapter.refinedStory}"
              </p>

              <div className="p-3.5 bg-white rounded-xl border border-[#DBEAFE] text-xs sm:text-sm text-[#1E40AF]">
                <strong>Lasting Lesson for Family:</strong> {previewChapter.lifeLessonTakeaway}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPreviewChapter(null)}
                  className="flex-1 bg-white hover:bg-[#F2ECE4] border-2 border-[#C5D3E8] text-[#3B4D70] py-3.5 rounded-2xl font-bold text-sm cursor-pointer transition-colors btn-tactile"
                >
                  Change Story
                </button>

                <button
                  onClick={handleSaveToFamilyVault}
                  className="flex-2 bg-[#1E4D3B] hover:bg-[#143528] text-white py-3.5 rounded-2xl font-bold text-sm cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-2 btn-tactile"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#86EFAC]" />
                  Save to Margaret's Family Archive
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

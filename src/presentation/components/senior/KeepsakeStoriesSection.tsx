import React from 'react';
import { BookOpen, Volume2 } from 'lucide-react';
import { LifeStoryChapter } from '../../../shared/types';

interface KeepsakeStoriesSectionProps {
  stories: LifeStoryChapter[];
  onOpenStoryModal: () => void;
  onSpeak: (text: string) => void;
}

export const KeepsakeStoriesSection: React.FC<KeepsakeStoriesSectionProps> = React.memo(({
  stories,
  onOpenStoryModal,
  onSpeak,
}) => {
  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#EFF6FF] text-[#2563EB] rounded-2xl">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E3A8A]">
              Your Preserved Life Stories & Wisdom
            </h3>
            <p className="text-xs sm:text-sm text-[#5A6D99]">
              Chapters and recordings shared with your family and grandchildren.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenStoryModal}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold cursor-pointer transition-colors shadow-xs btn-tactile"
        >
          + Add Another Memory
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {stories.map((story) => (
          <div
            key={story.id}
            className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-[#E8DFC9] space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                {story.theme}
              </span>
              <span className="text-xs text-[#7B8B88]">
                {story.recordedDate}
              </span>
            </div>

            <h4 className="font-serif-warm text-lg sm:text-xl font-bold text-[#1E3A8A]">
              "{story.title}"
            </h4>

            <p className="text-sm sm:text-base text-[#4E5E5A] leading-relaxed italic">
              "{story.refinedStory}"
            </p>

            <div className="p-3.5 bg-white rounded-xl border border-[#DDE7F7] text-xs sm:text-sm text-[#1E40AF]">
              <strong>Lesson for Youth:</strong> {story.lifeLessonTakeaway}
            </div>

            <button
              onClick={() => onSpeak(story.refinedStory)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#2563EB] font-bold hover:underline cursor-pointer pt-1"
            >
              <Volume2 className="w-4 h-4" /> Listen to this story read aloud
            </button>
          </div>
        ))}
      </div>
    </section>
  );
});

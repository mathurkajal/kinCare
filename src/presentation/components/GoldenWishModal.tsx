import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Heart, 
  CheckCircle2, 
  Calendar, 
  MapPin,
  Smile,
  Volume2
} from 'lucide-react';
import { SeniorProfile, GoldenWish } from '../../shared/types';

interface GoldenWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  senior: SeniorProfile;
  wishes: GoldenWish[];
  onCreateWish: (newWish: GoldenWish) => void;
  onPledgeWish: (wishId: string) => void;
}

export const GoldenWishModal: React.FC<GoldenWishModalProps> = ({
  isOpen,
  onClose,
  senior,
  wishes,
  onCreateWish,
  onPledgeWish,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'my_wishes' | 'create'>('my_wishes');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'nostalgia' | 'creative' | 'outing' | 'skill' | 'culinary' | 'connection'>('nostalgia');

  const wishInspirations = [
    {
      title: 'Hear Live Classical Piano Played in Person',
      category: 'creative' as const,
      desc: 'Would love to sit in a parlor chair and hear Chopin or Debussy played on a live piano by a visiting musician student.',
    },
    {
      title: 'Afternoon Stroll in a Botanical Orchid Greenhouse',
      category: 'outing' as const,
      desc: 'Would love a patient companion with a wheelchair or arm-in-arm support to take me to the conservatory to smell the blooming flowers.',
    },
    {
      title: 'Taste Vintage Homemade Cinnamon Apple Strudel',
      category: 'culinary' as const,
      desc: 'Looking for a volunteer baker willing to make traditional spiced strudel just like my mother made on autumn Sundays in 1955.',
    },
    {
      title: 'Listen to 1950s Big Band Jazz Vinyl Records',
      category: 'nostalgia' as const,
      desc: 'Would love someone who has a portable record player to bring vintage Glenn Miller and Ella Fitzgerald records to listen together.',
    },
  ];

  const handleApplyInspiration = (item: typeof wishInspirations[0]) => {
    setTitle(item.title);
    setDescription(item.desc);
    setCategory(item.category);
    setActiveTab('create');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const wish: GoldenWish = {
      id: `wish-${Date.now()}`,
      seniorId: senior.id,
      seniorName: senior.name,
      seniorAvatar: senior.avatar,
      title,
      description,
      category,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCreateWish(wish);
    setTitle('');
    setDescription('');
    setActiveTab('my_wishes');
  };

  return (
    <div 
      id="golden-wish-modal"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-labelledby="wish-modal-title"
    >
      <div className="bg-[#FAF6F0] rounded-3xl max-w-2xl w-full border-2 border-[#EADCCB] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#FFFDF9] px-6 py-4 border-b-2 border-[#EFE5D6] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF5FF] text-[#7C3AED] flex items-center justify-center border border-[#E9D5FF] shadow-xs">
              <Sparkles className="w-6 h-6 text-[#7C3AED]" />
            </div>
            <div>
              <h3 id="wish-modal-title" className="font-serif-warm font-bold text-[#581C87] text-xl">
                Golden Wishes & Dreams
              </h3>
              <p className="text-xs text-[#7A6B5B]">
                Fulfilling cherished life experiences with dignity & care
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="px-3 py-2 rounded-2xl border-2 border-[#E5D7C2] bg-white text-xs font-bold text-[#615140] hover:bg-[#F2ECE4] cursor-pointer btn-tactile"
            aria-label="Close golden wishes"
          >
            Close
          </button>
        </div>

        {/* Large Navigation Switcher */}
        <div className="px-6 pt-4 bg-[#FFFDF9] border-b-2 border-[#EFE5D6] flex gap-3">
          <button
            onClick={() => setActiveTab('my_wishes')}
            className={`pb-3 text-sm font-bold border-b-3 transition-colors cursor-pointer ${
              activeTab === 'my_wishes'
                ? 'border-[#7C3AED] text-[#581C87]'
                : 'border-transparent text-[#7B8B88] hover:text-[#2E241C]'
            }`}
          >
            Community Wishes ({wishes.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-3 text-sm font-bold border-b-3 transition-colors cursor-pointer ${
              activeTab === 'create'
                ? 'border-[#7C3AED] text-[#581C87]'
                : 'border-transparent text-[#7B8B88] hover:text-[#2E241C]'
            }`}
          >
            + Share a Cherished Wish
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-[#FAF6F0]">
          {activeTab === 'my_wishes' ? (
            <div className="space-y-4">
              {/* 1-Tap Inspirations */}
              <div className="bg-[#FFFDF7] border-2 border-[#EEDBBA] p-4 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-[#7A5828] uppercase tracking-wider block">
                  ✨ 1-Tap Wish Ideas (Tap any to make it your own without typing):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {wishInspirations.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplyInspiration(item)}
                      className="text-left bg-white border border-[#E5D7C2] hover:border-[#7C3AED] p-3 rounded-2xl text-xs text-[#4A3C2F] hover:bg-[#FAF5FF] cursor-pointer transition-all btn-tactile"
                    >
                      <strong className="block text-[#581C87] mb-0.5">{item.title}</strong>
                      <span className="text-[11px] text-[#7A6B5B] line-clamp-2">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {wishes.map((w) => (
                <div
                  key={w.id}
                  className="bg-white p-5 rounded-2xl border-2 border-[#EADCCB] shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider bg-[#FAF5FF] px-2.5 py-1 rounded-full border border-[#E9D5FF]">
                      {w.category.toUpperCase()}
                    </span>

                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      w.status === 'pledged'
                        ? 'bg-[#EFF8F3] text-[#1E4D3B] border border-[#B9E5CD]'
                        : 'bg-[#FFF9ED] text-[#B45309] border border-[#FDE68A]'
                    }`}>
                      {w.status === 'pledged' ? '✓ Volunteer Pledged' : 'Open for Community Pledges'}
                    </span>
                  </div>

                  <h4 className="font-serif-warm text-xl font-bold text-[#3B1561]">
                    {w.title}
                  </h4>

                  <p className="text-sm sm:text-base text-[#574838] leading-relaxed">
                    {w.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F3EDE2] text-xs text-[#8A7966]">
                    <span>Shared by {w.seniorName}</span>
                    {w.pledgedByVolunteerName && (
                      <span className="font-bold text-[#1E4D3B]">
                        Sponsored with warmth by {w.pledgedByVolunteerName}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#574838] block mb-1">
                  What is your cherished wish?
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Hear live violin music, visit a botanical garden..."
                  className="w-full bg-white border-2 border-[#E5D7C2] focus:border-[#7C3AED] rounded-2xl px-4 py-3 text-sm text-[#2E241C] outline-hidden font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#574838] block mb-1">
                  Tell us more about this dream:
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Why does this bring warmth to your heart? What would make it special?"
                  className="w-full bg-white border-2 border-[#E5D7C2] focus:border-[#7C3AED] rounded-2xl p-3.5 text-sm text-[#2E241C] outline-hidden font-medium"
                  required
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('my_wishes')}
                  className="flex-1 bg-white hover:bg-[#F2ECE4] border-2 border-[#D5C7B0] text-[#615140] py-3.5 rounded-2xl font-bold text-sm cursor-pointer transition-colors btn-tactile"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3.5 rounded-2xl font-bold text-sm sm:text-base cursor-pointer transition-colors shadow-xs btn-tactile"
                >
                  Share Wish with Community
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

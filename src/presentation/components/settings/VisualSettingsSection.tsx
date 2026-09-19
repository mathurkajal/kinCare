import React from 'react';
import { Eye, Type } from 'lucide-react';

interface VisualSettingsSectionProps {
  fontScale: 'standard' | 'large' | 'xlarge';
  onFontScaleChange: (scale: 'standard' | 'large' | 'xlarge') => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export const VisualSettingsSection: React.FC<VisualSettingsSectionProps> = ({
  fontScale,
  onFontScaleChange,
  highContrast,
  onToggleHighContrast,
  reducedMotion,
  onToggleReducedMotion,
}) => {
  return (
    <>
      {/* Visual Contrast & Smooth Motion */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center border border-[#FDE68A]">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E4D3B]">
              Visual Contrast & Smooth Motion
            </h3>
            <p className="text-xs sm:text-sm text-[#736352]">
              Special accommodations for low vision and motion sensitivity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* High Contrast Toggle */}
          <div className="p-5 rounded-2xl border-2 border-[#E5D7C2] bg-[#FAF7F0] flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between">
                <strong className="text-base text-[#2E241C] font-bold">High-Contrast Borders & Text</strong>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    highContrast ? 'bg-[#1E4D3B] text-white' : 'bg-[#E5D7C2] text-[#5C4A3B]'
                  }`}
                >
                  {highContrast ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#615140] mt-1.5 leading-relaxed">
                Applies bold black outlines, enhanced text contrast, and crisp borders exceeding WCAG AAA standards.
              </p>
            </div>

            <button
              type="button"
              onClick={onToggleHighContrast}
              className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm cursor-pointer btn-tactile ${
                highContrast
                  ? 'bg-[#1E4D3B] text-white'
                  : 'bg-white border-2 border-[#D5C6B0] text-[#3E3024] hover:bg-[#F2ECE4]'
              }`}
            >
              {highContrast ? '✓ High Contrast Enabled' : 'Enable High Contrast'}
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="p-5 rounded-2xl border-2 border-[#E5D7C2] bg-[#FAF7F0] flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between">
                <strong className="text-base text-[#2E241C] font-bold">Reduced Motion (No Animations)</strong>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    reducedMotion ? 'bg-[#1E4D3B] text-white' : 'bg-[#E5D7C2] text-[#5C4A3B]'
                  }`}
                >
                  {reducedMotion ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#615140] mt-1.5 leading-relaxed">
                Stops bouncy screen transitions, sliding dialogs, and decorative motions that might cause dizziness.
              </p>
            </div>

            <button
              type="button"
              onClick={onToggleReducedMotion}
              className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm cursor-pointer btn-tactile ${
                reducedMotion
                  ? 'bg-[#1E4D3B] text-white'
                  : 'bg-white border-2 border-[#D5C6B0] text-[#3E3024] hover:bg-[#F2ECE4]'
              }`}
            >
              {reducedMotion ? '✓ Motion Reduced' : 'Turn Off Motion'}
            </button>
          </div>
        </div>
      </div>

      {/* Text Size Customizer */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#EFE5D6] shadow-xs space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF8F3] text-[#1E4D3B] flex items-center justify-center border border-[#BDE7D1]">
            <Type className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-[#1E4D3B]">
              Text Size for Comfortable Reading
            </h3>
            <p className="text-xs sm:text-sm text-[#736352]">
              Choose the size that feels easiest and clearest on your eyes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => onFontScaleChange('standard')}
            className={`p-5 rounded-3xl border-3 text-left cursor-pointer transition-all btn-tactile ${
              fontScale === 'standard'
                ? 'bg-[#1E4D3B] text-white border-[#1E4D3B] shadow-sm'
                : 'bg-[#FAF7F0] text-[#4A3C2F] border-[#E5D9C7] hover:bg-[#F2E8D8]'
            }`}
          >
            <span className="block font-bold text-lg">Normal Size</span>
            <span
              className={`text-xs block mt-1 ${
                fontScale === 'standard' ? 'text-[#C5E8D4]' : 'text-[#7A6B5B]'
              }`}
            >
              Standard book text
            </span>
          </button>

          <button
            type="button"
            onClick={() => onFontScaleChange('large')}
            className={`p-5 rounded-3xl border-3 text-left cursor-pointer transition-all btn-tactile ${
              fontScale === 'large'
                ? 'bg-[#1E4D3B] text-white border-[#1E4D3B] shadow-sm'
                : 'bg-[#FAF7F0] text-[#4A3C2F] border-[#E5D9C7] hover:bg-[#F2E8D8]'
            }`}
          >
            <span className="block font-bold text-xl">Large Size</span>
            <span
              className={`text-xs block mt-1 ${
                fontScale === 'large' ? 'text-[#C5E8D4]' : 'text-[#7A6B5B]'
              }`}
            >
              Generous, easy reading
            </span>
          </button>

          <button
            type="button"
            onClick={() => onFontScaleChange('xlarge')}
            className={`p-5 rounded-3xl border-3 text-left cursor-pointer transition-all btn-tactile ${
              fontScale === 'xlarge'
                ? 'bg-[#1E4D3B] text-white border-[#1E4D3B] shadow-sm'
                : 'bg-[#FAF7F0] text-[#4A3C2F] border-[#E5D9C7] hover:bg-[#F2E8D8]'
            }`}
          >
            <span className="block font-black text-2xl">Extra+ Large</span>
            <span
              className={`text-xs block mt-1 ${
                fontScale === 'xlarge' ? 'text-[#C5E8D4]' : 'text-[#7A6B5B]'
              }`}
            >
              Maximum clear magnification
            </span>
          </button>
        </div>

        {/* Live Preview Box */}
        <div className="bg-[#FAF7F0] p-5 rounded-2xl border-2 border-[#E7DDCB] space-y-1">
          <span className="text-xs text-[#7A6B5B] uppercase font-bold tracking-wider">
            Sample Preview:
          </span>
          <p className="font-serif-warm text-base sm:text-lg text-[#2E241C] italic">
            "Good morning Margaret. It is a lovely sunny day in Oakridge."
          </p>
        </div>
      </div>
    </>
  );
};

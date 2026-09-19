import React, { useState } from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  AlertOctagon, 
  HelpCircle, 
  ChevronDown,
  User,
  Coffee,
  Sparkles,
  Sun,
  Home,
  MessageSquareHeart,
  ShoppingBag,
  BookOpen,
  Users,
  Settings as SettingsIcon,
  ArrowLeft
} from 'lucide-react';
import { UserRole, SeniorNavSection, SupportedLanguage } from '../../shared/types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../../shared/utils/i18n';
import { Globe, Eye, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  seniorNavSection: SeniorNavSection;
  onSeniorNavChange: (section: SeniorNavSection) => void;
  fontScale: 'standard' | 'large' | 'xlarge';
  onFontScaleChange: (scale: 'standard' | 'large' | 'xlarge') => void;
  onTriggerSOS: () => void;
  onOpenSafetyProtocol: () => void;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
  language?: SupportedLanguage;
  onLanguageChange?: (lang: SupportedLanguage) => void;
  highContrast?: boolean;
  onToggleHighContrast?: () => void;
  onOpenScamShield?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  seniorNavSection,
  onSeniorNavChange,
  fontScale,
  onFontScaleChange,
  onTriggerSOS,
  onOpenSafetyProtocol,
  isVoiceActive,
  onToggleVoice,
  language = 'en',
  onLanguageChange,
  highContrast = false,
  onToggleHighContrast,
  onOpenScamShield,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'A peaceful morning';
    if (hour < 17) return 'A warm afternoon';
    return 'A calm evening';
  };

  const roleLabels: Record<UserRole, { title: string; subtitle: string; icon: string }> = {
    elderly: { title: 'Margaret Higgins', subtitle: 'Senior Resident', icon: '👵' },
    volunteer: { title: 'David Chen', subtitle: 'Verified Companion', icon: '🤝' },
    professional: { title: 'Sarah Jenkins, RN', subtitle: 'Licensed Healthcare Provider', icon: '🩺' },
    guardian: { title: 'David Higgins (Son)', subtitle: 'Family Guardian Circle', icon: '🏡' },
  };

  const primaryNavItems: { id: SeniorNavSection; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'talk', label: 'Talk', icon: <MessageSquareHeart className="w-5 h-5" /> },
    { id: 'help', label: 'Help', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'wishes', label: 'My Wishes', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'stories', label: 'My Stories', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'trusted_people', label: 'Trusted People', icon: <Users className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  return (
    <header className="bg-[#FFFDF9] border-b-2 border-[#EFE5D6] sticky top-0 z-40 shadow-xs">
      {/* Top Comfort Bar: Time, Read Screen, Text Size & Role */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-[#F5EDE0] text-xs">
        <div className="flex items-center gap-2 text-[#65584A]">
          <Sun className="w-4 h-4 text-[#D97706]" />
          <span className="font-semibold">{getGreeting()}</span>
          <span className="text-[#D3C4B0]">•</span>
          <span>Oakridge Community Care Network</span>
        </div>

        {/* Font Accessibility & Voice Reading Mode */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          {/* Read Screen Aloud Button */}
          <button
            onClick={onToggleVoice}
            className={`px-3 py-1.5 rounded-full border-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all btn-tactile ${
              isVoiceActive 
                ? 'bg-[#1E4D3B] text-[#FFFDF9] border-[#1E4D3B]' 
                : 'bg-[#FBF6EE] text-[#544434] border-[#E8DCCB] hover:bg-[#F5ECD9]'
            }`}
            aria-label="Read Screen Aloud Toggle"
          >
            {isVoiceActive ? <Volume2 className="w-4 h-4 text-[#7CE0B8]" /> : <VolumeX className="w-4 h-4 text-[#998772]" />}
            <span>{isVoiceActive ? 'Voice Reading: On' : 'Read Screen to Me'}</span>
          </button>

          {/* Quick Text Size Switcher */}
          <div className="hidden sm:flex items-center bg-[#F8F2E6] border border-[#E5D9C4] rounded-full p-1 gap-1">
            <span className="text-[11px] text-[#7A6B5B] px-1.5 font-semibold">Text:</span>
            <button
              onClick={() => onFontScaleChange('standard')}
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                fontScale === 'standard' ? 'bg-[#1E4D3B] text-white shadow-xs' : 'text-[#615140] hover:bg-[#EFE4D0]'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => onFontScaleChange('large')}
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                fontScale === 'large' ? 'bg-[#1E4D3B] text-white shadow-xs' : 'text-[#615140] hover:bg-[#EFE4D0]'
              }`}
            >
              Large
            </button>
            <button
              onClick={() => onFontScaleChange('xlarge')}
              className={`px-2.5 py-0.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                fontScale === 'xlarge' ? 'bg-[#1E4D3B] text-white shadow-xs' : 'text-[#615140] hover:bg-[#EFE4D0]'
              }`}
            >
              Extra+
            </button>
          </div>

          {/* Language Selector */}
          {onLanguageChange && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="px-2.5 py-1 rounded-full bg-[#FBF6EE] hover:bg-[#F5ECD9] border border-[#E8DCCB] text-[#544434] text-xs font-bold flex items-center gap-1.5 cursor-pointer btn-tactile"
                aria-label="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-[#1E4D3B]" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-[#998772]" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-[#EADCCB] rounded-2xl shadow-xl z-50 p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                  <span className="text-[10px] uppercase font-bold text-[#8C7B6A] px-2.5 py-1 block">
                    Choose Language:
                  </span>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                        language === lang.code
                          ? 'bg-[#1E4D3B] text-white'
                          : 'text-[#423425] hover:bg-[#FAF6F0]'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className={`text-[10px] ${language === lang.code ? 'text-[#C5E8D4]' : 'text-[#8A7966]'}`}>
                        {lang.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* High Contrast Toggle */}
          {onToggleHighContrast && (
            <button
              type="button"
              onClick={onToggleHighContrast}
              className={`p-1.5 rounded-full border text-xs font-bold flex items-center cursor-pointer transition-colors ${
                highContrast 
                  ? 'bg-black text-yellow-300 border-yellow-300' 
                  : 'bg-[#FBF6EE] text-[#544434] border-[#E8DCCB] hover:bg-[#F5ECD9]'
              }`}
              title="Toggle High Contrast for Vision Clarity"
              aria-label="Toggle High Contrast"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {/* Quick Scam Checker */}
          {onOpenScamShield && (
            <button
              type="button"
              onClick={onOpenScamShield}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] text-xs font-bold cursor-pointer btn-tactile"
              title="Verify suspicious message or phone call"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Scam Check</span>
            </button>
          )}

          {/* Persona Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="bg-[#FBF7F0] hover:bg-[#F5EDE0] border border-[#E8DCCB] text-[#423425] px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              aria-expanded={roleMenuOpen}
            >
              <span>{roleLabels[currentRole].icon}</span>
              <span className="font-bold text-[#1E4D3B] hidden md:inline">{roleLabels[currentRole].title}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8C7B6A]" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-[#EADCCB] rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <span className="text-[10px] uppercase font-bold text-[#8C7B6A] px-3 py-1 block">
                  Switch System Perspective:
                </span>
                {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleChange(role);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 cursor-pointer transition-colors ${
                      currentRole === role
                        ? 'bg-[#1E4D3B] text-white'
                        : 'text-[#423425] hover:bg-[#FAF6F0]'
                    }`}
                  >
                    <span className="text-base">{roleLabels[role].icon}</span>
                    <div>
                      <span className="block leading-tight">{roleLabels[role].title}</span>
                      <span className={`text-[10px] block ${currentRole === role ? 'text-[#C5E8D4]' : 'text-[#8A7966]'}`}>
                        {roleLabels[role].subtitle}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar: LEFT (Home / Back) | CENTER (Current Task) | RIGHT (Help, Emergency) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* LEFT: Constant Predictable Home / Back Button */}
        <div className="flex items-center gap-3">
          {seniorNavSection !== 'home' && currentRole === 'elderly' ? (
            <button
              onClick={() => onSeniorNavChange('home')}
              className="px-4 py-2.5 rounded-2xl bg-[#FFFDF9] hover:bg-[#F5EDE0] border-2 border-[#D5C6B0] text-sm sm:text-base font-bold text-[#1E4D3B] flex items-center gap-2 cursor-pointer btn-tactile shadow-xs"
              aria-label="Go back to Home living room"
            >
              <ArrowLeft className="w-5 h-5 text-[#1E4D3B]" />
              <span>← Back to Home</span>
            </button>
          ) : (
            <button
              onClick={() => onSeniorNavChange('home')}
              className="flex items-center gap-3 cursor-pointer text-left group"
              aria-label="KinCare Home"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#1E4D3B] text-[#FFFDF9] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-6 h-6 text-[#86EFAC]" />
              </div>
              <div>
                <span className="font-serif-warm text-2xl font-bold text-[#1E4D3B] tracking-tight block leading-none">
                  KinCare
                </span>
                <span className="text-[11px] text-[#7A6B5B] font-medium hidden sm:block mt-0.5">
                  Margaret's Safe Home
                </span>
              </div>
            </button>
          )}
        </div>

        {/* CENTER: Current Task Indicator */}
        <div className="hidden md:flex items-center justify-center">
          <div className="px-4 py-1.5 rounded-full bg-[#FAF7F0] border border-[#E8DDCB] text-xs font-bold text-[#655543] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1E4D3B]"></span>
            <span>Current Place:</span>
            <span className="text-[#1E4D3B] font-black uppercase tracking-wide">
              {seniorNavSection === 'home' && 'Living Room Hearth'}
              {seniorNavSection === 'talk' && 'Friendly Talk & Tea'}
              {seniorNavSection === 'help' && 'Ask for a Helping Hand'}
              {seniorNavSection === 'wishes' && 'Golden Wishes & Dreams'}
              {seniorNavSection === 'stories' && 'Family Memory Parlor'}
              {seniorNavSection === 'trusted_people' && 'Margaret’s Trusted Circle'}
              {seniorNavSection === 'settings' && 'Comfort & Text Settings'}
            </span>
          </div>
        </div>

        {/* RIGHT: Constant Predictable Actions (Doorstep PIN Help & Emergency SOS) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSafetyProtocol}
            className="px-3 sm:px-4 py-2.5 rounded-2xl bg-[#EFF8F3] hover:bg-[#E2F3E9] border-2 border-[#C5E8D4] text-xs sm:text-sm font-bold text-[#1E4D3B] flex items-center gap-1.5 cursor-pointer btn-tactile"
            aria-label="Safety & Doorstep PIN protocol"
          >
            <ShieldCheck className="w-4 h-4 text-[#1E4D3B]" />
            <span className="hidden sm:inline">Safety Help & PIN</span>
            <span className="sm:hidden">PIN</span>
          </button>

          {/* Constant Red Emergency SOS Button - Never moved, always right */}
          <button
            onClick={onTriggerSOS}
            className="bg-[#B91C1C] hover:bg-[#991B1B] text-white px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md btn-tactile"
            aria-label="Trigger Emergency Help"
          >
            <AlertOctagon className="w-5 h-5 text-white animate-pulse" />
            <span className="font-extrabold tracking-wide">URGENT HELP</span>
          </button>
        </div>
      </div>

      {/* PRIMARY NAVIGATION (7 Core Sections: Home, Talk, Help, My Wishes, My Stories, Trusted People, Settings) */}
      {currentRole === 'elderly' && (
        <nav 
          aria-label="Primary Navigation" 
          className="bg-[#FAF7F0] border-t-2 border-[#EFE5D6] overflow-x-auto scrollbar-none"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 sm:gap-3 py-2 min-w-max">
            {primaryNavItems.map((item) => {
              const isActive = seniorNavSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSeniorNavChange(item.id)}
                  className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all btn-tactile ${
                    isActive
                      ? 'bg-[#1E4D3B] text-white shadow-xs ring-2 ring-[#1E4D3B]'
                      : 'bg-white text-[#4A3E31] border-2 border-[#E5DAC8] hover:bg-[#F2ECE0] hover:text-[#1E4D3B]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={isActive ? 'text-[#86EFAC]' : 'text-[#655543]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};

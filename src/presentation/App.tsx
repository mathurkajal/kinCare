import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SeniorView } from './components/SeniorView';
import { ReadAloudPlayer } from './components/ReadAloudPlayer';
import { OneHandBottomDock } from './components/OneHandBottomDock';

// Lazy load secondary role views to keep the elder primary bundle minimal & high-efficiency
const VolunteerView = React.lazy(() => import('./components/VolunteerView').then(m => ({ default: m.VolunteerView })));
const ProfessionalView = React.lazy(() => import('./components/ProfessionalView').then(m => ({ default: m.ProfessionalView })));
const GuardianView = React.lazy(() => import('./components/GuardianView').then(m => ({ default: m.GuardianView })));
const TrustedPeopleView = React.lazy(() => import('./components/TrustedPeopleView').then(m => ({ default: m.TrustedPeopleView })));
const SeniorSettingsView = React.lazy(() => import('./components/SeniorSettingsView').then(m => ({ default: m.SeniorSettingsView })));

import { useAccessibility } from './hooks/useAccessibility';
import { useElderData } from './hooks/useElderData';

import { 
  UserRole, 
  SeniorNavSection,
  ProactiveSuggestion,
} from '../shared/types';

// Code-Splitting & Lazy Loading for Modals: Optimizes initial bundle size and FCP/TTI efficiency
const CompanionChatModal = React.lazy(() => import('./components/CompanionChatModal').then(m => ({ default: m.CompanionChatModal })));
const RecordStoryModal = React.lazy(() => import('./components/RecordStoryModal').then(m => ({ default: m.RecordStoryModal })));
const RequestHelpModal = React.lazy(() => import('./components/RequestHelpModal').then(m => ({ default: m.RequestHelpModal })));
const GoldenWishModal = React.lazy(() => import('./components/GoldenWishModal').then(m => ({ default: m.GoldenWishModal })));
const EmergencySOSModal = React.lazy(() => import('./components/EmergencySOSModal').then(m => ({ default: m.EmergencySOSModal })));
const SafetyProtocolModal = React.lazy(() => import('./components/SafetyProtocolModal').then(m => ({ default: m.SafetyProtocolModal })));
const VisitVerificationModal = React.lazy(() => import('./components/VisitVerificationModal').then(m => ({ default: m.VisitVerificationModal })));
const HandsFreeVoiceOverlay = React.lazy(() => import('./components/HandsFreeVoiceOverlay').then(m => ({ default: m.HandsFreeVoiceOverlay })));
const ScamShieldModal = React.lazy(() => import('./components/ScamShieldModal').then(m => ({ default: m.ScamShieldModal })));
const SimplifyExplainerModal = React.lazy(() => import('./components/SimplifyExplainerModal').then(m => ({ default: m.SimplifyExplainerModal })));
const VerificationDrawerModal = React.lazy(() => import('./components/VerificationDrawerModal').then(m => ({ default: m.VerificationDrawerModal })));
const CommunityReportModal = React.lazy(() => import('./components/CommunityReportModal').then(m => ({ default: m.CommunityReportModal })));

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('elderly');
  const [seniorNavSection, setSeniorNavSection] = useState<SeniorNavSection>('home');

  // Accessibility State & Synchronization Hook
  const {
    fontScale,
    setFontScale,
    isVoiceActive,
    setIsVoiceActive,
    isHandsFreeActive,
    setIsHandsFreeActive,
    handPreference,
    setHandPreference,
    isOneHandMode,
    setIsOneHandMode,
    language,
    setLanguage,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
    privacyShield,
    setPrivacyShield,
  } = useAccessibility();

  // Domain State & Business Handlers Hook
  const {
    senior,
    volunteer,
    professional,
    requests,
    setRequests,
    wishes,
    stories,
    auditLogs,
    proactiveSuggestions,
    careNotes,
    setCareNotes,
    checkInToday,
    resetCheckIn,
    saveStory,
    createRequest,
    createWish,
    pledgeWish,
    dismissSuggestion,
    completeVisit,
  } = useElderData();

  const [readAloudState, setReadAloudState] = useState<{ isOpen: boolean; text: string; pageTitle: string }>({
    isOpen: false,
    text: '',
    pageTitle: '',
  });

  // Modal visibility states
  const [isTalkModalOpen, setIsTalkModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isWishModalOpen, setIsWishModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [isSafetyProtocolOpen, setIsSafetyProtocolOpen] = useState(false);
  const [isScamShieldOpen, setIsScamShieldOpen] = useState(false);
  const [isSimplifyModalOpen, setIsSimplifyModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedVisitRequestId, setSelectedVisitRequestId] = useState<string | null>(null);

  const handleToggleVoice = () => {
    setIsVoiceActive((prev) => {
      const newState = !prev;
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        if (newState) {
          const utter = new SpeechSynthesisUtterance("Voice reading mode enabled. You can now tap any section or button to listen to it read aloud at a gentle pace.");
          utter.rate = 0.88;
          window.speechSynthesis.speak(utter);
        }
      }
      return newState;
    });
  };

  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.88;
      utter.pitch = 1.0;
      window.speechSynthesis.speak(utter);
    }
  };

  const handleAcceptSuggestion = (suggestion: ProactiveSuggestion) => {
    dismissSuggestion(suggestion.id);
    if (suggestion.actionType === 'open_visit_details') {
      setIsSafetyProtocolOpen(true);
    } else if (suggestion.actionType === 'accept_help') {
      setIsStoryModalOpen(true);
    } else {
      handleSpeakText(`You accepted: ${suggestion.title}. Thank you, ${senior.preferredName}.`);
    }
  };

  // Read Aloud triggering (Requirement 8: Read This To Me)
  const handleTriggerReadCurrentPage = (customText?: string, customTitle?: string) => {
    let title = customTitle || 'Margaret\'s Living Room';
    let text = customText || '';

    if (!text) {
      if (seniorNavSection === 'home') {
        title = "Living Room & Morning Greeting";
        text = `Good morning ${senior.preferredName}. You are in your peaceful living room. Your secret doorstep arrival code is ${senior.safetyPin}. You can tap one of the large buttons below to tell us how you are feeling, talk with a gentle companion, ask for groceries, tell a life story, or make a cherished dream.`;
      } else if (seniorNavSection === 'trusted_people') {
        title = "Margaret's Trusted Circle";
        text = `Here is your verified care and support circle. Your son ${senior.guardianContact.name} receives your daily morning messages. David Chen is your verified volunteer companion. Sarah Jenkins is your licensed healthcare provider. Never open your door unless your visitor recites your secret PIN, ${senior.safetyPin}.`;
      } else if (seniorNavSection === 'settings') {
        title = "Screen Comfort & Accessibility Settings";
        text = `In comfort settings, you can adjust text size between normal, large, and extra-large. You can turn on hands-free voice control to speak commands naturally. You can also adjust your left or right hand preference.`;
      } else {
        text = `Welcome to KinCare. Technology that gently adapts to you with safety, comfort, and dignity.`;
      }
    }

    setReadAloudState({
      isOpen: true,
      text,
      pageTitle: title,
    });
  };

  const handleSeniorNavChange = (section: SeniorNavSection) => {
    setSeniorNavSection(section);
    if (section === 'talk') setIsTalkModalOpen(true);
    else if (section === 'help') setIsHelpModalOpen(true);
    else if (section === 'wishes') setIsWishModalOpen(true);
    else if (section === 'stories') setIsStoryModalOpen(true);
  };

  // Accept volunteer request
  const handleAcceptRequest = (requestId: string) => {
    setRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'matched',
            assignedVolunteerId: volunteer.id,
            assignedVolunteerName: volunteer.name,
            assignedVolunteerAvatar: volunteer.avatar,
          };
        }
        return r;
      })
    );
  };

  // Accept clinical professional request
  const handleAcceptClinicalRequest = (requestId: string) => {
    setRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'matched',
            assignedVolunteerId: professional.id,
            assignedVolunteerName: professional.name,
            assignedVolunteerAvatar: professional.avatar,
          };
        }
        return r;
      })
    );
  };

  const handleAddCareNote = (seniorName: string, text: string) => {
    const newNote = {
      id: `note-${Date.now()}`,
      seniorName,
      author: `${professional.name} (${professional.verificationBadge})`,
      text,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setCareNotes(prev => [newNote, ...prev]);
  };

  const activeVisitRequest = requests.find(r => r.id === selectedVisitRequestId) || requests[0];

  return (
    <div className={`min-h-screen bg-[#FAF6F0] text-[#2E241C] flex flex-col font-scale-${fontScale} ${
      isOneHandMode ? 'pb-24' : ''
    }`}>
      {/* Top Accessible Warm Header */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        seniorNavSection={seniorNavSection}
        onSeniorNavChange={handleSeniorNavChange}
        fontScale={fontScale}
        onFontScaleChange={setFontScale}
        onTriggerSOS={() => setIsSOSModalOpen(true)}
        onOpenSafetyProtocol={() => setIsSafetyProtocolOpen(true)}
        isVoiceActive={isVoiceActive}
        onToggleVoice={handleToggleVoice}
        language={language}
        onLanguageChange={setLanguage}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(prev => !prev)}
        onOpenScamShield={() => setIsScamShieldOpen(true)}
      />

      {/* Main Living Room Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <React.Suspense fallback={<div className="p-12 text-center text-[#736352] font-serif-warm text-lg">Loading KinCare view...</div>}>
        {currentRole === 'elderly' && (
          <>
            {seniorNavSection === 'trusted_people' ? (
              <TrustedPeopleView
                senior={senior}
                onOpenSafetyProtocol={() => setIsSafetyProtocolOpen(true)}
                onSpeakText={handleSpeakText}
              />
            ) : seniorNavSection === 'settings' ? (
              <SeniorSettingsView
                senior={senior}
                fontScale={fontScale}
                onFontScaleChange={setFontScale}
                isVoiceActive={isVoiceActive}
                onToggleVoice={handleToggleVoice}
                handPreference={handPreference}
                onHandPreferenceChange={setHandPreference}
                isOneHandMode={isOneHandMode}
                onToggleOneHandMode={() => setIsOneHandMode(prev => !prev)}
                isHandsFreeActive={isHandsFreeActive}
                onToggleHandsFree={() => setIsHandsFreeActive(prev => !prev)}
                language={language}
                onLanguageChange={setLanguage}
                highContrast={highContrast}
                onToggleHighContrast={() => setHighContrast(prev => !prev)}
                reducedMotion={reducedMotion}
                onToggleReducedMotion={() => setReducedMotion(prev => !prev)}
                privacyShield={privacyShield}
                onTogglePrivacyShield={() => setPrivacyShield(prev => !prev)}
                onOpenScamShield={() => setIsScamShieldOpen(true)}
                onOpenSimplifyModal={() => setIsSimplifyModalOpen(true)}
                onOpenVerificationModal={() => setIsVerificationModalOpen(true)}
                onSpeakText={handleSpeakText}
              />
            ) : (
              <SeniorView
                senior={senior}
                requests={requests}
                wishes={wishes}
                stories={stories}
                language={language}
                privacyShield={privacyShield}
                proactiveSuggestions={proactiveSuggestions}
                onAcceptSuggestion={handleAcceptSuggestion}
                onDismissSuggestion={dismissSuggestion}
                onCheckInToday={checkInToday}
                onResetCheckIn={resetCheckIn}
                onOpenTalkModal={() => {
                  setSeniorNavSection('talk');
                  setIsTalkModalOpen(true);
                }}
                onOpenHelpModal={() => {
                  setSeniorNavSection('help');
                  setIsHelpModalOpen(true);
                }}
                onOpenWishModal={() => {
                  setSeniorNavSection('wishes');
                  setIsWishModalOpen(true);
                }}
                onOpenStoryModal={() => {
                  setSeniorNavSection('stories');
                  setIsStoryModalOpen(true);
                }}
                onTriggerSOS={() => setIsSOSModalOpen(true)}
                onOpenSafetyDetails={() => setIsSafetyProtocolOpen(true)}
                onOpenScamShield={() => setIsScamShieldOpen(true)}
                onOpenSimplifyModal={() => setIsSimplifyModalOpen(true)}
                onOpenVerificationModal={() => setIsVerificationModalOpen(true)}
                onOpenReportModal={() => setIsReportModalOpen(true)}
                onSpeakText={handleSpeakText}
              />
            )}
          </>
        )}

        {currentRole === 'volunteer' && (
          <VolunteerView
            volunteer={volunteer}
            requests={requests}
            wishes={wishes}
            onAcceptRequest={handleAcceptRequest}
            onOpenVisitPinModal={(reqId) => setSelectedVisitRequestId(reqId)}
            onPledgeWish={(wishId) => pledgeWish(wishId)}
            onOpenSafetyCode={() => setIsSafetyProtocolOpen(true)}
          />
        )}

        {currentRole === 'professional' && (
          <ProfessionalView
            professional={professional}
            requests={requests}
            onAcceptClinicalRequest={handleAcceptClinicalRequest}
            onAddCareNote={handleAddCareNote}
          />
        )}

        {currentRole === 'guardian' && (
          <GuardianView
            senior={senior}
            auditLogs={auditLogs}
            stories={stories}
            requests={requests}
            careNotes={careNotes}
            onTriggerSOS={() => setIsSOSModalOpen(true)}
            onOpenStoryModal={() => setIsStoryModalOpen(true)}
          />
        )}
        </React.Suspense>
      </main>

      {/* Warm Peace-of-Mind Footer */}
      <footer className="bg-[#FFFDF9] border-t-2 border-[#EFE5D6] py-7 px-4 text-center text-xs text-[#7A6B5B] mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-serif-warm font-bold text-[#1E4D3B] text-base">KinCare</span>
            <span>•</span>
            <span>Where technology gently adapts to you, with safety and dignity.</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleTriggerReadCurrentPage()}
              className="text-[#1E4D3B] hover:underline cursor-pointer font-bold"
            >
              ▶ Read This Page to Me
            </button>
            <span className="text-[#D3C4B0]">•</span>
            <button
              type="button"
              onClick={() => setIsSafetyProtocolOpen(true)}
              className="text-[#1E4D3B] hover:underline cursor-pointer font-bold"
            >
              Safety Guidelines & Arrival PIN Standards
            </button>
          </div>
        </div>
      </footer>

      {/* Optional One-Hand Bottom Dock on Mobile */}
      {(isOneHandMode || currentRole === 'elderly') && (
        <OneHandBottomDock
          handPreference={handPreference}
          activeSection={seniorNavSection}
          onNavigate={handleSeniorNavChange}
          onTriggerSOS={() => setIsSOSModalOpen(true)}
          onOpenVoice={() => {
            setSeniorNavSection('talk');
            setIsTalkModalOpen(true);
          }}
          onReadAloud={() => handleTriggerReadCurrentPage()}
        />
      )}

      {/* Hands-Free Voice Assistant Controller & Floating Overlay */}
      <HandsFreeVoiceOverlay
        isHandsFreeActive={isHandsFreeActive}
        onToggleHandsFree={() => setIsHandsFreeActive(prev => !prev)}
        onNavigateHome={() => handleSeniorNavChange('home')}
        onOpenTalk={() => {
          setSeniorNavSection('talk');
          setIsTalkModalOpen(true);
        }}
        onOpenHelp={() => {
          setSeniorNavSection('help');
          setIsHelpModalOpen(true);
        }}
        onOpenStories={() => {
          setSeniorNavSection('stories');
          setIsStoryModalOpen(true);
        }}
        onOpenWishes={() => {
          setSeniorNavSection('wishes');
          setIsWishModalOpen(true);
        }}
        onOpenTrustedPeople={() => handleSeniorNavChange('trusted_people')}
        onOpenSettings={() => handleSeniorNavChange('settings')}
        onReadCurrentPage={() => handleTriggerReadCurrentPage()}
        onTriggerSOS={() => setIsSOSModalOpen(true)}
        guardianPhone={senior.guardianContact.phone}
        guardianName={senior.guardianContact.name}
      />

      {/* Read-Aloud Mode Player */}
      <ReadAloudPlayer
        isOpen={readAloudState.isOpen}
        onClose={() => setReadAloudState(prev => ({ ...prev, isOpen: false }))}
        textToRead={readAloudState.text}
        pageTitle={readAloudState.pageTitle}
      />

      {/* Lazy-Loaded Modals with Suspense */}
      <React.Suspense fallback={null}>
        <CompanionChatModal
          isOpen={isTalkModalOpen}
          onClose={() => {
            setIsTalkModalOpen(false);
            if (seniorNavSection === 'talk') setSeniorNavSection('home');
          }}
          senior={senior}
          onRequestHumanCompanion={() => {
            setIsTalkModalOpen(false);
            setSeniorNavSection('help');
            setIsHelpModalOpen(true);
          }}
        />

        <RecordStoryModal
          isOpen={isStoryModalOpen}
          onClose={() => {
            setIsStoryModalOpen(false);
            if (seniorNavSection === 'stories') setSeniorNavSection('home');
          }}
          senior={senior}
          onSaveStory={saveStory}
        />

        <RequestHelpModal
          isOpen={isHelpModalOpen}
          onClose={() => {
            setIsHelpModalOpen(false);
            if (seniorNavSection === 'help') setSeniorNavSection('home');
          }}
          senior={senior}
          onCreateRequest={createRequest}
        />

        <GoldenWishModal
          isOpen={isWishModalOpen}
          onClose={() => {
            setIsWishModalOpen(false);
            if (seniorNavSection === 'wishes') setSeniorNavSection('home');
          }}
          senior={senior}
          wishes={wishes}
          onCreateWish={createWish}
          onPledgeWish={(wishId) => pledgeWish(wishId)}
        />

        <EmergencySOSModal
          isOpen={isSOSModalOpen}
          onClose={() => setIsSOSModalOpen(false)}
          senior={senior}
        />

        <SafetyProtocolModal
          isOpen={isSafetyProtocolOpen}
          onClose={() => setIsSafetyProtocolOpen(false)}
        />

        <VisitVerificationModal
          isOpen={!!selectedVisitRequestId}
          onClose={() => setSelectedVisitRequestId(null)}
          request={activeVisitRequest}
          senior={senior}
          onCompleteVisit={(reqId: string, notes: string) => {
            completeVisit(reqId, notes);
            setSelectedVisitRequestId(null);
          }}
        />

        {/* Elder Scam & Financial Protection Shield */}
        <ScamShieldModal
          isOpen={isScamShieldOpen}
          onClose={() => setIsScamShieldOpen(false)}
          guardianPhone={senior.guardianContact.phone}
          guardianName={senior.guardianContact.name}
          onOpenReportModal={() => {
            setIsScamShieldOpen(false);
            setIsReportModalOpen(true);
          }}
        />

        {/* Jargon Simplifier Explainer Modal */}
        <SimplifyExplainerModal
          isOpen={isSimplifyModalOpen}
          onClose={() => setIsSimplifyModalOpen(false)}
          language={language}
        />

        {/* Trust & Safety Verification Standards Guide */}
        <VerificationDrawerModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          seniorPin={senior.safetyPin}
        />

        {/* Respect & Safety Reporting Tool */}
        <CommunityReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          seniorName={senior.preferredName}
          guardianName={senior.guardianContact.name}
        />
      </React.Suspense>
    </div>
  );
}

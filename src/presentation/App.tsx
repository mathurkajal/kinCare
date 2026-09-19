import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SeniorView } from './components/SeniorView';
import { VolunteerView } from './components/VolunteerView';
import { ProfessionalView } from './components/ProfessionalView';
import { GuardianView } from './components/GuardianView';
import { TrustedPeopleView } from './components/TrustedPeopleView';
import { SeniorSettingsView } from './components/SeniorSettingsView';
import { CompanionChatModal } from './components/CompanionChatModal';
import { RecordStoryModal } from './components/RecordStoryModal';
import { RequestHelpModal } from './components/RequestHelpModal';
import { GoldenWishModal } from './components/GoldenWishModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { SafetyProtocolModal } from './components/SafetyProtocolModal';
import { VisitVerificationModal } from './components/VisitVerificationModal';
import { HandsFreeVoiceOverlay } from './components/HandsFreeVoiceOverlay';
import { ReadAloudPlayer } from './components/ReadAloudPlayer';
import { OneHandBottomDock } from './components/OneHandBottomDock';
import { ScamShieldModal } from './components/ScamShieldModal';
import { SimplifyExplainerModal } from './components/SimplifyExplainerModal';
import { VerificationDrawerModal } from './components/VerificationDrawerModal';
import { CommunityReportModal } from './components/CommunityReportModal';

import {
  INITIAL_SENIORS,
  INITIAL_VOLUNTEERS,
  INITIAL_PROFESSIONALS,
  INITIAL_REQUESTS,
  INITIAL_GOLDEN_WISHES,
  INITIAL_LIFE_STORIES,
  INITIAL_AUDIT_LOGS,
} from '../infrastructure/testing/mockData';
import { 
  UserRole, 
  CareRequest, 
  GoldenWish, 
  LifeStoryChapter, 
  VisitAuditLog,
  SeniorNavSection,
  HandPreference,
  SupportedLanguage,
  ProactiveSuggestion,
  CommunityReport
} from '../shared/types';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('elderly');
  const [seniorNavSection, setSeniorNavSection] = useState<SeniorNavSection>('home');
  const [fontScale, setFontScale] = useState<'standard' | 'large' | 'xlarge'>('large');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  
  // Accessibility & Interaction preferences (Requirements 5, 8, 12, 13)
  const [isHandsFreeActive, setIsHandsFreeActive] = useState(false);
  const [handPreference, setHandPreference] = useState<HandPreference>('both');
  const [isOneHandMode, setIsOneHandMode] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [privacyShield, setPrivacyShield] = useState(true);

  // Synchronize accessibility styles to root
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [reducedMotion]);

  const [readAloudState, setReadAloudState] = useState<{ isOpen: boolean; text: string; pageTitle: string }>({
    isOpen: false,
    text: '',
    pageTitle: '',
  });

  // Persistent-like application state
  const [senior, setSenior] = useState(INITIAL_SENIORS[0]);
  const [volunteer, setVolunteer] = useState(INITIAL_VOLUNTEERS[0]);
  const [professional, setProfessional] = useState(INITIAL_PROFESSIONALS[0]);
  const [requests, setRequests] = useState<CareRequest[]>(INITIAL_REQUESTS);
  const [wishes, setWishes] = useState<GoldenWish[]>(INITIAL_GOLDEN_WISHES);
  const [stories, setStories] = useState<LifeStoryChapter[]>(INITIAL_LIFE_STORIES);
  const [auditLogs, setAuditLogs] = useState<VisitAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [reports, setReports] = useState<CommunityReport[]>([]);

  // Proactive Gentle Assistance Suggestions (Suggest, Not Assume)
  const [proactiveSuggestions, setProactiveSuggestions] = useState<ProactiveSuggestion[]>([
    {
      id: 'sug-1',
      type: 'hydration',
      title: 'Warm Afternoon in Oakridge (78°F)',
      message: 'It is a warm, sunny afternoon. Would you like a gentle reminder to sip a cool glass of water or herbal tea on the porch?',
      actionLabel: 'Sip Water & Relax',
      actionType: 'learn_more',
      dismissLabel: 'I am hydrated',
      urgency: 'gentle',
      timestamp: '2:15 PM',
    },
    {
      id: 'sug-2',
      type: 'upcoming_visit',
      title: 'Volunteer Visit Tomorrow at 3:00 PM',
      message: 'David Chen is scheduled to bring fresh community groceries and share tea tomorrow. Remember to ask for your secret arrival PIN 4821 before opening your door.',
      actionLabel: 'Review David’s Photo & PIN',
      actionType: 'open_visit_details',
      dismissLabel: 'Got it, thank you',
      urgency: 'gentle',
      timestamp: 'Yesterday',
    },
    {
      id: 'sug-3',
      type: 'activity',
      title: 'Record a New Family Memory Chapter',
      message: 'Your grandchildren loved your story about the 1964 World’s Fair. Would you like to record another 3-minute oral memory today?',
      actionLabel: 'Record a Memory',
      actionType: 'accept_help',
      dismissLabel: 'Maybe later',
      urgency: 'gentle',
      timestamp: 'Today',
    },
  ]);
  const [careNotes, setCareNotes] = useState([
    {
      id: 'note-1',
      seniorName: 'Margaret Higgins',
      author: 'Sarah Jenkins, RN, BSN (Lic #RN-88412)',
      text: 'Conducted fall-risk threshold inspection. Replaced loose hallway runner with non-skid backing. Sitting-to-standing balance is strong. Recommended daily 10-minute porch walks with her cane.',
      date: 'Sep 16, 2026',
    },
  ]);

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

  const handleAcceptSuggestion = (suggestion: ProactiveSuggestion) => {
    setProactiveSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    if (suggestion.actionType === 'open_visit_details') {
      setIsSafetyProtocolOpen(true);
    } else if (suggestion.actionType === 'accept_help') {
      setIsStoryModalOpen(true);
    } else {
      handleSpeakText(`You accepted: ${suggestion.title}. Thank you, ${senior.preferredName}.`);
    }
  };

  const handleDismissSuggestion = (id: string) => {
    setProactiveSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const handleCommunityReport = (report: CommunityReport) => {
    setReports(prev => [report, ...prev]);
  };

  const handleToggleVoice = () => {
    const newState = !isVoiceActive;
    setIsVoiceActive(newState);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (newState) {
        const utter = new SpeechSynthesisUtterance("Voice reading mode enabled. You can now tap any section or button to listen to it read aloud at a gentle pace.");
        utter.rate = 0.88;
        window.speechSynthesis.speak(utter);
      }
    }
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

  // Daily check-in handler
  const handleCheckInToday = (mood: 'happy' | 'peaceful' | 'tired' | 'lonely' | 'need_talk') => {
    setSenior(prev => ({
      ...prev,
      dailyCheckIn: {
        checkedInToday: true,
        lastCheckInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mood,
        checkInStreak: prev.dailyCheckIn.checkInStreak + 1,
      },
    }));

    handleSpeakText(`Thank you for checking in, ${senior.preferredName}. Your son David has received your morning message.`);
  };

  // Reversible Undo handler for accidental tap
  const handleResetCheckIn = () => {
    setSenior(prev => ({
      ...prev,
      dailyCheckIn: {
        checkedInToday: false,
        lastCheckInTime: undefined,
        mood: undefined,
        checkInStreak: Math.max(0, prev.dailyCheckIn.checkInStreak - 1),
      },
    }));
    handleSpeakText(`Morning check-in has been reset. You can tap any option again whenever you are ready.`);
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

  // Create care request
  const handleCreateRequest = (newReq: CareRequest) => {
    setRequests(prev => [newReq, ...prev]);
  };

  // Create golden wish
  const handleCreateWish = (newWish: GoldenWish) => {
    setWishes(prev => [newWish, ...prev]);
  };

  // Pledge wish
  const handlePledgeWish = (wishId: string, backerName?: string) => {
    setWishes(prev =>
      prev.map(w => {
        if (w.id === wishId) {
          return {
            ...w,
            status: 'fulfilled' as const,
            fulfilledByVolunteerName: backerName || 'David Chen (Verified Neighbor)',
          };
        }
        return w;
      })
    );
  };

  // Save story chapter
  const handleSaveStory = (story: LifeStoryChapter) => {
    setStories(prev => [story, ...prev]);
  };

  // Add verified clinical note
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

  const handleSeniorNavChange = (section: SeniorNavSection) => {
    setSeniorNavSection(section);
    if (section === 'talk') setIsTalkModalOpen(true);
    else if (section === 'help') setIsHelpModalOpen(true);
    else if (section === 'wishes') setIsWishModalOpen(true);
    else if (section === 'stories') setIsStoryModalOpen(true);
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
        onToggleHighContrast={() => setHighContrast(!highContrast)}
        onOpenScamShield={() => setIsScamShieldOpen(true)}
      />

      {/* Main Living Room Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
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
                onToggleOneHandMode={() => setIsOneHandMode(!isOneHandMode)}
                isHandsFreeActive={isHandsFreeActive}
                onToggleHandsFree={() => setIsHandsFreeActive(!isHandsFreeActive)}
                language={language}
                onLanguageChange={setLanguage}
                highContrast={highContrast}
                onToggleHighContrast={() => setHighContrast(!highContrast)}
                reducedMotion={reducedMotion}
                onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
                privacyShield={privacyShield}
                onTogglePrivacyShield={() => setPrivacyShield(!privacyShield)}
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
                onDismissSuggestion={handleDismissSuggestion}
                onCheckInToday={handleCheckInToday}
                onResetCheckIn={handleResetCheckIn}
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
            onPledgeWish={(wishId) => handlePledgeWish(wishId)}
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
              onClick={() => handleTriggerReadCurrentPage()}
              className="text-[#1E4D3B] hover:underline cursor-pointer font-bold"
            >
              ▶ Read This Page to Me
            </button>
            <span className="text-[#D3C4B0]">•</span>
            <button
              onClick={() => setIsSafetyProtocolOpen(true)}
              className="text-[#1E4D3B] hover:underline cursor-pointer font-bold"
            >
              Safety Guidelines & Arrival PIN Standards
            </button>
          </div>
        </div>
      </footer>

      {/* Optional One-Hand Bottom Dock on Mobile (Requirement 13) */}
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

      {/* Hands-Free Voice Assistant Controller & Floating Overlay (Requirements 5, 6, 7) */}
      <HandsFreeVoiceOverlay
        isHandsFreeActive={isHandsFreeActive}
        onToggleHandsFree={() => setIsHandsFreeActive(!isHandsFreeActive)}
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

      {/* Read-Aloud Mode Player (Requirement 8) */}
      <ReadAloudPlayer
        isOpen={readAloudState.isOpen}
        onClose={() => setReadAloudState(prev => ({ ...prev, isOpen: false }))}
        textToRead={readAloudState.text}
        pageTitle={readAloudState.pageTitle}
      />

      {/* Modals */}
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
        onSaveStory={handleSaveStory}
      />

      <RequestHelpModal
        isOpen={isHelpModalOpen}
        onClose={() => {
          setIsHelpModalOpen(false);
          if (seniorNavSection === 'help') setSeniorNavSection('home');
        }}
        senior={senior}
        onCreateRequest={handleCreateRequest}
      />

      <GoldenWishModal
        isOpen={isWishModalOpen}
        onClose={() => {
          setIsWishModalOpen(false);
          if (seniorNavSection === 'wishes') setSeniorNavSection('home');
        }}
        senior={senior}
        wishes={wishes}
        onCreateWish={handleCreateWish}
        onPledgeWish={(wishId) => handlePledgeWish(wishId)}
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
          setRequests(prev =>
            prev.map(r => (r.id === reqId ? { ...r, status: 'completed' } : r))
          );
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
    </div>
  );
}

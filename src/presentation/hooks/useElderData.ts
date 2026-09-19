import { useState, useCallback } from 'react';
import {
  INITIAL_SENIORS,
  INITIAL_VOLUNTEERS,
  INITIAL_PROFESSIONALS,
  INITIAL_REQUESTS,
  INITIAL_GOLDEN_WISHES,
  INITIAL_LIFE_STORIES,
  INITIAL_AUDIT_LOGS,
} from '../../infrastructure/testing/mockData';
import {
  SeniorProfile,
  VolunteerProfile,
  ProfessionalProfile,
  CareRequest,
  GoldenWish,
  LifeStoryChapter,
  VisitAuditLog,
  CommunityReport,
  ProactiveSuggestion,
} from '../../shared/types';

export function useElderData() {
  const [senior, setSenior] = useState<SeniorProfile>(INITIAL_SENIORS[0]);
  const [volunteer, setVolunteer] = useState<VolunteerProfile>(INITIAL_VOLUNTEERS[0]);
  const [professional, setProfessional] = useState<ProfessionalProfile>(INITIAL_PROFESSIONALS[0]);
  const [requests, setRequests] = useState<CareRequest[]>(INITIAL_REQUESTS);
  const [wishes, setWishes] = useState<GoldenWish[]>(INITIAL_GOLDEN_WISHES);
  const [stories, setStories] = useState<LifeStoryChapter[]>(INITIAL_LIFE_STORIES);
  const [auditLogs, setAuditLogs] = useState<VisitAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [reports, setReports] = useState<CommunityReport[]>([]);

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

  const checkInToday = useCallback((mood: 'happy' | 'peaceful' | 'tired' | 'lonely' | 'need_talk') => {
    setSenior((prev) => ({
      ...prev,
      dailyCheckIn: {
        checkedInToday: true,
        lastCheckInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        checkInStreak: prev.dailyCheckIn.checkInStreak + 1,
        mood,
      },
    }));
  }, []);

  const resetCheckIn = useCallback(() => {
    setSenior((prev) => ({
      ...prev,
      dailyCheckIn: {
        ...prev.dailyCheckIn,
        checkedInToday: false,
        checkInStreak: Math.max(1, prev.dailyCheckIn.checkInStreak - 1),
      },
    }));
  }, []);

  const saveStory = useCallback((newStory: LifeStoryChapter) => {
    setStories((prev) => [newStory, ...prev]);
  }, []);

  const createRequest = useCallback((newRequest: CareRequest) => {
    setRequests((prev) => [newRequest, ...prev]);
  }, []);

  const createWish = useCallback((newWish: GoldenWish) => {
    setWishes((prev) => [newWish, ...prev]);
  }, []);

  const pledgeWish = useCallback((wishId: string, backerName?: string) => {
    setWishes((prev) =>
      prev.map((w) =>
        w.id === wishId
          ? {
              ...w,
              status: 'fulfilled' as const,
              pledgedByVolunteerName: backerName || 'David Chen (Verified Neighbor)',
            }
          : w
      )
    );
  }, []);

  const dismissSuggestion = useCallback((id: string) => {
    setProactiveSuggestions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const submitReport = useCallback((report: CommunityReport) => {
    setReports((prev) => [report, ...prev]);
  }, []);

  const completeVisit = useCallback((reqId: string, notes: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'completed' } : r))
    );
    setAuditLogs((prev) => [
      {
        id: `audit-${Date.now()}`,
        requestId: reqId,
        seniorName: senior.name,
        volunteerName: volunteer.name,
        scheduledTime: 'Today, 2:00 PM',
        checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        checkOutTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        verifiedWithPin: true,
        seniorSatisfaction: 5,
        notes,
        familyNotified: true,
      },
      ...prev,
    ]);
  }, [senior.name, volunteer.name]);

  return {
    senior,
    setSenior,
    volunteer,
    setVolunteer,
    professional,
    setProfessional,
    requests,
    setRequests,
    wishes,
    setWishes,
    stories,
    setStories,
    auditLogs,
    reports,
    proactiveSuggestions,
    setProactiveSuggestions,
    careNotes,
    setCareNotes,
    checkInToday,
    resetCheckIn,
    saveStory,
    createRequest,
    createWish,
    pledgeWish,
    dismissSuggestion,
    submitReport,
    completeVisit,
  };
}

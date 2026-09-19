export type UserRole = 'elderly' | 'volunteer' | 'professional' | 'guardian';

export type SeniorNavSection = 
  | 'home'
  | 'talk'
  | 'help'
  | 'wishes'
  | 'stories'
  | 'trusted_people'
  | 'settings';

export type HandPreference = 'right' | 'left' | 'both';

export type SupportedLanguage = 'en' | 'es' | 'zh' | 'fr' | 'tl' | 'vi';

export interface ProactiveSuggestion {
  id: string;
  type: 'check_in' | 'hydration' | 'upcoming_visit' | 'weather_alert' | 'follow_up' | 'activity';
  title: string;
  message: string;
  actionLabel: string;
  actionType: 'confirm_check_in' | 'open_visit_details' | 'accept_help' | 'learn_more';
  dismissLabel: string;
  urgency: 'gentle' | 'helpful';
  timestamp: string;
}

export interface ScamCheckResult {
  isSuspicious: boolean;
  threatLevel: 'safe' | 'caution' | 'danger_scam';
  explanation: string;
  identifiedTactics: string[];
  safeActionAdvice: string[];
  reviewedBy: string;
}

export interface CommunityReport {
  id: string;
  reportedUserId?: string;
  reportedUserName: string;
  reason: 'financial_request' | 'unauthorized_clinical' | 'inappropriate_conduct' | 'boundary_violation' | 'scam_attempt' | 'other';
  description: string;
  timestamp: string;
  status: 'pending_review' | 'investigating' | 'resolved';
}

export type ProfessionalType = 
  | 'Doctor'
  | 'Nurse (RN/BSN)'
  | 'Physiotherapist'
  | 'Caregiver / CNA'
  | 'Pharmacist'
  | 'Social Worker (LCSW)'
  | 'Legal Advisor / Elder Law'
  | 'Counselor / Psychologist'
  | 'Emergency Responder';

export interface SeniorProfile {
  id: string;
  name: string;
  preferredName: string;
  age: number;
  avatar: string;
  neighborhood: string;
  bio: string;
  interests: string[];
  languages: string[];
  mobilityNotes: string;
  dietaryRestrictions: string;
  safetyPin: string; // 4-digit code elder uses to verify any arriving companion
  guardianContact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
    notificationPreferences: string[];
  };
  dailyCheckIn: {
    checkedInToday: boolean;
    lastCheckInTime?: string;
    mood?: 'happy' | 'peaceful' | 'tired' | 'lonely' | 'need_talk';
    checkInStreak: number;
  };
}

export type VolunteerVerificationTier = 
  | 'tier_0_pending'
  | 'tier_1_id_verified'
  | 'tier_2_background_cleared'
  | 'tier_3_certified_senior_companion';

export interface VolunteerProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  profession: string;
  neighborhood: string;
  bio: string;
  verificationTier: VolunteerVerificationTier;
  idVerified: boolean;
  criminalBackgroundCleared: boolean;
  referenceCheckCleared: boolean;
  trainingModulesCompleted: string[];
  trustScore: number; // e.g. 98%
  completedVisitsCount: number;
  volunteerHours: number;
  languages: string[];
  skills: string[];
  badges: string[];
  reviewsCount: number;
  rating: number;
}

export interface ProfessionalProfile {
  id: string;
  name: string;
  avatar: string;
  profession: ProfessionalType;
  licenseNumber: string;
  issuingBoard: string;
  yearsOfExperience: number;
  verifiedCredentials: boolean;
  verificationBadge: string;
  specialties: string[];
  bio: string;
  servicesOffered: string[];
  rating: number;
  reviewsCount: number;
  isAvailableForProBono: boolean;
}

export type RequestCategory = 
  | 'conversation'
  | 'groceries'
  | 'tech_help'
  | 'appointment_escort'
  | 'home_chores'
  | 'golden_wish'
  | 'professional_care';

export type RequestPriority = 'routine' | 'scheduled' | 'urgent';
export type RequestStatus = 'open' | 'matched' | 'in_progress' | 'completed' | 'cancelled';

export interface CareRequest {
  id: string;
  seniorId: string;
  seniorName: string;
  seniorAge: number;
  seniorAvatar: string;
  neighborhood: string;
  title: string;
  category: RequestCategory;
  priority: RequestPriority;
  description: string;
  dateNeeded: string;
  estimatedDuration: string;
  status: RequestStatus;
  safetyNotes: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  assignedVolunteerAvatar?: string;
  assignedProfessionalId?: string;
  assignedProfessionalName?: string;
  assignedProfessionalRole?: string;
  safetyPin: string;
  createdAt: string;
  isProfessionalOnly?: boolean;
}

export interface GoldenWish {
  id: string;
  seniorId: string;
  seniorName: string;
  seniorAvatar: string;
  title: string;
  description: string;
  category: 'nostalgia' | 'creative' | 'outing' | 'skill' | 'culinary' | 'connection';
  status: 'open' | 'pledged' | 'in_progress' | 'fulfilled';
  pledgedByVolunteerName?: string;
  fulfillmentNotes?: string;
  memoryKeepsakePhoto?: string;
  createdAt: string;
}

export interface LifeStoryChapter {
  id: string;
  seniorId: string;
  seniorName: string;
  title: string;
  theme: 'Early Memories' | 'Life Lessons' | 'Love & Family' | 'Career & Calling' | 'Wisdom for Youth';
  promptQuestion: string;
  audioDuration?: string;
  transcript: string;
  refinedStory: string;
  lifeLessonTakeaway: string;
  recordedDate: string;
  isSharedWithFamily: boolean;
}

export interface SafetySOSAlert {
  id: string;
  seniorId: string;
  seniorName: string;
  timestamp: string;
  status: 'active' | 'responded' | 'resolved';
  location: string;
  emergencyType: 'Medical Assistance' | 'Fall Suspected' | 'Emotional Distress' | 'Urgent Support';
  notifiedContacts: string[];
  assignedResponder?: string;
}

export interface VisitAuditLog {
  id: string;
  requestId: string;
  seniorName: string;
  volunteerName: string;
  scheduledTime: string;
  checkInTime?: string;
  checkOutTime?: string;
  verifiedWithPin: boolean;
  seniorSatisfaction?: number;
  notes: string;
  familyNotified: boolean;
}
